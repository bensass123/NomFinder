

var Trucks = require('../models/Truck.js');
var Users = require('../models/User.js');

module.exports = {

    updateWith: (clickId, ownerName, truckName, status = false, lat = 1, long = 2) => {
        var obj = {
                clickId: clickId,
                ownerName: ownerName,
                truckName: truckName,
                status: status,
                lat: lat,
                long: long
            };
        return Trucks.update({truckName: truckName}, obj, {upsert: true}, (err, doc) => {
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



