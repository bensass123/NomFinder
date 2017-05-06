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
        var obj = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            username: user.username
        }
        return Users.update({email: user.email}, obj, {upsert: true}, (err, doc) => {
            if (err) {console.log(err);}
            else {console.log(doc);}
        })
    },

    // Add / remove favorites
    updateFavorites: (clickId, truckName, username) => {
        if($(this).hasClass("favorited")) {
            var returnVal = console.log("Truck removed");
            $(this).removeClass("favorited", returnVal);

            var obj = {
                clickId: clickId,
                username: username,
                truckName: truckName
            };
            // Find our user and pull the a truck name out of the User's favorites array
            User.update({username: username}, { $pull: { favorites: {truckName: truckName } } }, function(err, newdoc) {
                // Send any errors to the browser
                if (err) {
                  res.send(err);
                }
                // Or send the newdoc to the browser
                else {
                  res.send(newdoc);
                }
            });
            
        } else {
                var returnVal = console.log("Truck added");
                $(this).addClass("favorited", returnVal);
                
                var obj = {
                clickId: clickId,
                username: username,
                truckName: truckName
            };

            // Find our user and push the new truck name into the User's favorites array
            User.update({username: username}, { $push: { favorites: truckName } }, function(err, newdoc) {
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
    }

}

// updateWith('123', 'my title').then(function(doc) {
//     // success
//     console.log('success', doc);
// }, function(err) {
//     // failure
//     console.log('failure', err);
// });



