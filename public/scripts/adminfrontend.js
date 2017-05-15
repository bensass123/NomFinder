
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
        console.log('truck added');
      });
    }

    addTruck();

    $(document).ready(() => {
        setLoc();
        alert('works');
    });
  