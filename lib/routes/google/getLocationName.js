const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')

module.exports = (req, res) => {
  const lat = _.get(req, 'body.lat', '');
  const lng = _.get(req, 'body.lng', '');

  const checkParams = (next) => {
    if(!lat || !lng) {
      return next({
        code: CONSTANTS.CODE.SUCCESS,
        data: 'Unnamed Road'
      });
    }

    next();
  }

  const getLocationName = (next) => {
    googleMapsClient.reverseGeocode({
     latlng: [lat, lng],
   }, (err, data) => {
     if(err || !data) {
       return next(err || new Error(`No reponse from Google`));
     }

     data = data.json;
     if(data.status !== 'OK') {
       return next({
         code: CONSTANTS.CODE.SUCCESS,
         data: 'Unnamed Road'
       });
     }

     let nameOfLocation = data.results[0] ? data.results[0].formatted_address :'Unnamed Road';
     nameOfLocation = nameOfLocation.replace(', Hà Nội, Vietnam', '');
     nameOfLocation = nameOfLocation.replace(', Hà Nội, Việt Nam', '');

     next(null, {
       code: CONSTANTS.CODE.SUCCESS,
       data: nameOfLocation
     });
   });
  }

  async.waterfall([
    checkParams,
    getLocationName
  ], (err, data) => {
    // logger.logInfo(err, data);

    err && _.isError(err) && (data = {
        code: CONSTANTS.CODE.SYSTEM_ERROR,
        message: message.SYSTEM.ERROR
    });

    res.json(data || err);
  })
}
