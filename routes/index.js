var express = require('express');
var router = express.Router();
var path = require('path');
var stormpath = require('express-stormpath');
var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');
var helpers = require('./helpers.js');

/* GET home page. */
// router.get('/',stormpath.loginRequired, function(req, res, next) {
//     req.user.getCustomData(function(err, data) { 
//         // get user group
//         var group = data.group;
    
//         switch (group) {
//             case 'user':
//                 res.sendFile(path.join(__dirname, '/../views/index3.html'));
//                 break;
//             case 'admin':
//                 res.sendFile(path.join(__dirname, '/../views/indexAdmin.html'));
//                 break;
//             case 'super':
//                 res.sendFile(path.join(__dirname, '/../views/indexSuper.html'));
//                 break;
//         }
//     });
// });

// View Page
router.get("/", stormpath.loginRequired, function (req, res){
  req.user.getCustomData(function(err, data) { 
        // get user group
        var group = data.group;
    
        switch (group) {
            case 'user':
              Users.findOne({username: req.user.username}, function(error, doc) {
                // Send any errors to the browser
                if (error) {
                  res.send(error);
                }
                // Or send the doc to the browser
                else {
                  console.log(doc);
                  res.render("home", {'user': doc});
                }
              });
                break;

            case 'admin':
              Trucks.findOne({email: req.user.email}).exec(function(err, doc){
                if (err){
                  console.log(err);
                } else {
                  res.render("admin", {'user': doc});
                }
              });
                break;
            // case 'super':
                // res.sendFile(path.join(__dirname, '/../views/indexSuper.html'));
                // break;
        }
    });
});


// User or Truck Profile
router.get("/profile", stormpath.loginRequired, function (req, res){
  req.user.getCustomData(function(err, data) { 
        // get user group
        var group = data.group;
    
        switch (group) {
            case 'user':
              Users.findOne({username: req.user.username}, function(error, doc) {
                // Send any errors to the browser
                if (error) {
                  res.send(error);
                }
                // Or send the doc to the browser
                else {
                  res.render("user", {'user': doc});
                }
              });
                break;
            case 'admin':
              Trucks.findOne({email: req.user.username}).exec(function(err, doc){
                if (err){
                  console.log(err);
                } else {
                  res.render("truck", {'user': doc});
                }
              });
                break;
        }
    });
});


router.get("/profile/:truckName", stormpath.loginRequired, function (req, res){
  var truck = req.params.truckName;
  truck = truck.replace(/%20/g, "")

  Trucks.findOne({truckName: truck}).exec(function(err, doc){
    if (err){
      console.log(err);
    } else {
      res.render("profile", {'user': doc});
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

// router.get('/adduser', stormpath.loginRequired, function (req,res){
//     req.user.getCustomData(function(err, data) { 
//         // get user group
//         var group = data.group;
//         req.user.group = group;
//         helpers.addUser(req.user);
//         res.end();
//     });
// });

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

  helpers.addUser(req.user);
  res.end();
});

router.post('/edituser', stormpath.loginRequired, function(req,res){

  var firstName = req.body.firstName;
  var lastName = req.body.lastName; 
  var phone = req.body.phone;
  var username = req.body.username;

  console.log("First name: " + firstName);
  console.log("Last name: " + lastName);
  console.log("Phone: " + phone);
  console.log("username: " + username);

  Users.findOneAndUpdate({email: req.user}, 
    {
      $set: {
      username: username,
      firstName: firstName,
      lastName: lastName,
      phone: phone
      
    }}, { upsert: true }).exec(function(err, doc) {

      if (err) {
      console.log(err);
      }
      else {
      res.render("user", {"user": doc});
      }
  });
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
    helpers.addTruck('email1', 'firstname1', 'lastname1', 'OooWee BBQ', true, 35.0535596, -80.82116959999999, "908-345-6883", "http://www.eatoooweebbq.com", "BBQ", "Here from 1-6pm", "https://img.clipartfest.com/2ea0638057ea2b18bf418bb336605f65_food-truck-court-is-cancelled-food-truck-clipart-transparent_488-349.png");
    helpers.addTruck('email2', 'firstname2', 'lastname2', 'Tin Kitchen', true, 35.1535596, -80.82116959999999, "", "http://www.tinkitchenfoodtruck.com", "Fusion", "Here from 4-8pm", "https://img.clipartfest.com/2ea0638057ea2b18bf418bb336605f65_food-truck-court-is-cancelled-food-truck-clipart-transparent_488-349.png");
    helpers.addTruck('email3', 'firstname3', 'lastname3', 'Papi Queso', true, 35.0535596, -80.92316959999999, "", "http://www.papiquesotruck.com", "Sandwiches", "Here from 3-7:30pm", "https://img.clipartfest.com/2ea0638057ea2b18bf418bb336605f65_food-truck-court-is-cancelled-food-truck-clipart-transparent_488-349.png");
    helpers.addTruck('email4', 'firstname4', 'lastname4', 'A Bao Time', true, 35.2535596, -80.8246959999999, "704-310-1262", "http://www.facebook.com/a-bao-time", "Asian", "Here from 2:30-6pm", "https://img.clipartfest.com/2ea0638057ea2b18bf418bb336605f65_food-truck-court-is-cancelled-food-truck-clipart-transparent_488-349.png");

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

router.get("/alltrucks",  function(req, res) {

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
    helpers.addTruck(user.email, user.firstName, user.lastName);
    // email, firstName, lastName, truckName
});

router.post("/editTruck", stormpath.loginRequired, function (req, res) {
  var user = req.user;
  var truckName = req.body.truckName;
  var website = req.body.website;
  var message = req.body.message;
  var foodType = req.body.foodType;

  Trucks.findOneAndUpdate({email: user}, 
  {
      $set: {
      truckName: truckName,
      website: website,
      message: message,
      foodType: foodType
      }

  }, { upsert: true }).exec(function(err, doc) {

      if (err) {
      console.log(err);
      }
      else {
      res.render("truck", {'user': doc});
      }
  });
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
    var message = req.body.message;

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
        }, { upsert: true }).exec(function(err, doc) {

            if (err) {
            console.log(err);
            }
            else {
            res.render("admin", {'user': doc});
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
            long: long,
            message: message
            }
        }, { upsert: true }).exec(function(err, doc) {

            if (err) {
            console.log(err);
            }
            else {
            res.render("admin", {'user': doc});
            }
        });
    }

});

// New seeing all favorited trucks from one given user
router.get("/favorites", stormpath.loginRequired, function(req, res) {

  Users.findOne({username:req.user.username}, 'favoriteTrucks', function (err, doc) {
    if (err) {
        return handleError(err)
    }
    else {
        var obj = {
            favoriteTrucks: doc.favoriteTrucks

        }
        res.send(obj);
    }
  });
});

// Add favorite truck via POST route

router.get("/addfavorites/:truckName",stormpath.loginRequired, function(req, res) {
    
  // Find our user and push the new truck name into the User's favorites array
  var truckName = req.params.truckName;
  
  // Find our user and push the new truck name into the User's favorites array
  Users.update({username: req.user.username}, { $addToSet: { favoriteTrucks: truckName } }, function(err, newdoc) {
    // Send any errors to the browser
    if (err) {
        console.log(err);
        res.send(err);
    }
    // Or send the newdoc to the browser
    else {
        res.send(newdoc);
    }
  });
});

// Remove favorite truck via POST route

router.get("/delfavorites/:truckName", stormpath.loginRequired, function(req, res) {

  // Find our user and push the new truck name into the User's favorites array
  var truckName = req.params.truckName;
  // Find our user and pull the a truck name out of the User's favorites array
  Users.update({username: req.user.username}, { $pull: { favoriteTrucks: truckName } }, function(err, newdoc) {
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
