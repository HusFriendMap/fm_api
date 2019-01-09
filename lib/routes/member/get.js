const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');
const MemberModel = require('../../model/member')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {

  const getMember = (next) => {
    MemberModel
      .find({_id:req.body._id})
      .lean()
      .exec((err, result) => {
        if(err) {
          return next(err);
        }
        if(result.length === 0) {
          return next({
            code: CONSTANTS.CODE.WRONG_PARAMS,
            message: {
              'head': 'Thông báo',
              'body': 'Hệ thống đang bận vui lòng thử lại'
            }
          })
        }
        userInf = result[0];
        next({
          code:CONSTANTS.CODE.SUCCESS,
          data:{
            member:userInf
          }
        });
      })
  }

  async.waterfall([
    getMember
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
