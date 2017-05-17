var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');

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

app.use('/', index);
app.use('/users', users);

// mongoose

// Database configuration with mongoose
// LOCAL ENVIRONMENT
mongoose.connect("mongodb://localhost/nom");
// PRODUCTION ENVIRONMENT
// mongoose.connect("mongodb://admin:codingrocks@ds023674.mlab.com:23674/heroku_5ql1blnl");
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
          phoneNumber: {
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
          },
          truckName: {
            enabled: true,
            label: 'TRUCKS ONLY! Truck Name',
            placeholder: 'Burger Time',
            required: false,
            type: "text"
          },
          foodType: {
            enabled: true,
            label: 'TRUCKS ONLY! Food Type',
            placeholder: 'What type of food do you serve?',
            required: false,
            type: "text"
          },
          website: {
            enabled: true,
            label: 'TRUCKS ONLY! Website',
            placeholder: 'www.website.com',
            required: false,
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
