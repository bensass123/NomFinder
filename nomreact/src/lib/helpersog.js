
//     // TESTING ONLY, POPULATES DB WITH TEST DATA
//     // var testPopulate = () => {
//     //   $.get('/init', (err) =>{
//     //     if(err) {console.log(err)}
//     //   });
//     // }

//    // testPopulate();

//     // add user to db if new

//     // var addUser = () => {
//     //   $.post('/adduser', (err) =>{
//     //     if(err) {console.log(err)}
//     //     console.log('user added');
//     //   });
//     // }

//     // addUser();

//     var map, activeTrucks;
//     var truckIcon = 'images/truck.gif';
//     var hungryIcon = 'images/hungryguy.gif';

//     var initMap = ()  => {
        
//         var startPos;
//         var geoSuccess = (position) => {
//             startPos = position;
//             var lat = startPos.coords.latitude;
//             var long = startPos.coords.longitude;
            
//             map = new google.maps.Map(document.getElementById('map'), {
//                 center: {lat: lat, lng: long},
//                 zoom: 10
//             });
//             placeUserMarker(lat, long);
//             setActiveTrucks();
//         }
//         navigator.geolocation.getCurrentPosition(geoSuccess);
//     }

//     var placeUserMarker = (lat, long) => {
//         let marker = new google.maps.Marker({
//             position: {lat: lat, lng: long},
//             title: 'USER LOCATION',
//             icon: hungryIcon,
//             animation: google.maps.Animation.DROP,
//             draggable: true,
//             map: map
//         });

//         // To add the marker to the map, call setMap();
//         marker.setMap(map);
//     }

//     var placeMarker = (lat, long, truckName, icon) => {
//       console.log('placemarker run');
//       console.log(lat, long, truckName, icon);
//       // no info window for user
//         let infowindow = new google.maps.InfoWindow({
//           content: truckName
//         });

//         let marker = new google.maps.Marker({
//             position: {lat: lat, lng: long},
//             title: truckName,
//             icon: icon,
//             animation: google.maps.Animation.BOUNCE,
//             map: map
//         });

//         marker.addListener('click', function() {
//           infowindow.open(map, marker);
//         });

//         // To add the marker to the map, call setMap();
//         marker.setMap(map);
//     }

//     // var setActiveTrucks = () => {
//     //   //ajax call to get active trucks, then send all data to placeMarker to create Markers
//     //   $.get("/api", function(data, status){
//     //     console.log("Data: " + JSON.stringify(data) + "\nStatus: " + JSON.stringify(status));
//     //     activeTrucks = data;
//     //   }).then(() => {
//     //     for (var i = 0; i <activeTrucks.length; i++) {
//     //       var t = activeTrucks[i];
//     //       placeMarker(parseFloat(t.lat), parseFloat(t.long), t.truckName, truckIcon);
//     //     }
//     //   });
//     // }