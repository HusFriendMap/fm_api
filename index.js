const _ = require('lodash')
const config = require('config')
const express = require('express')
const Logger = require('./lib/logger')

// Global variables
global.logger = Logger(`${__dirname}/logs`);
global.googleMapsClient = require('@google/maps').createClient({
  key: _.get(config, 'google.apiKey', '')
});


// Middleware
const bodyParser = require('body-parser')
const GoogleHandle = require('./lib/routes/google');
const App = require('./lib/routes/app');
const MemberHandel = require('./lib/routes/member');
const FavoriteHandel = require('./lib/routes/favorite');
// Handle routes

// Start server, socket
const app = express();
const server = require('http').Server(app);

app.use(bodyParser.json());

// Routes

app.post('/api/v1.0/google/search-places', GoogleHandle.placeSearch);
app.post('/api/v1.0/google/place-detail', GoogleHandle.placeDetail);
app.post('/api/v1.0/google/get-location-name', GoogleHandle.getLocationName);
app.post('/api/v1.0/app/list-available-services', App.listServiceAvailable);

app.post('/api/v1.0/member/register', MemberHandel.register);
app.post('/api/v1.0/member/login', MemberHandel.login);
app.post('/api/v1.0/member/update', MemberHandel.update);
app.post('/api/v1.0/member/get', MemberHandel.get);

app.post('/api/v1.0/member/add-favorite-place', FavoriteHandel.addFavoritePlace);
app.post('/api/v1.0/member/remove-favorite-place', FavoriteHandel.removeFavorite);
app.post('/api/v1.0/member/list-favorite-place', FavoriteHandel.list);

const port = _.get(config, 'port', 3000);
server.listen(port, () => {
  logger.logInfo('Server listening at port:', port)
});

process.on('uncaughtException', (err) => {
  logger.logError('uncaughtException', err)
});
