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
  favoriteTrucks: {
    type: Array
  }
  
});

// Create the Model
var User = mongoose.model("User", UserSchema);

// Export it for use elsewhere
module.exports = User;