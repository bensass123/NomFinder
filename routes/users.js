var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');
var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');
var helpers = require('./helpers.js');


/* GET users listing. */
router.get('/', stormpath.loginRequired, function(req, res, next) {
  res.send('respond with a resource');
});

// Route to see trucked that have been favorited
router.get("/trucks", stormpath.loginRequired, function(req, res) {
  // Find all notes in the note collection with our Note model
  Truck.find({}, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.send(doc);
    }
  });
});

module.exports = router;