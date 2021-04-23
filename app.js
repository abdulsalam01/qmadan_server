//
const { graphqlUploadExpress } = require('graphql-upload');
const graphQLHttp = require('express-graphql');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

// call graphql process
const schemaApp = require('./rootSchema');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

const root = {
  hello: 'Hello world!'
}

// base url getter
app.use((req, res, next) => {
  baseUrl = true ? req.headers.host : req.headers.origin;
  next();
});

// api request
app.use('/api', graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 3}),
  graphQLHttp({
    schema: schemaApp,
    graphiql: true,
    rootValue: root
  })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
