var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');

module.exports = {


    addTruck: (email, firstName, lastName, truckName, status = false, lat = 1, long = 2, phone, website, foodType, message, pic) => {
        var obj = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                truckName: truckName,
                status: status,
                lat: lat,
                long: long,
                phone: phone,
                website: website,
                foodType: foodType,
                message: message,
                pic: pic
            };
        return Trucks.update({truckName: truckName}, obj, {upsert: true}, (err, doc) => {
            if (err) {console.log(err);}
            else {console.log(doc);}
        })
    },
  
    addUser: (user) => {
        console.log('initial user');
        console.log(user);
        var faves = [];
        if(!user.favoriteTrucks) {
            faves = [];
        }
        else{
            faves = user.favoriteTrucks;
        }

        console.log('favorite trucks');
        console.log(faves);
        if (!user.phone) {
            user.phone = 55555555555;
        }
        var obj = {
            firstName: user.givenName,
            lastName: user.surname,
            email: user.email,
            phone: user.phone,
            username: user.username,
            group: user.group
        }

        
        return Users.update({email: user.email}, obj, {upsert: true}, (err, doc) => {
            if (err) {console.log(err);}
            else {console.log(doc);}
        })
    }



}