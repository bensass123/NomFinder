// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TruckSchema = new Schema({
  favorites: {
    type: Array
  },
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  truckName: {
  	type: String
  },
  phone: {
  	type: String
  },
  website: {
  	type: String
  },
  foodType: {
  	type: String
  },
  status: {
  	type: Boolean
  }, 
  lat: {
  	type: String
  },
  long: {
  	type: String
  }

});

// Create the Model
var Truck = mongoose.model("Truck", TruckSchema);

// Export it for use elsewhere
module.exports = Truck;
