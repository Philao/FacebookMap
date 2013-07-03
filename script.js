function initialize() {
    
    // create link to icons
    var iconBase = 'http://google.com/mapfiles/ms/micons/';
    
    
    //create map properties
    var mapOptions = {
        center: new google.maps.LatLng(51.5, 0),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
    //create map
    var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    
    
    // Sets user's name
    var usersname = facobj.data[1].fql_result_set[0].first_name + ' ' + facobj.data[1].fql_result_set[0].last_name;
    
    
    // Gets users picture
    if (facobj.data[1].fql_result_set[0].pic_square != null) {
        
        var userspic = facobj.data[1].fql_result_set[0].pic_square;
        
    }
    
    //Checks if user has set either current or hometown location and then warns user if not.
    
    if (facobj.data[1].fql_result_set[0].current_location != null) {
        
        var userslat = facobj.data[1].fql_result_set[0].current_location.latitude;
        var userslon = facobj.data[1].fql_result_set[0].current_location.longitude;
        
    } else {
        
        if (facobj.data[1].fql_result_set[0].hometown_location != null) {
            
            var userslat = facobj.data[1].fql_result_set[0].hometown_location.latitude;
            var userslon = facobj.data[1].fql_result_set[0].hometown_location.longitude;
            
        } else {
            
            var userslat = 0;
            var userslon = 0;
            usersname = "User's location not set on facebook";
            
        } 
    }
    
    map.setCenter(new google.maps.LatLng(userslat, userslon));
    
    // Sets properties for the user's marker
    var userOps = {
        map: map,
        position: new google.maps.LatLng(userslat, userslon),
        title: usersname,
        icon: iconBase + 'yellow-dot.png',
        shadow: iconBase + 'msmarker.shadow.png'
        };
    
    // Creates user's marker
    var user = new google.maps.Marker(userOps);
    
    
    // Creates arrays and variables for friends markers.
    var obLength = facobj.data[0].fql_result_set.length;
    var friendOps = Array();
    var friends = Array();
    var counter = 0;
    var friendWindow = Array();
    var friendWinOps = Array();
    
    // Array so that when gnerating the position of each marker we can check for markers in the same position.
    
    var jLat = Array();
    var jLon = Array();
    
    // Loop for creating marker objects.
    for (i = 0; i < obLength; i++) {
        
        // Creating the object for each marker
        friendOps[i] = {
                map: map,
                
                shadow: iconBase + 'msmarker.shadow.png',
                firstname: facobj.data[0].fql_result_set[i].first_name,
                lastname: facobj.data[0].fql_result_set[i].last_name,
                pic: facobj.data[0].fql_result_set[i].pic_square,
                no: i,
                title: facobj.data[0].fql_result_set[i].first_name + ' ' + facobj.data[0].fql_result_set[i].last_name,
                winText: '<div class="pic"><img src="' + facobj.data[0].fql_result_set[i].pic_square + '"></img></div><div class="name">' + facobj.data[0].fql_result_set[i].first_name + ' ' + facobj.data[0].fql_result_set[i].last_name +'</div></br><div class="loc"></div>',
                friendWindow:  new google.maps.InfoWindow(),
                displayed: false,
                openWindow: function () {
                        if (this.displayed === false) {
                            this.friendWindow.setContent(this.winText);
                            this.friendWindow.open(map, this);
                            this.displayed = true;
                        } else {
                            this.friendWindow.close();
                            this.displayed = false;
                        }
                       
                    }
                
            };
       
        
        // Checks if each friend has the current location set, if not does it have the hometown location set.(Need more DRY)
        if (facobj.data[0].fql_result_set[i].current_location != null) {
                // Sets many properties of friendsOps[i]  
                friendOps[i].icurrLat = facobj.data[0].fql_result_set[i].current_location.latitude;
                friendOps[i].icurrLon = facobj.data[0].fql_result_set[i].current_location.longitude;
                
                friendOps[i].city = facobj.data[0].fql_result_set[i].current_location.city;
                friendOps[i].state = facobj.data[0].fql_result_set[i].current_location.state;
                friendOps[i].country = facobj.data[0].fql_result_set[i].current_location.country;
                friendOps[i].loc = facobj.data[0].fql_result_set[i].current_location.name;
                friendOps[i].icon = iconBase + 'red-dot.png';
                
                // checks for marker in the same position.
                for (j = 0; j < i; j++) {
            
                    if (((friendOps[i].icurrLat === jLat[j]) & (friendOps[i].icurrLon === jLon[j])) || ((friendOps[i].icurrLat === userslat) & (friendOps[i].icurrLon === userslon))) {
                        
                        friendOps[i].icurrLat += 0.001;
                        friendOps[i].icurrLon += 0.001;
                        
                    }
                }
                
                
                friendOps[i].position =   new google.maps.LatLng(friendOps[i].icurrLat, friendOps[i].icurrLon);
               
                friends[i] = new google.maps.Marker(friendOps[i]);
                
                jLat[i] = friendOps[i].icurrLat;
                jLon[i] = friendOps[i].icurrLon;
                
                //Does same as above but checks for hometown. Too much Dry.
        } else {
            
                if (facobj.data[0].fql_result_set[i].hometown_location != null) {
            
                    friendOps[i].ihomeLat = facobj.data[0].fql_result_set[i].hometown_location.latitude;
                    friendOps[i].ihomeLon = facobj.data[0].fql_result_set[i].hometown_location.longitude;
                    
                    friendOps[i].city = facobj.data[0].fql_result_set[i].hometown_location.city;
                    friendOps[i].state = facobj.data[0].fql_result_set[i].hometown_location.state;
                    friendOps[i].country = facobj.data[0].fql_result_set[i].hometown_location.country;
                    friendOps[i].loc = facobj.data[0].fql_result_set[i].hometown_location.name;
                    friendOps[i].icon = iconBase + 'blue-dot.png';
                    for (j = 0; j < i; j++) {
            
                        if (((friendOps[i].ihomeLat === jLat[j]) & (friendOps[i].ihomeLon === jLon[j])) || ((friendOps[i].ihomeLat === userslat) & (friendOps[i].ihomeLon === userslon))) {
                            friendOps[i].ihomeLat += 0.001;
                            friendOps[i].ihomeLon += 0.001;
                        }
                    }
                    
                     friendOps[i].position =   new google.maps.LatLng(friendOps[i].ihomeLat, friendOps[i].ihomeLon);
                
                    friends[i] = new google.maps.Marker(friendOps[i]);
                    
                    jLat[i] = friendOps[i].ihomeLat;
                    jLon[i] = friendOps[i].ihomeLon;
                    
                    
                    
                
                }
            
        }
        
           
           // Sets listener for each marker
           if (friendOps[i].position) {
                
                friends[i].winText += '<div class="name">' + friends[i].city + ', ' + friends[i].country + '</div>';
                google.maps.event.addListener(friends[i], 'click', function() {
                    this.openWindow();
                 });
                
            }
           
            
        
        
    }
    
    
   
    

    
        
}   






