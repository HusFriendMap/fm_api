const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');

module.exports = (req, res) => {
  const location = _.get(req, 'body.location', [20.9891121, 105.844389]);
  const type = _.get(req, 'body.type', '');
  let objSearch = {};
  if(type !== '') {
    objSearch = {
      language: 'vi',
      location: location,
      type,
      rankby: 'distance'
    }
  } else {
    objSearch = {
      language: 'vi',
      location: location,
      rankby: 'distance'
    }
  }


  // if(region === 'hn') {
  //   objSearch.location = [21.0227431, 105.8194541];
  //   objSearch.radius = 10000;
  // } else if(region === 'hcm') {
  //   objSearch.location = [10.7925303,106.6564343];
  //   objSearch.radius = 10000;
  // }

  googleMapsClient.placesNearby(objSearch, (err, response) => {
    if(err) {
      console.log(err);
      return res.json({
        code: 500
      })
    }
    let objResult = [];
    response.json.results.forEach((searchResult) => {
      objResult.push({
        location: searchResult.geometry.location,
        id: searchResult.id,
        name: searchResult.name,
        place_id: searchResult.place_id,
        photo: searchResult.photos ? `https://maps.googleapis.com/maps/api/place/photo?photoreference=${searchResult.photos[0].photo_reference}&sensor=false&maxheight=450&maxwidth=450&key=${config.google.apiKey}` : '',
        address: searchResult.vicinity,
        defaultPhoto: `http://www.wijchensnieuws.nl/wp-content/uploads/2015/10/school.gif`
      })
    })
    res.json({
      code:200,
      data:objResult
    });
  });
}
