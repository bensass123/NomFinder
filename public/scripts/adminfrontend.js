/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("sideNav").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
    document.getElementById("slider").style.visibility = "hidden";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("sideNav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("slider").style.visibility = "visible";
    document.body.style.backgroundColor = "white";
}

   // logout button
    $('#logout').click(()=>{
        $.post('/logout');
        setTimeout(()=>{
            location.reload();
        }, 400);
    });


   // TESTING ONLY, POPULATES DB WITH TEST DATA
    var testPopulate = () => {
      $.get('/init', (err) =>{
        if(err) {console.log(err)}
      });
    }

    testPopulate();

    // add user to db if new

    var addUser = () => {
      $.get('/adduser', (err) =>{
        if(err) {console.log(err)}
        console.log('user added');
      });
    }

    addUser();

    var map, activeTrucks;
    var truckIcon = 'images/truck.gif';
    var hungryIcon = 'images/hungryguy.gif';

    var initMap = ()  => {
        
        var startPos;
        var geoSuccess = (position) => {
            startPos = position;
            var lat = startPos.coords.latitude;
            var long = startPos.coords.longitude;
            
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: lat, lng: long},
                zoom: 10
            });
            placeUserMarker(lat, long);
            setActiveTrucks();
        }
        navigator.geolocation.getCurrentPosition(geoSuccess);
    }

    var placeUserMarker = (lat, long) => {
        let marker = new google.maps.Marker({
            position: {lat: lat, lng: long},
            title: 'USER LOCATION',
            icon: hungryIcon,
            animation: google.maps.Animation.DROP,
            draggable: true,
            map: map
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    }

    var placeMarker = (lat, long, truckName, website, message, icon) => {
      // console.log('placemarker run');
      // console.log(lat, long, truckName, icon);

      var truckInfo = "<div class='truckInfo'><h3>" + truckName + "</h3><br><p>" + message + "</p><br><a href='"+ website + "''target='_blank'><p>" + website + "</p></a></div>" 

      // no info window for user
        let infowindow = new google.maps.InfoWindow({
          content: truckInfo

        });

        let marker = new google.maps.Marker({
            position: {lat: lat, lng: long},
            title: truckName,
            icon: icon,
            // no bouncing for now
            // animation: google.maps.Animation.BOUNCE,
            map: map
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    }



    var setActiveTrucks = () => {
      //ajax call to get active trucks, then send all data to placeMarker to create Markers
      $.get("/api", function(data, status){
        // console.log("Data: " + JSON.stringify(data) + "\nStatus: " + JSON.stringify(status));
        activeTrucks = data;
      }).then(() => {
        for (var i = 0; i <activeTrucks.length; i++) {
          var t = activeTrucks[i];
          placeMarker(parseFloat(t.lat), parseFloat(t.long), t.truckName, t.website, t.message, truckIcon);

        }
      });
    }

    var setLoc = () => {
        var startPos;
        var geoSuccess = function(position) {
            startPos = position;
            $('#latPost').val(startPos.coords.latitude);
            $('#longPost').val(startPos.coords.longitude);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
    }

    var addTruck = () => {
      $.post('/addtruck', (err) =>{
        if(err) {console.log(err)}

      });
    }

    addTruck();

    $(document).ready(() => {
        setLoc();

       

        var on = false;
        $('#slider').click(()=>{
            if(!on) {
                $('#slider').removeClass('sliderDivOff');
                $('#slider').addClass('sliderDivOn');
                $('.sliderHeart').removeClass('off');
                $('.sliderHeart').addClass('on');
                $('.sliderHeart').addClass('flip');
                $(".sliderHeart").animate({left: '140px'});
                setTimeout(()=>{
                    $('.sliderHeart').removeClass('flip');
                }, 400);
                // $(".sliderHeart").animate({fontSize: '8vh'}, "slow");
                // $(".sliderHeart").animate({fontSize: '5vh'}, "slow");
                on = true;
            } else{
                $('#slider').removeClass('sliderDivOn');
                $('#slider').addClass('sliderDivOff');
                $('.sliderHeart').addClass('off');
                $('.sliderHeart').removeClass('on');
                $('.sliderHeart').addClass('flip');
                $(".sliderHeart").animate({left: '9px'});
                setTimeout(()=>{
                    $('.sliderHeart').removeClass('flip');
                }, 400);
                // $(".sliderHeart").animate({fontSize: '8vh'}, "slow");
                // $(".sliderHeart").animate({fontSize: '5vh'}, "slow");
                on = false;
            }
        })

    });
  