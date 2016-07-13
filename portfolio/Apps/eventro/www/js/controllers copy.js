//key to the local storage that will get a user's favourited events
var FAVOURITED_EVENTS_KEY = "favouritedSchEvents";

//gets the stored data for a given key in local storage, and inteprets it as an array
function getArrayFromLocalStorage(storageFactory, key) {

  var lookupResult = storageFactory.getObject(key);

  //if the user hasn't saved anything in this object, javascript won't know it's an object
  if (Object.keys(lookupResult).length === 0) {

    lookupResult = [];
  }

  return lookupResult;
}

//Will go through an array and will find the first object that's property matches a parameter value
function getIndexOfObjInArrayMatchingProperty(store, keyToCheck, value) {

  var index = -1;

  for (var i = 0; i < store.length; i++) {

    if (store[i][keyToCheck] === value) {

      index = i;
      break;
    }
  }
  return index;
}

angular.module('starter.controllers', [])

/**
 * EventsCtrl
 */
.controller('EventsCtrl', function($log, $scope, Events, $ionicScrollDelegate, $location, $state, AppConstants, $rootScope) {
  var TAG = 'EventsCtrl';

  $log.log(TAG);

  /**
   * Parse - Initialize and store the subscriptions to rootScope
   */
  document.addEventListener("deviceready", function (){
    parsePlugin.initialize(AppConstants.parseKeys.applicationId, AppConstants.parseKeys.clientKey, function() {
      // get the installationId
      parsePlugin.getInstallationId(function(id) {
        $log.debug('Parse installationId: ', id);

        // get the current subscriptions
        parsePlugin.getSubscriptions(function(subscriptions) {
          // save the subscriptions to root scope (the subscription will be the event ids)
          $rootScope.parseSubscriptions = subscriptions;
        }, function(err) {
          $log.error(err);
        });        
      }, function(err) {
          $log.error(err);
      });
    }, function(err) {
        $log.error(err);
    });
  });

  //default to false. We don't want to show the 'no events' until we get that confirmation from the server
  var hasDatabaseValues = false;

  $scope.hasDatabaseValues = function() {

    return hasDatabaseValues;
  };

  var firebaseUrl = AppConstants.getEnvVars().firebase;
  var ref = new Firebase(firebaseUrl);
  $scope.eventsRef = ref.child('events');

  var anchorScroll = function(){
    //$ionicScrollDelegate.anchorScroll(true);
  };

  // search input
  $scope.input = {};

  // order by
  $scope.predicate = 'start';

  $scope.events = Events.getAll();

  $scope.$on('$ionicView.beforeEnter', function(e) {

    $scope.showContent = false;
  });

  $scope.$on('$ionicView.afterEnter', function(e) {

    // used to add the highlight class to an event
    $scope.isHighlighted = function(eventId){

      return (eventId === $location.hash());
    };

    $scope.eventsRef.on('value', function(snapshot) {

      hasDatabaseValues = (snapshot.numChildren() > 0);
      //anchorScroll();
    });
  });
})

/**
 * Tis is the screen where you can see all the things happening at an event and favourite them
 */
.controller('EventScheduleCtrl', function($stateParams, $firebaseObject, $firebaseArray, $scope, Events, $ionicScrollDelegate, $location, $state, AppConstants, $localstorage, ScheduledEvents, $activityIndicator,$cordovaToast,$shareOptions) {

  //var scheduledEventCategoriesRef = new Firebase(firebaseUrl+"/scheduled_event_categories/");

  //get the object that will store all our favourited scheduled events
  var favouritedEventsStore;

  $scope.$on('$ionicView.beforeEnter', function(e) {

    //flag to determine whether our view should display only favourited events
    $scope.showFavOnly = false;

    favouritedEventsStore = getArrayFromLocalStorage($localstorage, FAVOURITED_EVENTS_KEY);
  });

  // view event listeners
  $scope.$on('$ionicView.leave', function(e) {

    //turn on the accessory bar because we're not actually a native app and need the done button
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }); 

//here1 
  /**
   * Category filter
   */
   $scope.categories = $firebaseArray(scheduledEventCategoriesRef.orderByChild('eventId').equalTo(eventId));

  /**
   * Loaded
   */
  $scope.$on('$ionicView.loaded', function(e) {

    //toggles between showing only the favourited events or not
    $scope.toggleShowFavOnly = function() {

      $scope.showFavOnly = !$scope.showFavOnly;

      //scroll to top
      $ionicScrollDelegate.scrollTop(true);

      //turn on the accessory bar because we're not actually a native app and need the done button
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);      
    }

    $scope.showShareOptions = function (event)
    {
      $shareOptions.show(event);
    }

    //enable toast
    $scope.showToast = function(message, duration, location) {
      document.addEventListener("deviceready", function(){
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
      });
    }

    //returns true if the scheduled event with the given firebase ID is in the user's favourites or not, or false otherwise
    $scope.isScheduledEventFavourited = function(id) {

      return getIndexOfObjInArrayMatchingProperty(favouritedEventsStore, 'id', id) !== -1;
    }

    var firebaseUrl = AppConstants.getEnvVars().firebase;
    var ref = new Firebase(firebaseUrl);
    var eventId = $stateParams.eventId;
    $scope.scheduledEventsRef = ref.child('scheduled_events').orderByChild('eventId').equalTo(eventId);

    // order by
    $scope.predicate = 'start';

    //determines whether our favourites list is empty or not
    $scope.isFavouriteEmpty = function() {

      var validExists = false;

      //loop through all of our stored favourites
      for (var i = 0; i < favouritedEventsStore.length; i++) {

        //and make sure that the favourites is valid. A favourite must have a location and an id, as well as be one of the events to be potentially displayed in this list
        if (favouritedEventsStore[i].id != undefined && favouritedEventsStore[i].location != undefined && $scope.scheduledEvents.$getRecord(favouritedEventsStore[i].id) != null) {

          validExists = true;
          break;
        }
      }

      return !validExists;
    }

    // get the scedule
    $scope.scheduledEvents = ScheduledEvents.getByEventId(eventId);

    $scope.eventObj = $firebaseObject(ref.child("events").child(eventId));

    //toggles whether this scheduled event should be favourited or not. Expects the firebase ID of the scheduled event
    $scope.toggleFavScheduledEvent = function(scheduledEvent) {

      var eventId = scheduledEvent.$id;
      var indexOfId = getIndexOfObjInArrayMatchingProperty(favouritedEventsStore, 'id', eventId);

      //the id wasn't previously favourited, add it
      if (indexOfId === -1) {

        favouritedEventsStore.push(
          {
            id : eventId,
            location : scheduledEvent.locationId
          }
        );

        //notify user
        $scope.showToast('Added to your schedule!','short','bottom');
      }
      //item was in the favourites, remove it
      else {

        favouritedEventsStore.splice(indexOfId, 1);

        $scope.showToast('Removed from your schedule!','short','bottom');
      }

      //save storage in case the app closes or something
      $localstorage.setObject(FAVOURITED_EVENTS_KEY, favouritedEventsStore);
    };

    //a method that determines whether the current item should show in the view
    $scope.shouldDisplayEvent = function(id) {

      if ($scope.showFavOnly === false) {

        return true;
      }
      else {

        return $scope.isScheduledEventFavourited(id);
      }
    }
  });

})

/**
 * EventsLocationScheduledEventsCtrl
 */
.controller('EventLocationCtrl', function($stateParams, $firebaseObject, $firebaseArray, $scope, AppConstants, $localstorage, DZHelpers, $ionicScrollDelegate, $activityIndicator, $cordovaToast, $timeout) {

  //get the object that will store all our favourited scheduled events
  var favouritedEventsStore = getArrayFromLocalStorage($localstorage, FAVOURITED_EVENTS_KEY);

  var anchorScroll = function(){

    $ionicScrollDelegate.$getByHandle('locationScroll').anchorScroll(true);
    $ionicScrollDelegate.$getByHandle('locationScroll').scrollBy(0, -10, false); // added this so we see a bit of the grey background at the top of the item
  };

  $scope.$on('$ionicView.afterEnter', function(e) {

    var firebaseUrl = AppConstants.getEnvVars().firebase;
    var ref = new Firebase(firebaseUrl);
    var locationId = $stateParams.locationId;

    // start the spinner
    $activityIndicator.startAnimating();

    $scope.scheduledEventsRef = ref.child('scheduled_events').orderByChild('locationId').equalTo(locationId);
    $scope.scheduledEvents = $firebaseArray($scope.scheduledEventsRef);
    $scope.locationObj = $firebaseObject(ref.child('locations').child(locationId));

    // stop the spinner
    $scope.scheduledEventsRef.on('value', function(snapshot) {
      console.log('snapshot.numChildren(): ', snapshot.numChildren());
      $activityIndicator.stopAnimating(0); // remove the spinner
      $timeout(anchorScroll, 750); // scroll to an anchor
    });

    //enable toast
    $scope.showToast = function(message, duration, location) {
      document.addEventListener("deviceready", function(){
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
      });
    }

    //returns true if the scheduled event with the given firebase ID is in the user's favourites or not, or false otherwise
    $scope.isScheduledEventFavourited = function(id) {

      return getIndexOfObjInArrayMatchingProperty(favouritedEventsStore, 'id', id) !== -1;
    }

    $scope.openURLNatively = function(url) {

      navigator.notification.confirm("Do you want to leave the app and view this web page?", function(buttonIndex) {
        switch(buttonIndex) {
            case 1:

                break;
            case 2:
                window.open(url, "_system", "location=yes, enableViewportScale=yes, hidden=no");
                break;
        }
      }, "Leaving Eventro", ["Cancel", "Ok"]);


    }


    $scope.openEmailNatively = function(email) {

      navigator.notification.confirm("Do you want to leave the app and open your email client?", function(buttonIndex) {
        switch(buttonIndex) {
            case 1:

                break;
            case 2:
                window.open(email);
                break;
        }
      }, "Leaving Eventro", ["Cancel", "Ok"]);


    }

    $scope.openGeoLocationNatively = function(lat, lng) {

            navigator.notification.confirm("Do you want to leave the app to get directions on your map application?", function(buttonIndex) {
              switch(buttonIndex) {
                  case 1:

                      break;
                  case 2:
                      window.open(DZHelpers.getNativeGeoLink(lat, lng), "_system");
                      break;
              }
            }, "Leaving Eventro", ["Cancel", "Ok"]);
    }

    //scroll to bottom of view
    $scope.scrollToBottom = function()
    {
        $ionicScrollDelegate.scrollBottom(true);
    };

    //toggles whether this scheduled event should be favourited or not. Expects the firebase ID of the scheduled event
    $scope.toggleFavScheduledEvent = function(scheduledEvent) {

      var eventId = scheduledEvent.$id;
      var indexOfId = getIndexOfObjInArrayMatchingProperty(favouritedEventsStore, 'id', eventId);

      //the id wasn't previously favourited, add it
      if (indexOfId === -1) {

        favouritedEventsStore.push(
            {
              id : eventId,
              location : scheduledEvent.locationId
            }
          );

        //notify user
        $scope.showToast('Added to your schedule!','short','bottom');
      }
      //item was in the favourites, remove it
      else {

        favouritedEventsStore.splice(indexOfId, 1);

        //notify user
        $scope.showToast('Removed from your schedule!','short','bottom');
      }

      //save storage in case the app closes or something
      $localstorage.setObject(FAVOURITED_EVENTS_KEY, favouritedEventsStore);
    };
  });
})

/**
 * EventScheduleCtrl
 */
.controller('EventMapCtrl', function($stateParams, ScheduledEvents, $ionicModal, $ionicLoading, $scope, $firebaseObject, $firebaseArray, AppConstants, $cordovaGeolocation, ngGPlacesAPI, $ionicPopover, LocationCategories, DZHelpers, $localstorage,$shareOptions) {

  var TAG = 'EventMapCtrl';

  console.info(TAG);

  $scope.isMapVisible = true;

  // init vars
  var markers = [];
  var map;

  var firebaseUrl = AppConstants.getEnvVars().firebase;
  var ref = new Firebase(firebaseUrl);
  var eventId = $stateParams.eventId;
  var eventsRef = ref.child('events').child(eventId);
  var locationsRef = ref.child('locations').orderByChild('eventId').equalTo(eventId);

  // get the event details
  $scope.eventDetails = $firebaseObject(eventsRef);
  var locations = $firebaseArray(locationsRef);

  $scope.$on('$ionicView.beforeEnter', function(e) {

    // flag to determine whether our view should display only favourited events
    $scope.showFavOnly = false;
    $scope.data.locationFilter = "";
    $scope.filterLocations();
  });

  $scope.$on('$ionicView.loaded', function(e) {

    // toggles between showing only the favourited events or not
    $scope.toggleShowFavOnly = function() {

      $scope.showFavOnly = !$scope.showFavOnly;

      // set the filter value to my_schedule
      if ($scope.showFavOnly) {
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
      $shareOptions.show(event);
    }

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

  /**
   * The main process
   */
  var beginProcess = function(){


    var boundaryDistance = function(lat1, lon1, lat2, lon2, unit)
    {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
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

      //disable any further touches
      map.setClickable(false);

      console.log(TAG+': markerClick');

      var showModal = function(data){

        if($scope.modal)
        {
          $scope.modal.remove();
          console.log(TAG+': removed duplicate modal');
        }

        console.log(TAG+': showModal');

        // show our modal
        $ionicModal.fromTemplateUrl('templates/modals/map-location.html', {

          scope: $scope,
          animation: 'none'
        }).then(function(modal) {

          console.log('marker.get(\'position\'): ', marker.get('position'));

          $scope.modal = modal;

          $scope.locationName = data.locationName;
          $scope.position = marker.get('position');
          $scope.vicinity = data.vicinity;
          $scope.locationEventsCount = data.locationEventsCount;
          $scope.isEventLocation = data.isEventLocation;
          $scope.locationId = data.locationId;

          // look after the icon image - TODO fix the icon url
          var firebaseHostingUrl = AppConstants.getEnvVars().firebaseHostingUrl;
          //$scope.icon = data.isEventLocation ? firebaseHostingUrl+"/images/category_icons_small/"+data.locationCategory+".png" : data.googleIcon.url;
          $scope.icon = data.isEventLocation ? data.icon.url.replace('category_icons_cms', 'category_icons_small') : data.googleIcon.url; // hack here of replace was added because we only store the icon for the map marker and not the icon that is used in the modal

          console.log('$scope.icon: ', $scope.icon);

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

          // show the modal
          $scope.modal.show();

          // close the modal
          $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove();
            map.setClickable( true );
          };


          // get directions to the location
          $scope.getDirections = function(lat, lng){
            console.log(TAG+': getDirections');

            console.log('lat: ', lat);
            console.log('lng: ', lng);

            navigator.notification.confirm("Do you want to leave the app to get directions on your map application?", function(buttonIndex) {
              switch(buttonIndex) {
                  case 1:

                      break;
                  case 2:
                      window.open(DZHelpers.getNativeGeoLink(lat, lng), "_system");
                      break;
              }
            }, "Leaving Eventro", ["Cancel", "Ok"]);
          };

          // go to the location detail
          $scope.gotoLocationDetail = function(lat, lng){

            console.log(TAG+': gotoLocationDetail');
            $scope.modal.remove();
            map.setClickable( true );
          };

          // Cleanup the modal when we're done with it!
          $scope.$on('$destroy', function() {
            $scope.modal.remove();
          });

          // Execute action on hide modal
          $scope.$on('modal.hidden', function() {
            // Execute action
          });

          // Execute action on remove modal
          $scope.$on('modal.removed', function() {
            // Execute action
          });
        });
      };

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
        console.log('dataForModal: ', dataForModal);
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
        console.log('dataForModal: ', dataForModal);
      }
    };

    /**
     * Plot the locations on the map
     */
    var plotEventLocations = function(dataSnapshot){

      console.log(TAG+': plotEventLocations');

      // get our map div
      var mapDiv = document.getElementById("map_canvas");;

      /**
       * This runs once the map has been initialized
       */
      var onMapInit = function (map) {

        console.log(TAG+': onMapInit');

        //hide spinner
        //$ionicLoading.hide();


        // clear the map
        map.clear();
        map.off();


        // array of points to bound the camera
        var points = [];

        // get the Firebase hosting URL
        var firebaseHostingUrl = AppConstants.getEnvVars().firebaseHostingUrl;

        // loop through the event locations
        $scope.allEventMarkersCreated = false;
        var eventMarkerCount = 0;
        var favouritedEventsStore = getArrayFromLocalStorage($localstorage, FAVOURITED_EVENTS_KEY);
        for (var i = 0; i < locations.length; i++) {

          var locationHasFavEvent = false;

          // single point
          var point = new plugin.google.maps.LatLng(locations[i].latitude, locations[i].longitude);

          // add to the points array
          points.push(point);

          // loop through the favourited events
          for (var j=0; j<favouritedEventsStore.length;j++) {

            // an event at this location has been favourited
            if (locations[i].$id === favouritedEventsStore[j].location) locationHasFavEvent = true;
          }

          //var iconUrl = locationHasFavEvent ? firebaseHostingUrl+"/images/category_icons/my_schedule.png" : firebaseHostingUrl+"/images/category_icons/"+locations[i].category+".png";
          var iconUrl = locations[i].icon;

          // added this so we could filter by my_schedule
          var locationCategory = locationHasFavEvent ? 'my_schedule' : locations[i].category;

          // add the event location markers
          map.addMarker({
            'position': point,
            'locationId': locations[i].$id,
            'locationName': locations[i].name,
            'locationCategory': locationCategory,
            'locationEventsCount': locations[i].number_of_events,
            'icon': {'url': iconUrl, 'size': {width: 46, height: 54}}
          }, function(marker) {

            eventMarkerCount++;
            console.log('eventMarkerCount: ', eventMarkerCount);
            console.log('locations.length: ', locations.length);

            if (eventMarkerCount === locations.length) {

              $scope.$apply(function () {
                $scope.allEventMarkersCreated = true;
              });
            }

            // add the marker to an array so we can remove on leave
            markers.push(marker);

            // add the click event listener
            var markerListener = marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, markerClick);
          });
        }

        // bound the camera to the points
        var latLngBounds = new plugin.google.maps.LatLngBounds(points);

         map.moveCamera({
            'target' : latLngBounds
          }, function()
          {

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
            var point = new plugin.google.maps.LatLng(data[i].geometry.location.G, data[i].geometry.location.K);
            var iconUrl = data[i].icon;

            // add the event location markers
            map.addMarker({
              'position': point,
              'icon': {'url': iconUrl, 'size': {width: 15, height: 15}},
              'vicinity': data[i].vicinity,
              'locationName': data[i].name
            }, function(marker) {

              // add the marker to an array so we can remove on leave
              markers.push(marker);

              // add the click event listener
              var markerListener = marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, markerClick);
            });
          }
        });
      };

      // set the params for the map
      var mapParams = {
        'controls': {
          'myLocationButton': true
        }
      };

      // Initialize the map plugin
      map = plugin.google.maps.Map.getMap(mapDiv, mapParams);

      map.setVisible(false);

      // You have to wait the MAP_READY event.
      map.on(plugin.google.maps.event.MAP_READY, onMapInit);
      map.setBackgroundColor('#ffffff');

    };

    // when device is ready
    document.addEventListener("deviceready", function() {

      locationsRef.on('value', plotEventLocations);
    });
  };

  // view event listeners
  $scope.$on('$ionicView.loaded', function(e) {

    //show spinner while map gets ready
    //$ionicLoading.show();

    beginProcess();

    //turn on the accessory bar because we're not actually a native app and need the done button
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
  });

  // view event listeners
  $scope.$on('$ionicView.leave', function(e) {

    //turn on the accessory bar because we're not actually a native app and need the done button
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    // destroy the map

  });

  // setup the data for the locations filter
  $scope.locationCategories = LocationCategories.get();
  $scope.data = {locationFilter: ''};

  /**
   * Filter the event markers on the map by
   * location category
   */
  $scope.filterLocations = function(){

    /**
     * loop through the markers and set visabilty based on the
     * filter set
     */
    for (var i=0;i<markers.length;i++) {

      // this is an event location marker
      if (markers[i].get('locationCategory') !== null) {

        var visBool;

        // we have a filter selected
        if ($scope.data.locationFilter.length > 0) {

          visBool = markers[i].get('locationCategory') === $scope.data.locationFilter ? true : false
        }
        // we have no filter selected
        else {

          visBool = true;
        }
        markers[i].setVisible(visBool);
      }
    }
  };
})

/**
 * ApplicationCtrl
 */
.controller('ApplicationCtrl', function($scope, $location, $rootScope, AppConstants,$cordovaNetwork) {

  var TAG = 'ApplicationCtrl';
  console.info(TAG);

  $scope.isOnline = true;

  document.addEventListener("deviceready", function () {


    $scope.getSectionClass = function(){

      var path = $location.path();

      switch(path) {
        case '/events':
          return "events"
          break;
      }
    };

    /**
     * Get the initial value for isOnline
     */

    var type = $cordovaNetwork.getNetwork();

    var appIsOnline = $cordovaNetwork.isOnline();

    var appIsOffline = $cordovaNetwork.isOffline();

    //set initial state
    if(appIsOnline == true)
    {
      $scope.isOnline = true;
    }
    else
    {
      $scope.isOnline = false;
    }

    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      var onlineState = networkState;
      $scope.isOnline = true;
    })

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      $scope.isOnline = false;
    })

  });
})

/**
 * MyScheduleCtrl
 */
.controller('TestCtrl', function($scope, $firebaseArray, AppConstants, $ionicModal, LocationCategories) {

  var firebaseUrl = AppConstants.getEnvVars().firebase;

  $scope.seedDb = function() {

    // get the refs to the db
    var eventsRef = new Firebase(firebaseUrl+"/events");
    var locationsRef = new Firebase(firebaseUrl+"/locations");
    var scheduledItemsRef = new Firebase(firebaseUrl+"/scheduled_events");
    var locationCategoriesRef = new Firebase(firebaseUrl+"/location_categories");
    var events = $firebaseArray(eventsRef);
    var locations = $firebaseArray(locationsRef);
    var scheduledItems = $firebaseArray(scheduledItemsRef);
    var locationCategories = $firebaseArray(locationCategoriesRef);

    /**
     * TechXplore - START
     */
    events.$add({
      name: "TechXplore",
      start: (new Date("Sep 3, 2015 10:30:00")).getTime(),
      end: (new Date("Sep 3, 2015 20:00:00")).getTime()
    }).then(function(ref) {

      // get the event id
      var eventId = ref.key();

      // get the record
      var eventDetails = events.$getRecord(eventId);

      /**
       * add locations - START
       */
      locations.$add({
            name: "The Life Church",
            description: "TechXplor is Belfast's largest and best-value home-grown technology event which aimes to help and inspire people across Belfast, the UK and Irelad to bring their tech ideas to the world.",
            address: "The Life Church\nBruce Street\nBelfast\nBT2 7JD",
            tel: "028 9026 7072",
            email: "askaquestion@mwadvocate.com",
            web: "http://www.techxplore.co",
            latitude: 54.593071,
            longitude: -5.932412,
            eventId: eventId,
            category: "conf_business",
            'event': eventDetails,
            number_of_events: 9
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Panel 1 – Start-Ups",
          description: "From Ireland to the world: tech start-ups from all over Ireland will show how they took the seed of their idea to a fledgling business and outline their ambition to succeed globally, including Danny Turley from Performa Sports and Tracy Keogh.",
          start: (new Date("Sep 3, 2015 10:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 11:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Panel 2 – Media",
          description: "Paywall versus free news - the challenge of monetising news: expert on Native content Amanda Hale from Talking Points Memo and Aine Kerr from Storyful will provide insight on the challenges facing news gatherers in the 21st century. They will be joined by BelfastLive’s Chris Sherrard, who is leading the way in digital media locally.",
          start: (new Date("Sep 3, 2015 11:40:00")).getTime(),
          end: (new Date("Sep 3, 2015 12:40:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "ThatLot Social Media Masterclass",
          description: "David Levin from ThatLot is the brains behind some of the best twitter feeds, including BBC shows The Apprentice & The Voice, L'Oreal Men Expert & Rufus the Hawk. He's back at TechXplore to show you how to make your 140 characters count.",
          start: (new Date("Sep 3, 2015 14:00:00")).getTime(),
          end: (new Date("Sep 3, 2015 14:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Innovator Media Workshop",
          description: "Join Amanda Hale from Talking Points Memo in an intimate roundtable workshop, where you can ask all your burning questions on monetising news and native content.",
          start: (new Date("Sep 3, 2015 14:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 15:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Panel 3 – Music",
          description: "Tech and creative industries: Technology has revolutionised how artists deliver their music to the audience. Music guru turned angel investor Jon Vanhala, digital music expert Bill Campbell and Paul Hamill from local company Inflyte will look at how the industry is adapting.",
          start: (new Date("Sep 3, 2015 14:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 15:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Innovator Music Workshop",
          description: "Music gurus Jon Vanhala & Bill Campbell will take their places at the Innovator Media Workshops to answer your questions on digital music. They will give a unique insight on the sector from their experience with some of the biggest global music labels and their work with start-ups.",
          start: (new Date("Sep 3, 2015 15:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 16:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Panel 4 – Health",
          description: "Measuring health with technology: Can technology improve health outcomes? We will hear from Tom Lynch from Experior on how they are using their innovation to help medical experts in the public sector improve diagnosis, and Mark Lee from the Department of Health will give the view from inside public sector.",
          start: (new Date("Sep 3, 2015 15:40:00")).getTime(),
          end: (new Date("Sep 3, 2015 16:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "VC Meet & Greet",
          description: "After the four panel sessions have ended you will have the chance to join the Venture Capital Meet & Greet. Over a drink you will be able to ask them about what they look for in a start up and get some tips on how to wow investors in a pitch session.",
          start: (new Date("Sept 3, 2015 18:00:00")).getTime(),
          end: (new Date("Sept 3, 2015 18:40:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Tech Cabaret",
          description: "When all the formalities are over, you will be able to kick back and relax to Belfast's first Tech Cabaret. Curated by Belfast's own P T Barnum, creator of Culture Night, Adam Turkington, the Cabaret will feature Ursula Burns, Caolan McBride and Street Countdown, all compered by Stephen Beggs.",
          start: (new Date("Sept 3, 2015 19:30:00")).getTime(),
          end: (new Date("Sept 3, 2015 20:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });
      /**
       * add locations - END
       */
    });
    /**
     * TechXplore - END
     */

    /**
     * Belfast Homecoming 2015 - START
     */
    events.$add({
      name: "Belfast Homecoming 2015",
      start: (new Date("Oct 7, 2015 13:00:00")).getTime(),
      end: (new Date("Oct 10, 2015 20:00:00")).getTime()
    }).then(function(ref) {

      // get the event id
      var eventId = ref.key();

      // get the record
      var eventDetails = events.$getRecord(eventId);

      /**
       * add locations - START
       */
      locations.$add({
            name: "East Belfast Visitors Centre",
            description: "Non-Profit Organisation",
            address: "Avalon House\n278-280 Newtownards Rd\nBelfast, County Antrim\nBT4 1HE",
            tel: "028 9045 1900",
            web: "http://www.eastbelfastpartnership.org/",
            latitude: 54.599217,
            longitude: -5.895392,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 0
      });

      locations.$add({
            name: "Stormont Parliament Buildings",
            description: "Parliament Buildings is home to the Northern Ireland Assembly, the legislative body for Northern Ireland. There are several ways you can visit Parliament Buildings. Open to the public between 9.00am and 4.00pm Monday to Friday, you can see first-hand the building and beautiful surroundings of the Stormont Estate. While the Assembly is in session free public tours are available Monday - Friday at 11am and 2pm. During July, August, Halloween and Easter recess tours starting on the hour are available between 10am and 3pm (please check www.niassembly.gov.uk for changes to tour times).",
            address: "Parliament Buildings\nUpper Newtownards Road\nBT4 3XX",
            tel: "028 90521802",
            email: "info@niassembly.gov.uk",
            web: "http://www.niassembly.gov.uk",
            latitude: 54.604982,
            longitude: -5.832115,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Into the East",
          description: "Visit to East Belfast Visitors Centre and Stormont.",
          start: (new Date("Oct 7, 2015 13:00:00")).getTime(),
          end: (new Date("Oct 7, 2015 13:40:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "MovieHouse Cinemas",
            description: "This multiplex cinema branch screens the latest big-name movies and comes with secure parking...",
            address: "14 Dublin Rd\nBelfast\nBT2 7HN",
            tel: "028 9024 5700",
            web: "http://moviehouse.co.uk",
            latitude: 54.592187,
            longitude: -5.931665,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Movie - Alive from Divis Flats",
          description: "With Director Eleanor McGrath and movie subject Hugo Straney from Toronto. MovieHouse Cinema, Dublin Rd.",
          start: (new Date("Oct 7, 2015 17:30:00")).getTime(),
          end: (new Date("Oct 7, 2015 18:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Belfast City Hall",
            description: "Belfast City Hall is the civic building of Belfast City Council. Located in Donegall Square, Belfast, County Antrim, Northern Ireland, it faces north and effectively divides the commercial and business areas of the city centre.",
            address: "Donegall Square S\nBelfast\nAntrim\nBT1 5GS",
            tel: "028 9032 0202",
            web: "http://belfastcity.gov.uk",
            latitude: 54.596499,
            longitude:  -5.930197,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Reception of Welcome",
          description: "With the Lord Mayor of Belfast Arder Carson in Belfast City Hall. Guest of Honour: Rep. Mike Cusick, President American Irish Legislators Society of NY.",
          start: (new Date("Oct 7, 2015 18:45:00")).getTime(),
          end: (new Date("Oct 7, 2015 20:45:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "The Cloth Ear, Merchant Hotel",
            description: "Classy pub-style menu in a buzzy bar with quirky decor, situated in an upscale hotel.",
            address: "35-39 Waring St\nBelfast\nCounty Antrim\nBT1 2DY",
            tel: "028 9026 2719",
            web: "http://themerchanthotel.com",
            email: "info@themerchanthotel.com",
            latitude:  54.601105,
            longitude:  -5.926068,
            eventId: eventId,
            'event': eventDetails,
            category: "bar_club",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Conference Club @ The Cloth Ear",
          description: "",
          start: (new Date("Oct 7, 2015 22:00:00")).getTime(),
          end: (new Date("Oct 7, 2015 23:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Malone Golf Club",
            description: "Malone is a fine championship course situated on 330 acres of undulating wooded parkland. Its 27 holes of secluded gently undulating parkland countryside is just 5 miles from Belfast City centre. The centre piece of the course is the beautiful natural trout lake which extends for some 25 acres. The course is a real challenge with mature trees shaping many of the holes with the lake first comes into play on the 13th. Beware the 15th where the tee shot to a tricky undulating green is over water all the way. Also the 18th is daunting where almost any ball to the right of the green is water bound.",
            address: "240 Upper Malone Rd\nBelfast\nBT17 9LB",
            tel: "028 9061 2758",
            web: "http://malonegolfclub.co.uk",
            email: "admin@malonegolfclub.co.uk",
            latitude:  54.538604,
            longitude:  -5.978372,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "A Day on the Green",
          description: "Hosted by Clubs For Hire at Malone Golf Club.",
          start: (new Date("Oct 8, 2015 11:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 13:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "New Ulster University Belfast Campus",
            description: "Belfast campus is situated in the artistic and cultural centre of the city; the Cathedral Quarter.",
            address: "25-51 York St\nBelfast\nCounty Antrim\nBT15 1ED",
            tel: "028 7012 3456",
            web: "http://ulster.ac.uk",
            latitude:  54.603932,
            longitude:  -5.929092,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Belfast Walking Tour",
          description: "New Ulster University Belfast Campus Folktown Market, Bank Square The Hudson.",
          start: (new Date("Oct 8, 2015 11:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 13:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Royal Courts of Justice",
            description: "The Royal Courts of Justice in Belfast is the home of the Court of Judicature of Northern Ireland established under the Judicature Act 1978.",
            address: "Chichester St\nBelfast\nBT1 3JY",
            tel: "030 0200 7812",
            email: "adminoffice@courtsni.gov.uk",
            web: "http://courtsni.gov.uk",
            latitude:  54.597510,
            longitude:  -5.922880,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Legal Symposium",
          description: "The Inn of Court – Royal Courts of Justice, Belfast.",
          start: (new Date("Oct 8, 2015 11:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 14:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Hillsborough Castle",
            description: "Official residence of both the Queen and Secretary of State for Northern Ireland (open Apr to Sep).",
            address: "Main Street\nHillsborough\nBT26 6AG",
            tel: "028 9268 1308",
            web: "http://hrp.org.uk",
            latitude:  54.461166,
            longitude:  -6.085696,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Hillsborough Castle",
          description: "Bus leaves from Jury’s Hotel.",
          start: (new Date("Oct 8, 2015 15:30:00")).getTime(),
          end: (new Date("Oct 8, 2015 18:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Belfast Dockland",
            address: "Dock St\nBelfast\nBT15 1WZ",
            latitude:  54.609239,
            longitude:  -5.921534,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 2
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Pop-Up Banquet & Opening Ceremony",
          description: "In the heart of Belfast’s Dockland Compere: Geraldine Hughes Menu: Curated by Niall McKenna Guest Speaker: CM Daniel Dromm Chair of Education Committee, NY City Council Featuring: The Belfast Community Gospel Choir",
          start: (new Date("Oct 8, 2015 19:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 22:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Invent Awards Dinner",
          description: "Over 600 investors, entrepreneurs, executives, top research scientists, and elected officials will gather at the INVENT Awards. INVENT is a competition for prototype technologies to discover the best new inventions in the country. To see the 2015 finalists and to book your ticket check out the following link - www.invent2015.co",
          start: (new Date("Oct 8, 2015 19:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 22:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "The National Grande Cafe",
            address: "62 High St\nBelfast\nCounty Antrim\nBT1 2BE",
            tel: "028 9031 1130",
            web: "http://thenationalbelfast.com",
            latitude: 54.600449,
            longitude: -5.926018,
            eventId: eventId,
            'event': eventDetails,
            category: "bar_club",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Conference Club @ The National",
          start: (new Date("Oct 8, 2015 19:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 23:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Titanic Belfast",
            address: "Titanic House\n6 Queens Rd\nBelfast BT3 9DT",
            tel: "+44 (0) 28 9076 6300",
            email: "info@titanicquarter.com",
            web: "http://www.titanic-quarter.com/",
            latitude: 54.607763,
            longitude: -5.908448,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 11
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Continental Breakfast and Registration",
          description: "A continental Breakfast to enjoy while you Register",
          start: (new Date("Oct 9, 2015 08:00:00")).getTime(),
          end: (new Date("Oct 9, 2015 12:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Five years to Wow the World — Belfast by 2020",
          description: "Chair: Peter Dixon, Chair Phoenix Natural Gas. Panel: Judith Totten, MD Keys Commercial Finance & Board Member Invest NI Rep Brian Kavanagh New York State Assemblymember for Manhattan, Paddy Nixon Vice-Chancellor University of Ulster, Suzanne Wylie CEO Belfast City Council.",
          start: (new Date("Oct 9, 2015 08:20:00")).getTime(),
          end: (new Date("Oct 9, 2015 10:20:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "The Three Things Needed to Make Belfast a Business Powerhouse",
          description: "Chair: John J. Reilly, Squire Patton Boggs, New York Panel: Ann Gallagher, Director of Engineering, Head of NI Operations Tyco, Michael Ryan, CEO Bombardier, Jack Butler, CEO Market Resource Partners, Pete Boyle, Founder and CEO Argento",
          start: (new Date("Oct 9, 2015 09:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 10:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Welcome to a City Reborn",
          description: "Lord Mayor of Belfast Arder Carson, Richard Donnan, MD Ulster Bank.",
          start: (new Date("Oct 9, 2015 09:00:00")).getTime(),
          end: (new Date("Oct 9, 2015 11:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Moving Up a Gear: Game-Changers Which Can Transform Belfast",
          description: "Chair: Gavin Robinson MP Film & TV: Kieran Doherty, Joint MD and Co-Founder Stellify Waterfront Convention Centre: Cllr Deirdre Hargey, Chair City Growth and Regeneration Committee Belfast City Council Technology: Jackie Henry, Senior Partner Deloitte Hospitality: Howard Hastings, Hastings Hotels Entrepreneurship: Speaker from E Spark Edinburgh TBC.",
          start: (new Date("Oct 9, 2015 09:45:00")).getTime(),
          end: (new Date("Oct 9, 2015 10:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "BUCKETBOARD: Transforming the World, One Skateboard at a Time",
          description: "Mac Premo (New York).",
          start: (new Date("Oct 9, 2015 10:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 11:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Learning from Bilbao and Partnering for Progress",
          description: "With Mayor Juan Mari Aburto of Bilbao interviewed by Mark Carruthers, BBC.",
          start: (new Date("Oct 9, 2015 10:25:00")).getTime(),
          end: (new Date("Oct 9, 2015 11:25:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Future Cities",
          description: "Chair: Mary McKenna, Entpreneur, Founder Irish International Business Network (London) Ard-mhéara Bhaile Átha Ciath (Lord Mayor of Dublin) Críona Ní Dhálaigh Rep Linda B. Rosenthal, Member New York Assembly, representative for Manhattan Liam Lynch, Founder Irish Diaspora Angel Network (New York) Mary.",
          start: (new Date("Oct 9, 2015 10:45:00")).getTime(),
          end: (new Date("Oct 9, 2015 12:45:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Progress, Prosperity and Peaceful Streets",
          description: "George Hamilton, PSNI Chief Constable, Liam Maskey, Director Intercomm, Peter Osborne, CEO Community Relations Council.",
          start: (new Date("Oct 9, 2015 11:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 13:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Looking East and South to our Neighbours",
          description: "Conor McGinn MP, Conor Burns MP, Philippa Whitford MP, Jennie McShannon, CEO Irish in Britain, Minister Seán Sherlock TD.",
          start: (new Date("Oct 9, 2015 11:45:00")).getTime(),
          end: (new Date("Oct 9, 2015 12:45:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Boardroom Dialogue Sessions",
          description: "1. Innovation and Start-Ups\n\n2. The proposition for the visitor & Citizen (Culture & Arts Hospitality & Tourism)\n\n3. Peacebuilding, Diversity and Reconciliation.",
          start: (new Date("Oct 9, 2015 12:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 14:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });
      /**
       * add locations - END
       */
    });
    /**
     * Belfast Homecoming 2015 - END
     */

    /**
     * Location Categories - START
     */
    locationCategories.$add({
      name: "bar_club",
      asString: "Bar/Club"
    });

    locationCategories.$add({
      name: "conf_business",
      asString: "Conf/Business"
    });

    locationCategories.$add({
      name: "culture",
      asString: "Culture"
    });

    locationCategories.$add({
      name: "emergency",
      asString: "Emergency"
    });

    locationCategories.$add({
      name: "food",
      asString: "Food"
    });

    locationCategories.$add({
      name: "general",
      asString: "General"
    });

    locationCategories.$add({
      name: "information",
      asString: "Information"
    });

    locationCategories.$add({
      name: "music",
      asString: "Music"
    });

    locationCategories.$add({
      name: "my_schedule",
      asString: "My Schedule"
    });

    locationCategories.$add({
      name: "parking",
      asString: "Parking"
    });

    locationCategories.$add({
      name: "toilets",
      asString: "Toilets"
    });

    locationCategories.$add({
      name: "transport",
      asString: "Transport"
    });

    /**
     * Location Categories - END
     */
  };
});
