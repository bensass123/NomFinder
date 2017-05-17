var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');

module.exports = {

    addTruck: (email, firstName, lastName, truckName, status = false, lat = 1, long = 2) => {
        var obj = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                truckName: truckName,
                status: status,
                lat: lat,
                long: long
            };
        return Trucks.update({truckName: truckName}, obj, {upsert: true}, (err, doc) => {
            if (err) {console.log(err);}
            else {console.log(doc);}
        })
    },
  
    addUser: (user) => {
        
        if (!user.phone) {
            user.phone = 55555555555;
        }

        // need to update to account if favetrucks already exists

        var obj = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            username: user.username,
            group: user.group,
            favoriteTrucks: []
        }
        return Users.update({email: user.email}, obj, {upsert: true}, (err, doc) => {
            if (err) {console.log(err);}
            else {console.log(doc);}
        })
    }



}

// updateWith('123', 'my title').then(function(doc) {
//     // success
//     console.log('success', doc);
// }, function(err) {
//     // failure
//     console.log('failure', err);
// });



