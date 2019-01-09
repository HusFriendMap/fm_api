const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');
const MemberModel = require('../../model/member')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {

  const email = req.body.email || '';
  let password = req.body.password || '';
  let userInf;

  const checkParams = (next) => {
    if(!email || !password) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: {
          'head': 'Thông báo',
          'body': 'Vui lòng kiểm tra lại dữ liệu vừa nhập'
        }
      })
    }
    next();
  }

  const accountExist = (next) => {
    MemberModel.find({email:email})
    .lean()
    .exec((err, result) => {
      if(err) {
        return next(err);
      }
      if(result.length === 0) {
        return next({
          code: CONSTANTS.CODE.SYSTEM_ERROR,
          message: {
            'head': 'Thông báo',
            'body': 'Không tồn tại tài khoản này!'
          }
        });
      }
      userInf = result[0]
      next();
    })
  }

  const checkPassword = (next) => {
    bcrypt.compare(password, userInf.password, function(err, res) {
      if(err) {
        return next(err);
      }

      if(!res) {
        return next({
          code: CONSTANTS.CODE.FAIL,
          message: {
            'head': 'Thông báo',
            'body': 'Mật khẩu không chính xác, vui lòng thử lại. Xin cảm ơn.'
          }
        })
      }
      next({
        code:CONSTANTS.CODE.SUCCESS,
        data:{
          member:userInf
        }
      });
    });
  }

  async.waterfall([
    checkParams,
    accountExist,
    checkPassword
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
