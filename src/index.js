'use strict';

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config');
const middleware = require('./middleware');
const socket = require('./socket');
const utils = require('./utils');

// initilaize the application
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (config.env !== 'test') {
  app.use(morgan('common'));
}

// setup application routes
app.get('/', (req, res, next) => {
  return res.render('room');
});

app.all('*', (req, res, next) => {
  const error = utils.createError(404, 'Path not found');
  return next(error);
});

// setup error handler;
app.use(middleware.handleError);

// add sockets
const server = socket(app);

// listen to server
server.listen(config.port, () => {
  console.log('Server started on port', config.port);
});

module.exports = server;
