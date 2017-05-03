// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require Click schema
var User = require("./models/user");
var Truck = require("./models/trucks");

// Create a new express app
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// -------------------------------------------------

// MongoDB configuration (Change this URL to your own DB)
mongoose.connect("mongodb://admin:codingrocks@ds023674.mlab.com:23674/heroku_5ql1blnl");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// This is the route we will send GET requests to retrieve our most recent click data.
// We will call this route the moment our page gets rendered
app.get("/api", function(req, res) {

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
app.post("/api", function(req, res) {

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

// Route to see trucked that have been favorited
app.get("/recents", function(req, res) {
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
app.get("/favorites", function(req, res) {
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
app.get("/user", function(req, res) {
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
app.post("/submit", function(req, res) {
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

// -------------------------------------------------

// Starting our express server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});