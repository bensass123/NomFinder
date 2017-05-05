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

// New seeing all favorited trucks from one given user
router.get("/favorites", stormpath.loginRequired, function(req, res) {
  // Unwinding (splitting up the array) the user's favorite trucks from the favoite field in the user collection.
  User.aggregate([{$unwind: "$favorites"}], function(err, doc){
    if (err){
      console.log(err);
    } else {
      // Doc is stored as favs.
      var favs = doc;
      // favoriteTrucks is an empty array that will store all of the user's favorite trucks.
      var favoriteTrucks = [];
      // Looping through the length of the results(docs aka favs) 
      // and pushing all favorites into the favoriteTrucks array.
      for (var i = 0; i < favs.length; i++) {
        favoriteTrucks.push(favs[i].favorites);
      }
      res.send(favoriteTrucks);
    }
  }); 
});

// New note creation via POST route
router.post("/favorites/:truckName", stormpath.loginRequired, function(req, res) {

  var truckName = req.body;
      // Find our user and push the new truck name into the User's favorites array
      User.update({username: req.user.username}, { $push: { favorites: truckName } }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
});


router.delete("/favorites/:truckName", stormpath.loginRequired, function(req, res){
  
  User.aggregate([{$unwind: "$favorites"}], function(err, doc){
    if (err){
      console.log(err);
    } else {
      // Doc is stored as favs.
      var favs = doc;
      // favoriteTrucks is an empty array that will store all of the user's favorite trucks.
      var favoriteTrucks = [];
      // Looping through the length of the results(docs aka favs) 
      // and pushing all favorites into the favoriteTrucks array.
      for (var i = 0; i < favs.length; i++) {
        favoriteTrucks.push(favs[i].favorites);
      }

      favoriteTrucks.find()
      
      User.deleteOne({favorites: req.params}, function(err, doc){
        if (err){
          console.log(err);
        } else {
          res.send(doc);
        }
      });
    }
  }); 

});

module.exports = router;