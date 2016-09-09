var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var articles = require('./routes/articles');
var upload = require('./routes/upload');
var Grid = require('gridfs-stream');
var fs = require('fs');
var app = express();
var busboy = require('connect-busboy');

var routes = require('./routes/index');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/altiwiki');
  
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;

conn.once('open', function(){
    console.log('open altiwiki database');
    var gfs = Grid(conn.db);
	app.set('gridfs', gfs);
	console.log('gridfs-stream setup done');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboy());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/articles', articles);
app.use('/upload', upload);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
