const _ = require('lodash')
const config = require('config')
const express = require('express')
const Logger = require('./lib/logger')

// Global variables
global.logger = Logger(`${__dirname}/logs`);

// Middleware
const bodyParser = require('body-parser')

// Handle routes

// Start server, socket
const app = express();
const server = require('http').Server(app);

app.use(express.static('public'))
app.use(bodyParser.json());

// Routes

const port = _.get(config, 'port', 3000);
server.listen(port, () => {
  logger.logInfo('Server listening at port:', port)
});

process.on('uncaughtException', (err) => {
  logger.logError('uncaughtException', err)
});
