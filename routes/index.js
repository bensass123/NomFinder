var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');
var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');
var helpers = require('./helpers.js');

/* GET home page. */
router.get('/',stormpath.loginRequired, function(req, res, next) {
    if (req.user.customData.group === 'user') {
        res.sendFile(path.join(__dirname, '/../views/index.html'));
    }
    else {
        res.sendFile(path.join(__dirname, '/../views/indexAdmin.html'));
    }
});

// TESTING - TEMP ROUTE FOR USER FRONTEND

router.get('/userfrontend',stormpath.loginRequired, function(req, res, next) {
    res.sendFile(path.join(__dirname, '/../views/index.html'));
})



// testing - route to populate db w test data, use update instead, upsert

router.get('/init', stormpath.loginRequired,function (req, res) {
    helpers.updateWith('Truck1', 'Owner1', 'Truck1', true, 35.0535596, -80.82116959999999);
    helpers.updateWith('Truck2', 'Owner2', 'Truck2', true, 35.1535596, -80.82116959999999);
    helpers.updateWith('Truck3', 'Owner3', 'Truck3', true, 35.0535596, -80.92116959999999);
    helpers.updateWith('Truck4', 'Owner4', 'Truck4', true, 35.2535596, -80.82116959999999);

    //return all trucks
    Trucks.find({}).exec(function(err, doc) {
        if (err) {
        console.log(err);
        }
        else {
        res.send(doc);
        }
    });
});




// TESTING - RETURN ALL TRUCKS IN DB REGARDLESS OF STATUS

router.get("/alltrucks", function(req, res) {

  // This GET request will search for all available trucks.
  Trucks.find({}).exec(function(err, doc) {

    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// TESTING, DROP ALL TRUCKS DOCUMENTS

router.get("/deletetrucks", function(req, res) {
    Trucks.remove({}, function(err) { 
        res.send('trucks removed');
        
    });
});

router.post('/addtruck', stormpath.loginRequired, function (req, res) {
    req.body.truckName;
    req.body.ownerName;
    req.body.clickI
    helpers.updateWith('Truck1', 'Owner1', 'Truck1');
})

// posts lat and long data to truck and/or updates status

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
            res.send(truckName + " Status: Off-duty");
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
            res.send(truckName + " Status: On-duty");
            }
        });
    }

})


// This is the route we will send GET requests to retrieve our most recent click data.
// We will call this route the moment our page gets rendered
router.get("/api", function(req, res) {

  // This GET request will search for all available trucks.
  Trucks.find({status: true}).exec(function(err, doc) {

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

  var clickId = req.body.clickId;
  var favorites = parseInt(req.body.favorites);

  // Note how this route utilizes the findOneAndUpdate function to update the clickCount
  // { upsert: true } is an optional object we can pass into the findOneAndUpdate method
  // If included, Mongoose will create a new document matching the description if one is not found
  Trucks.findOneAndUpdate({
    clickId: clickId
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
