const _ = require('lodash')
const async = require('async')
const FavoriteModel = require('../../model/favorite');
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

module.exports = (req, res) => {

    const userId = req.body.userId || '';
    const from = req.body.from || Date.now();

    FavoriteModel
    .find({
      member:userId,
      status:1,
      createdAt: {$lt:from}
    })
    .sort({
      createdAt: -1
    })
    .limit(10)
    .select({
      _id:1,
      photo:1,
      name:1,
      placeId:1,
      address:1,
      createdAt:1,
      rating:1
    })
    .lean()
    .exec((err,result) => {
      if(err || result === null) {
        console.log('ahihi',err);
        res.json({
          code: CONSTANTS.CODE.SYSTEM_ERROR,
        })
      }
      return res.json({
        code: CONSTANTS.CODE.SUCCESS,
        data: result
      });
    })
}
