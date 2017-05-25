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
        return Trucks.update({email: email}, obj, {upsert: true}, (err, doc) => {
            if (err) {console.log(err);}
            else {console.log(doc);}
        })
    },
  
    addUser: (user) => {
        // console.log('initial user');
        console.log(user);
        // console.log('---------------adduser-user-object------------');
        // console.log(user.customData);

        user.getCustomData(function(err, data) { 
            var group;
            if (data.group != null) {
                group = data.group;
            } 
            else{
                group = 'user';
            }
            
            console.log('group is (helpers): ', group)

            console.log('---------------adduser-CUSTOMDATA-object------------');
            console.log('data is (helpers): ', data);
            console.log('---------------adduser-CUSTOMDATA-object------------');

            // create user entry if it doesnt exist
            if (group.toLowerCase() === 'user') {
                console.log('users hit')
                var obj = {
                    firstName: user.givenName,
                    lastName: user.surname,
                    email: user.email,
                    phone: user.phone,
                    username: user.username,
                    group: group
                }
                return Users.update({email: user.email}, obj, {upsert: true}, (err, doc) => {
                    if (err) {console.log(err);}
                    else {console.log('------------USERS-------------------DOC---',doc);}
                })
            } 

            else if (group.toLowerCase() === 'admin') {
                console.log('admin hit')
                var website = data.website;
                var foodType = data.foodType;
                var truckName = data.truckName;

                var obj = {
                    firstName: user.givenName,
                    lastName: user.surname,
                    email: user.email,
                    phone: data.phone,
                    website: data.website,
                    foodType: data.foodType,
                    truckName: data.truckName
                }

                return Trucks.update({email: user.email}, obj, {upsert: true}, (err, doc) => {
                    if (err) {console.log('ERROR',err);}
                    else {console.log('------------TRUCKS-------------------DOC---',doc);}
                })
            } 
        })
        
    }

}