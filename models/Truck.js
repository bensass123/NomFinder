// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TruckSchema = new Schema({
  favorites: {
    type: Number
  },
  email: {
    type: String
  },
  firstName: {
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