// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('TodoCtrl', function($scope, $cordovaGeolocation, $ionicPlatform, $ionicLoading, $compile) { //, $cordovaGeolocation ) {
    
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var map;
    var mapOptions;
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    
    $scope.initialize = function() {
        
        var lat;
        var long;
        var end = new google.maps.LatLng(0, 0);
      
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            lat = position.coords.latitude
            long = position.coords.longitude
            //site = new google.maps.LatLng(0, 0);
            //$scope.routingError = "Set to " + lat + ", " + long;
            }, function(err) {
            $scope.routingError = "Unable to get current location";
            lat = 0;
            long = 0;
            //site = new google.maps.LatLng(0, 0);
        }); 
        var site = new google.maps.LatLng(lat, long);
        $scope.routeingError = site.lat() + ", " + site.lng();
        mapOptions = {
          streetViewControl:true,
          center: site,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        map = new google.maps.Map(document.getElementById("map"),
            mapOptions); 

        $scope.map = map; /*
         var marker = new google.maps.Marker({
                                                              position: site,
                                                              map: map
                                             }); */
        var request = $scope.setRequest(site, end); 
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        }); 

        directionsDisplay.setMap(map); 
        
       
      }; //initialize
  
      google.maps.event.addDomListener(window, 'load', $scope.initialize);

    
    $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
    
    $scope.calcRoute = function(start, end) {
        var request = $scope.setRequest(start, end);
        
        directionsService.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                console.log(status);
            } else {
                return false;
            }
        });
        return true;
    };
    
    $scope.setRequest = function(start, end) {
        var request = {
            origin: start,
            destination: end,
            travelMode : google.maps.TravelMode.DRIVING
        };
        return request;
    };
    
});