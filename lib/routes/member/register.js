const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');
const MemberModel = require('../../model/member')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {

  const name = req.body.name || '';
  const email = req.body.email || '';
  let password = req.body.password || '';
  const rePass = req.body.rePass || '';

  const checkParams = (next) => {
    if(!name || !email || !password || !rePass) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: {
          'head': 'Thông báo',
          'body': 'Vui lòng kiểm tra lại dữ liệu vừa nhập'
        }
      })
    }
    if(rePass !== password) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: {
          'head': 'Thông báo',
          'body': 'Nhập lại mật khẩu sai'
        }
      })
    }
    next();
  }

  const checkMailExist = (next) => {
    MemberModel.find({email:email})
    .lean()
    .exec((err, result) => {
      if(err) {
        return next(err);
      }
      if(result.length !== 0) {
        return next({
          code: CONSTANTS.CODE.WRONG_PARAMS,
          message: {
            'head': 'Thông báo',
            'body': 'Email đã tồn tại!'
          }
        });
      }
      next();
    })
  }

  const hashPassword = (next) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if(err) {
        return next(err);
      }

      password = hash;
      next();
    });
  }

  const createMember = (next) => {
    const memberToken = jwt.sign({email: email, name: name}, config.jwt.secret)
    const objMember = {
      name, email, password, memberToken
    }
    MemberModel.create(objMember,(err,results)=>{
      if(err) {
        return next(err);
      }
      next({
        code:200
      })
    })
  }

  async.waterfall([
    checkParams,
    checkMailExist,
    hashPassword,
    createMember
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
