/**
 * Displays the map with all the loccations for events running on it
 */
angular.module('starter.controllers')
.controller('EventMapCtrl', function($stateParams, ScheduledEvents, $ionicModal, $ionicLoading, $scope, $firebaseObject, $firebaseArray, AppConstants, $cordovaGeolocation, ngGPlacesAPI, $ionicPopover, LocationCategories, DZHelpers, $localstorage, $shareOptions, $rootScope, $log) {
  var TAG = 'EventMapCtrl';

  $log.debug(TAG);

  // init vars
  var map;
  var numMarkersToAdd = 0;
  var locationsSnapshot;

  var firebaseUrl = AppConstants.getEnvVars().firebase;
  var ref = new Firebase(firebaseUrl);
  var eventId = $stateParams.eventId;
  var eventsRef = ref.child('events').child(eventId);
  var locationsRef = ref.child('locations').orderByChild('eventId').equalTo(eventId);

  // get the event details
  $scope.eventDetails = $firebaseObject(eventsRef);
  $scope.locations = $firebaseArray(locationsRef);

  var displayMapPoints = function(dataSnapshot) {
    $log.debug(TAG+': displayMapPoints');
    // set the locations snapshot that will be used to plot the markers
    locationsSnapshot = dataSnapshot;
    //MAP NOT SETUP
    if(typeof(map) === "undefined"){

      // Set the options for the map
      var mapParams = {
        'controls': {
          'myLocationButton': true
        }
      };
      
      $scope.curLocation={};

      // Initialize the map plugin
      var mapDiv = document.getElementById("map_canvas"); //map reference
      map = plugin.google.maps.Map.getMap(mapDiv, mapParams);
      map.setVisible(false);
      map.setBackgroundColor('#ffffff');

      // You have to wait the MAP_READY event
      map.on(plugin.google.maps.event.MAP_READY, plotEventLocations);
      // get current location.
      map.getMyLocation(function(location){
        $scope.curLocation.latitude = location.latLng.lat;
        $scope.curLocation.longitude = location.latLng.lng;
      }, function(err){
        $scope.curLocation = false;
      });
    }
    //MAP ARLEADY SETUP
    else{

      //Have we added all the points yet
      if(numMarkersToAdd === 0)
        plotEventLocations();
    }
  };

  /**
   * Plot the locations on the map
   */
  var plotEventLocations = function(){
    $log.debug(TAG+': plotEventLocations');

    numMarkersToAdd = locationsSnapshot.numChildren();

    map.off(); //diable event listeners on map

    /**
     * Clear the markers
     */
    if (typeof $rootScope.mapMarkers !== "undefined") {
      for (var i = 0; i < $rootScope.mapMarkers.length; i++) {
        $rootScope.mapMarkers[i].remove();
      }
    }

    $rootScope.mapMarkers = []

    /**
     * Clear the google place markers
     */
    if (typeof $rootScope.googlePlacesMarkers !== "undefined") {
      for (var i = 0; i < $rootScope.googlePlacesMarkers.length; i++) {
        $rootScope.googlePlacesMarkers[i].remove();
      }
    }

    $rootScope.googlePlacesMarkers = [];

    // array of points to bound the camera
    var points = [];

    // get the Firebase hosting URL
    var firebaseHostingUrl = AppConstants.getEnvVars().firebaseHostingUrl;
    // define arcodeData
    var i=0, arcodeData = [];
    // loop through the event locations
    var eventMarkerCount = 0;
    var favouritedEventsStore = getArrayFromLocalStorage($localstorage, FAVOURITED_EVENTS_KEY);
    // loop through the locations and add the markers
    locationsSnapshot.forEach(function(childSnapshot) {
      var location = childSnapshot.val();
      var locationId = childSnapshot.key();

      var locationHasFavEvent = false;

      // single point
      var point = new plugin.google.maps.LatLng(location.latitude, location.longitude);

      // add to the points array
      points.push(point);

      // loop through the favourited events
      for (var j=0; j<favouritedEventsStore.length;j++) {

        // an event at this location has been favourited
        if (locationId === favouritedEventsStore[j].location) locationHasFavEvent = true;
      }

      //var iconUrl = locationHasFavEvent ? firebaseHostingUrl+"/images/category_icons/my_schedule.png" : firebaseHostingUrl+"/images/category_icons/"+locations[i].category+".png";
      var iconUrl = locationHasFavEvent ? firebaseHostingUrl+"/images/category_icons/my_schedule.png" : location.icon;

      // added this so we could filter by my_schedule
      var locationCategory = locationHasFavEvent ? 'my_schedule' : location.category;
      // added location to ardata
      arcodeData[i] = location;
      // added this so we could filter by my_schedule(if true, my schedule)
      arcodeData[i].category = locationHasFavEvent;
      i++;

      // add the event location markers
      map.addMarker({
        'position': point,
        'locationId': locationId,
        'locationName': location.name,
        'locationCategory': locationCategory,
        'locationEventsCount': location.number_of_events,
        'icon': {'url': iconUrl, 'size': {width: 46, height: 54}}
      }, function(marker) {
        // set the marker visibilty based on a possible filter
        var markerVisibility = marker.get('locationCategory') === $scope.data.locationFilter || !$scope.data.locationFilter ? true : false;
        marker.setVisible(markerVisibility);

        // add the marker to an array so we can remove on leave
        $rootScope.mapMarkers.push(marker);

        // add the click event listener
        marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, markerClick);

        numMarkersToAdd--;
      });
    });
    
    ARcode.arcodeview(arcodeData, function(data){
        console.log(data);
    });
    
    $log.debug('points',points);
    // bound the camera to the points
    var latLngBounds = new plugin.google.maps.LatLngBounds(points);

    map.moveCamera({
      'target' : latLngBounds
    }, function() {
      map.setVisible(true);
      map.getCameraPosition(function(camera)
      {
        var zoom = camera.zoom;
        var zoomModifier = 1;

        //if only one point increase zoom modifier so it isn't at zoom 1
        if(points.length == 1)
        {
          zoomModifier = 4;
        }

        map.animateCamera({
          'zoom' : zoom - zoomModifier,
          'duration': 500
        });
      });
    });

    var centrePoint = latLngBounds.getCenter();
    var southWestPoint = latLngBounds.southwest;
    var northEastPoint = latLngBounds.northeast;

    //calculate the distance of the boundaries in km
    var boundarySize = boundaryDistance(southWestPoint.lat,southWestPoint.lng,northEastPoint.lat,northEastPoint.lng,'k');

    //multiply by 1000 to make meters
    boundarySize = (boundarySize+1)*1000;

    // get the google places
    ngGPlacesAPI.nearbySearch({latitude: centrePoint.lat, longitude: centrePoint.lng, radius: boundarySize}).then(function(data){

      for (var i = 0; i < data.length; i++) {

        // set the places point
        var point = new plugin.google.maps.LatLng(data[i].geometry.location.H, data[i].geometry.location.L);
        var iconUrl = data[i].icon;

        // add the event location markers
        map.addMarker({
          'position': point,
          'icon': {'url': iconUrl, 'size': {width: 15, height: 15}},
          'vicinity': data[i].vicinity,
          'locationName': data[i].name
        }, function(marker) {

          // add the marker to an array so we can remove on leave
          $rootScope.googlePlacesMarkers.push(marker);

          // add the click event listener
          marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, markerClick);
        });
      }
    });
  };

  var boundaryDistance = function(lat1, lon1, lat2, lon2, unit){
    $log.debug(TAG+": boundaryDistance");

    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344; }
    if (unit=="N") { dist = dist * 0.8684; }
    return dist;
  }

 /**
  * This is called when a map marker is clicked
  * We will bring up the pop with the location
  * details.
  *
  * We will need to handle both scheduled items and also
  * google places
  */
  var markerClick = function(marker){
    $log.debug(TAG+": markerClick");   
    console.log('Marker', marker);

    //disable any further touches
    map.setClickable(false);

    var showModal = function(data){
      $log.debug(TAG+": showModal");

      // show the modal
      $scope.modal.show();

      $scope.locationName = data.locationName;
      $scope.position = marker.get('position');
      $scope.vicinity = data.vicinity;
      $scope.locationEventsCount = data.locationEventsCount;
      $scope.isEventLocation = data.isEventLocation;
      $scope.locationId = data.locationId;

      // look after the icon image - TODO fix the icon url
      var firebaseHostingUrl = AppConstants.getEnvVars().firebaseHostingUrl;

      // hack here of replace was added because we only store the icon for the map marker and not the icon that is used in the modal
      if (data.isEventLocation) {
        var correctIconPath;
        correctIconPath = data.icon.url.replace('/category_icons_cms/', '/category_icons_small/').replace('/category_icons/', '/category_icons_small/');
      }

      $scope.icon = data.isEventLocation ? correctIconPath : data.googleIcon.url;

      // another hack to look after the my schedule icons
      if (data.isEventLocation) {
        $scope.icon = $scope.icon.replace('/category_icons/', '/category_icons_cms/');
      }

      // look after the subtitle
      var getSubtitle = function(){
        var subtitle = 'this is the subtitle';
        // this is a location
        if (data.isEventLocation) {
          subtitle = data.locationEventsCount ? data.locationEventsCount+" Scheduled Events" : 'No Scheduled Events';
        }
        // not a location
        else {
          subtitle = data.vicinity ? data.vicinity : '--';
        }

        return subtitle;
      };

      $scope.subtitle = getSubtitle();

      // close the modal
      $scope.closeModal = function() {
        $scope.modal.hide().then(function(){
          map.setClickable(true);
        });
      };

      // get directions to the location
      $scope.getDirections = function(lat, lng){
        $log.debug(TAG+': getDirections');

        navigator.notification.confirm("Do you want to leave the app to get directions on your map application?", function(buttonIndex) {
          
          switch(buttonIndex) {
            case 1:

                break;
            case 2:
              var isIOS = ionic.Platform.isIOS();
              if(isIOS) {
                  launchnavigator.isGoogleMapsAvailable(function(available){
                  if(available){
                    DZHelpers.getNativeGeoLink(lat, lng, true).then(function(url){
                      window.open(url, "_system");
                    });                  
                  }else{
                    DZHelpers.getNativeGeoLink(lat, lng, false).then(function(url){
                      window.open(url, "_system");
                    });
                  }                
                });
              } else {
                DZHelpers.getNativeGeoLink(lat, lng, false).then(function(url){
                  window.open(url, "_system");
                }, function(url){
                  window.open(url, "_system");
                });
              }              
              break;
          }
        }, "Leaving Eventro", ["Cancel", "Ok"]);
      };

      // go to the location detail
      $scope.gotoLocationDetail = function(lat, lng){
        $log.debug(TAG+': gotoLocationDetail');
        $scope.modal.remove().then(function(){
          map.setClickable(true);
        });
      };

      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove().then(function(){
          map.setClickable(true);
        });
      });
    };

    // init our modal
    $ionicModal.fromTemplateUrl('templates/modals/map-location.html', {
      scope: $scope,
      animation: 'none'
    }).then(function(modal) {
      $scope.modal = modal;
      // get the locationId - if there is one
      var locationId = marker.get('locationId');

      var dataForModal = {};

      // this is an event location
      if (locationId !== null) {

        // set up the data for the modal
        dataForModal.locationName = marker.get('locationName');
        dataForModal.locationCategory = marker.get('locationCategory');
        dataForModal.icon = marker.get('icon');
        dataForModal.locationEventsCount = marker.get('locationEventsCount');
        dataForModal.isEventLocation = true;
        dataForModal.locationId = locationId;

        // show the modal
        showModal(dataForModal);
      }
      // this is a google places marker
      else {

        // set up the data for the modal
        dataForModal.locationName = marker.get('locationName');
        dataForModal.googleIcon = marker.get('icon');
        dataForModal.vicinity = marker.get('vicinity');
        dataForModal.isEventLocation = false;

        // show the modal
        showModal(dataForModal);
      }      
    });
  };

  // setup the data for the locations filter
  $scope.locationCategories = LocationCategories.get();
  $scope.data = {locationFilter: ''};

  /**
   * Filter the event markers on the map by
   * location category
   */
  $scope.filterLocations = function(){
    $log.debug(TAG+": filterLocations");

    /**
     * loop through the markers and set visabilty based on the
     * filter set
     */
    for (var i=0;i<$rootScope.mapMarkers.length;i++) {

      // this is an event location marker
      if ($rootScope.mapMarkers[i].get('locationCategory') !== null) {

        var visBool;

        // we have a filter selected
        if ($scope.data.locationFilter.length > 0) {

          visBool = $rootScope.mapMarkers[i].get('locationCategory') === $scope.data.locationFilter ? true : false;
        }
        // we have no filter selected
        else {

          visBool = true;
        }
        $rootScope.mapMarkers[i].setVisible(visBool);
      }
    }
  };

  $scope.$on('$ionicView.loaded', function(e) {
    $log.debug(TAG+": loaded");

    // flag to determine whether our view should display only favourited events
    if (typeof $rootScope.showFavOnly === "undefined") $rootScope.showFavOnly = false;
    $scope.data.locationFilter = $rootScope.showFavOnly ? "my_schedule" : "";

    // toggles between showing only the favourited events or not
    $scope.toggleShowFavOnly = function() {
      $log.debug(TAG+": toggleShowFavOnly");

      $rootScope.showFavOnly = !$rootScope.showFavOnly;

      // set the filter value to my_schedule
      if ($rootScope.showFavOnly) {
        $scope.data.locationFilter = "my_schedule";
      }
      else {
        $scope.data.locationFilter = "";
      }

      // call the filter function
      $scope.filterLocations();
    }

    $scope.showShareOptions = function (event)
    {
      $log.debug(TAG+": showShareOptions");
      $shareOptions.show(elocationsvent);
    }

    /**
     * Look after the on value event
     */
    locationsRef.on('value', displayMapPoints);
  });

  $scope.$on('$ionicView.beforeEnter', function(e) {
    $log.debug(TAG+": beforeEnter");
  });

  // view event listeners
  $scope.$on('$ionicView.leave', function(e) {
    $log.debug(TAG+": leave");
    // remove the fb listener
    locationsRef.off('value', displayMapPoints);

    // remove the modal
    //$scope.modal.remove();
  });

  //check internet status
  $scope.$watch('isOnline', function()
  {
    if(!$scope.isOnline)
    {
      //notify user we are offline
      var message = "Cannot detect your internet connection. Your map usage may be limited.";
      var title = "No Internet Connection";
      var buttonName = "OK";

      //create native popup
      navigator.notification.alert(message, null, title, buttonName);
    }
  });
})