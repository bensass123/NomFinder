// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
  	type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  username: {
    type: String
  },
  favoriteTrucks: [{
    // Store ObjectIds in the array
    type: Schema.Types.Mixed,
    // The ObjectIds will refer to the ids in the Truck model
    ref: "Trucks"
  }]
  
});

// Create the Model
var User = mongoose.model("User", UserSchema);

// Export it for use elsewhere
module.exports = User;
