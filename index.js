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
// Handle routes

// Start server, socket
const app = express();
const server = require('http').Server(app);

app.use(bodyParser.json());

// Routes

app.post('/api/v1.0/google/search-places', GoogleHandle.placeSearch);
app.post('/api/v1.0/google/place-detail', GoogleHandle.placeDetail);
app.post('/api/v1.0/app/list-available-services', App.listServiceAvailable);

const port = _.get(config, 'port', 3000);
server.listen(port, () => {
  logger.logInfo('Server listening at port:', port)
});

process.on('uncaughtException', (err) => {
  logger.logError('uncaughtException', err)
});
