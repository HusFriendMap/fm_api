const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');
const FavoriteModel = require('../../model/favorite')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {
  const userId = req.body._id;
  const placeId = req.body.placeId || '';

  const checkParams = (next) => {
    if(!placeId) {
      return next({
        code: CONSTANTS.CODE.WRONG_PARAMS,
      })
    }
    if(!userId) {
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
  const removeFavorite = (next) => {
    FavoriteModel
    .findOneAndUpdate({
      member: userId,
      placeId,
      status:1
    }, {status:0})
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
    removeFavorite
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
