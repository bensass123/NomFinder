var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');
var handlebars = require("express-handlebars");

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use('/', index);
app.use('/users', users);

// mongoose

// Database configuration with mongoose
// LOCAL ENVIRONMENT
// mongoose.connect("mongodb://localhost/nom");
// PRODUCTION ENVIRONMENT
mongoose.connect("mongodb://heroku_nmzmdh95:89cihl0hmds6foh6ve56rqpn55@ds151941.mlab.com:51941/heroku_nmzmdh95");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// stormpath 

app.use(stormpath.init(app, {
  preRegistrationHandler: function (formData, req, res, next) {
    if (!(formData.group === 'user' || formData.group === 'admin')) {
      return next(new Error('You must be a user or an admin.'));
    }
    next();
  },
  website: true,
  web: {
    me: {
      expand: {
        customData: true
      }
    },
    login: {
      nextUri: '/'
    },
    register: {
      autoLogin: true,
      nextUri: '/',
      form: {
        fields: {
            phone: {
              enabled: true,
              label: 'Phone Number',
              placeholder: '555-555-5555',
              required: true,
              type: "text"
            },
            group: {
              enabled: true,
              label: 'User/Admin',
              placeholder: 'user',
              required: true,
              type: "text"
            }
        }
      }
    }
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
