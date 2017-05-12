var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');
var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');
var helpers = require('./helpers.js');

/* GET home page. */
router.get('/',stormpath.loginRequired, function(req, res, next) {
    req.user.getCustomData(function(err, data) { 
        // get user group
        var group = data.group
    
        switch (group) {
            case 'user':
                res.sendFile(path.join(__dirname, '/../views/index.html'));
                break;
            case 'admin':
                res.sendFile(path.join(__dirname, '/../views/indexAdmin.html'));
                break;
            case 'super':
                res.sendFile(path.join(__dirname, '/../views/indexSuper.html'));
                break;
        }
    });
});

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

router.get('/adduser', stormpath.loginRequired, function (req,res){
    req.user.getCustomData(function(err, data) { 
        // get user group
        var group = data.group;
        req.user.group = group;
        helpers.addUser(req.user);
        console.log('adduser hit');
        console.log(req.user);
    });
});

router.get("/allusers", stormpath.loginRequired, function(req, res) {

  // This GET request will search for all available trucks.
  Users.find({}).exec(function(err, doc) {

    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// TEST ROUTES TO SET ADMIN OR USER OR SUPER

router.get('/setsuper',stormpath.loginRequired, function(req, res, next) {
    req.user.getCustomData(function(err, data) { 
        if (err) {console.log(err);}
        data.group = 'super';
        data.save(() => {
            console.log('user group set to super');
            res.redirect('/');
        });
    });
});

router.get('/setadmin',stormpath.loginRequired, function(req, res, next) {
    req.user.getCustomData(function(err, data) { 
        if (err) {console.log(err);}
        data.group = 'admin';
        data.save(() => {
            console.log('user group set to admin');
            res.redirect('/');
        });
    });
});

router.get('/setuser',stormpath.loginRequired, function(req, res, next) {
    req.user.getCustomData(function(err, data) { 
        if (err) {console.log(err);}
        data.group = 'user';
        data.save(() => {
            console.log('user group set to User');
            res.redirect('/');
        });
    });
});

router.get('/adduser', stormpath.loginRequired, function(req,res){
  var username = req.user.username;
  var firstName = req.user.firstName;
  var lastName = req.user.lastName;
  var email = req.user.email;
  helpers.addUser(username, firstName, lastName, email);
  res.end();
});

// Route to see what user looks like without populating
router.get("/user", stormpath.loginRequired, function(req, res) {
  // Find all users in the user collection with our User model
  Users.find({username: req.user.username}, function(error, doc) {
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

// TESTING - TEMP ROUTE FOR USER FRONTEND

router.get('/userfrontend',stormpath.loginRequired, function(req, res, next) {
    res.sendFile(path.join(__dirname, '/../views/index.html'));
});

// testing - route to populate db w test data, use update instead, upsert

router.get('/init', stormpath.loginRequired, function (req, res) {
    helpers.addTruck('email1', 'firstname1', 'lastname1', 'Truck1', true, 35.0535596, -80.82116959999999);
    helpers.addTruck('email2', 'firstname2', 'lastname2', 'Truck2', true, 35.1535596, -80.82116959999999);
    helpers.addTruck('email3', 'firstname3', 'lastname3', 'Truck3', true, 35.0535596, -80.92316959999999);
    helpers.addTruck('email4', 'firstname4', 'lastname4', 'Truck4', true, 35.2535596, -80.8246959999999);

    //return all trucks
    Trucks.find({}).exec(function(err, doc) {
        if (err) {
        console.log(err);
        }
        else {
        res.end();
        }
    });
});


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

// TESTING - RETURN ALL TRUCKS IN DB REGARDLESS OF STATUS

router.get("/alltrucks",   function(req, res) {

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

router.get("/truckInfo/:truckName", function(req, res){
  Trucks.findOne({truckName: req.params.truckName}).exec(function(err, doc){
    if (err){
      console.log(err);
    } else {
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
    var user = req.user;
    helpers.addTruck(user.email, user.firstName, user.lastName, 'Truck1');
    // email, firstName, lastName, truckName
});

router.post('/postadmin', stormpath.loginRequired, function (req, res) {
    req.body.truckName;
    req.body.ownerName;
    req.body.clickId;
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

});

// New seeing all favorited trucks from one given user
router.get("/favorites", stormpath.loginRequired, function(req, res) {
  Users.findOne({username: req.user.username}).exec(function(error, doc){
    if (error){
      res.send(error);
    } else {
        res.send(doc.favoriteTrucks);
     
    }
  });  
});

// Add favorite truck via POST route
router.post("/addFavorites/:truckName", stormpath.loginRequired, function(req, res) {
  
  var truckName = req.params.truckName;

  // Find our user and push the new truck name into the User's favorites array
  Users.update({username: req.user.username}, { $push: { favoriteTrucks: truckName } }, function(err, newdoc) {
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

// Remove favorite truck via POST route
router.post("/removeFavorites/:truckName", stormpath.loginRequired, function(req, res) {
  // Find our user and push the new truck name into the User's favorites array
  var truckName = req.params.truckName;
  // Find our user and pull the a truck name out of the User's favorites array
  Users.update({username: req.user.username}, { $pull: { favoriteTrucks: {truckName: truckName } } }, function(err, newdoc) {
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

module.exports = router;
