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
  let photo = req.body.photo || '';
  const name = req.body.name || '';
  const address = req.body.address || '';
  const rating = req.body.rating
  let hasLoved = false

  const checkParams = (next) => {
    if(!placeId || !name || !address || !rating) {
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

  const checkHasLoved = (next) => {
    FavoriteModel.findOne({
      member: userId,
      placeId,
      status:0
    })
    .lean()
    .exec((err,result) => {
      if(result) {
        hasLoved = true;
        FavoriteModel
        .findOneAndUpdate({
          _id:result._id
        }, {status:1})
        .lean()
        .exec((err, result) => {
          next();
        })
      } else {
        next();
      }
    })
  }

  const addFavorite = (next) => {
    if(hasLoved) {
      return next({
        code:CONSTANTS.CODE.SUCCESS
      });
    }
    const objFvr = {
      member: userId,
      photo,
      name,
      placeId,
      address,
      rating
    }
    FavoriteModel.create(objFvr,(err,results)=>{
      if(err) {
        return next(err);
      }
      next({
        code:CONSTANTS.CODE.SUCCESS
      })
    })
  }

  async.waterfall([
    checkParams,
    checkHasLoved,
    addFavorite
  ], (err, data) => {
    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: MESSAGES.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
