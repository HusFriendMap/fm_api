const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');
const FavoriteModel = require('../../model/favorite')

module.exports = (req, res) => {
  const placeId = _.get(req, 'body.placeId', '');
  const userId = _.get(req, 'body.userId', '');
  let hasLoved = false;

  if(userId) {
    FavoriteModel.findOne({
      member:userId,
      placeId,
      status:1
    })
    .lean()
    .exec((err, result) => {
      if(result) {
        hasLoved = true
      }

      googleMapsClient.place({placeid: placeId}, (err, response) => {
        if(err) {
          console.log(err);
          return res.json({
            code: 500
          })
        }
        const detail = response.json.result;
        let objResult = {
          name: detail.name,
          openingHour: detail.opening_hours ? {
            open_now: detail.opening_hours.open_now,
            hours: detail.opening_hours.weekday_text[0].replace("Monday:",""),
          }:'',
          place_id: detail.place_id,
          reference: detail.reference,
          address: detail.vicinity,
          website: detail.website,
          location: detail.geometry.location,
          rating: detail.rating,
          linkShare: detail.url,
          fullAddress: detail.formatted_address,
          hasLoved
        }
        let photos = []
        if(detail.photos) {
          detail.photos.forEach((photo) => {
            photos.push(`https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&sensor=false&maxheight=450&maxwidth=450&key=${config.google.apiKey}`)
          })
          objResult.photos = photos
        }

        res.json({
          code:200,
          data:objResult
        });
      });
    })
  } else {
    googleMapsClient.place({placeid: placeId}, (err, response) => {
      if(err) {
        console.log(err);
        return res.json({
          code: 500
        })
      }
      const detail = response.json.result;
      let objResult = {
        name: detail.name,
        openingHour: detail.opening_hours ? {
          open_now: detail.opening_hours.open_now,
          hours: detail.opening_hours.weekday_text[0].replace("Monday:",""),
        }:'',
        place_id: detail.place_id,
        reference: detail.reference,
        address: detail.vicinity,
        website: detail.website,
        location: detail.geometry.location,
        rating: detail.rating,
        linkShare: detail.url,
        fullAddress: detail.formatted_address
      }
      let photos = []
      if(detail.photos) {
        detail.photos.forEach((photo) => {
          photos.push(`https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&sensor=false&maxheight=450&maxwidth=450&key=${config.google.apiKey}`)
        })
        objResult.photos = photos
      }

      res.json({
        code:200,
        data:objResult
      });
    });
  }
}
