const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');
const MemberModel = require('../../model/member')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {
  const _id = req.body._id;
  const name = req.body.name || '';
  let phone = req.body.phone || '';
  const address = req.body.address || '';

  const checkParams = (next) => {
    if(!name && !phone && !address) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: {
          'head': 'Thông báo',
          'body': 'Vui lòng kiểm tra lại dữ liệu vừa nhập'
        }
      })
    }
    if(!_id) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
        message: {
          'head': 'Thông báo',
          'body': 'Hệ thống đang bận, vui lòng thử lại'
        }
      })
    }
    next();
  }
  const checkMemberInfo = (next) => {
    MemberModel
      .find({_id:_id})
      .lean()
      .exec((err, result) => {
        if(err) {
          return next(err);
        }
        if(result[0].name === name && result[0].phone === phone && result[0].address === address) {
          return next({
            code: CONSTANTS.CODE.WRONG_PARAMS,
            message: {
              'head': 'Thông báo',
              'body': 'Bạn chưa thay đổi thông tin cập nhật'
            }
          })
        }
        next();
      })
  }
  const updateMember = (next) => {
    let objUpdate = {};
    if(name) {
      objUpdate.name = name
    }
    if(phone) {
      objUpdate.phone = phone
    }
    if(address) {
      objUpdate.address = address
    }
    MemberModel
      .findOneAndUpdate({
        _id: _id
      }, objUpdate)
      .lean()
      .exec((err, result) => {
        if(err) {
          return next(err);
        }
        next({
          code:CONSTANTS.CODE.SUCCESS
        });
      })
  }

  async.waterfall([
    checkParams,
    checkMemberInfo,
    updateMember
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
