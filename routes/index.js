var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');
var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');

/* GET home page. */
router.get('/',stormpath.loginRequired, function(req, res, next) {
    if (req.user.customData.group === 'user') {
        res.sendFile(path.join(__dirname, '/../views/index.html'));
    }
    else {
        res.sendFile(path.join(__dirname, '/../views/indexAdmin.html'));
    }
});

// TESTING -  route to populate db w test data

router.get('/init', stormpath.loginRequired,function (req, res) {
    try {
      Trucks.insertMany( [
        { clickId: 'Truck1',
            ownerName: 'Owner1',
            truckName: 'Truck1',
            status: false},
        { clickId: 'Truck2',
            ownerName: 'Owner2',
            truckName: 'Truck2',
            status: false},
        { clickId: 'Truck3',
            ownerName: 'Owner3',
            truckName: 'Truck3',
            status: false}      
      ] );
    }
     catch (e) {
        console.log(e);
    }   
});

router.post('/postloc', stormpath.loginRequired, function (req, res) {
    console.log('post location route hit');
    console.log(req.body);
    var truckName = req.body.truckName;
    var lat = req.body.lat;
    var long = req.body.long;

    //status handler
    var status = req.body.status;
    if (status === 'on') {
        status = true;
    } 
    else {
        status = false;
    }
    console.log('Status ', status);

    // toggle status in  model
    if(!status) {
        Trucks.findOneAndUpdate({
            truckName: truckName
        }, {
            $set: {
            status: false
            }
        }, { upsert: true }).exec(function(err) {

            if (err) {
            console.log(err);
            }
            else {
            res.send("Status: Off-duty");
            }
        });
    } 

    // if signing on/reporting location
    else {
        Trucks.findOneAndUpdate({
            truckName: truckName
        }, {
            $set: {
            status: true,
            lat: lat,
            long: long
            }
        }, { upsert: true }).exec(function(err) {

            if (err) {
            console.log(err);
            }
            else {
            res.send("Status: On-duty");
            }
        });
    }

})


// This is the route we will send GET requests to retrieve our most recent click data.
// We will call this route the moment our page gets rendered
router.get("/api", function(req, res) {

  // This GET request will search for all available trucks.
  Trucks.find({where: {status: true}}).exec(function(err, doc) {

    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// This is the route we will send POST requests to save each click.
// We will call this route the moment the "click" or "reset" button is pressed.
router.post("/api", function(req, res) {

  var clickID = req.body.clickID;
  var favorites = parseInt(req.body.favorites);

  // Note how this route utilizes the findOneAndUpdate function to update the clickCount
  // { upsert: true } is an optional object we can pass into the findOneAndUpdate method
  // If included, Mongoose will create a new document matching the description if one is not found
  Trucks.findOneAndUpdate({
    clickID: clickID
  }, {
    $set: {
      favorites: favorites
    }
  }, { upsert: true }).exec(function(err) {

    if (err) {
      console.log(err);
    }
    else {
      res.send("Updated Click Count!");
    }
  });
});

// Route to see trucks that have been favorited
router.get("/recents", function(req, res) {
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
router.get("/favorites", function(req, res) {
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

// Route to see what user looks like without populating
router.get("/user", function(req, res) {
  // Find all users in the user collection with our User model
  User.find({}, function(error, doc) {
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

// New note creation via POST route
router.post("/submit", function(req, res) {
  // Use our Truck model to make a new favorite truck from the req.body
  var newTruck = new Truck(req.body);
  // Save the new note to mongoose
  newTruck.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our user and push the new truck name into the User's favorites array
      User.findOneAndUpdate({}, { $push: { "favorites": doc.truckName } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });
});


module.exports = router;
