var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Imports the route handlers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { sequelize } = require('./models/index');
var app = express();

// IIFE asynchronously authenticates database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// views the engine setup from pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sets up more routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catches 404 error and forwards to error handler
app.use(function(req, res, next) {
  const err = new Error("Page Not Found!");
  err.status = 404;
  err.message = "Sorry! We couldn't find the page you were looking for."
  res.render('page-not-found', { err });
  //next(createError(404));
});

// the error handler
app.use(function(err, req, res, next) {
  err.status = err.status || 500;
  err.message= 'Sorry! There was an unexpected error on the server.';
  console.error(err.status, err.message);
  res.render('error', { err });
});

module.exports = app;
