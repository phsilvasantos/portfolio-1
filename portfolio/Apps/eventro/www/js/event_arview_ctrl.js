/**
 * Displays the map with all the loccations for events running on it
 */
angular.module('starter.controllers')
.controller('EventArviewCtrl', function($stateParams, ScheduledEvents, $ionicModal, $ionicLoading, $scope, $firebaseObject, $firebaseArray, AppConstants, $cordovaGeolocation, ngGPlacesAPI, $ionicPopover, LocationCategories, DZHelpers, $localstorage, $shareOptions, $rootScope, $log) {
  var TAG = 'EventArviewCtrl';

  $log.debug(TAG);

  // init vars
  var locationsSnapshot;

  var firebaseUrl = AppConstants.getEnvVars().firebase;
  var ref = new Firebase(firebaseUrl);
  var eventId = $stateParams.eventId;
  var eventsRef = ref.child('events').child(eventId);
  var locationsRef = ref.child('locations').orderByChild('eventId').equalTo(eventId);

  // get the event details
  $scope.eventDetails = $firebaseObject(eventsRef);
  $scope.locations = $firebaseArray(locationsRef);
  

  var displayARPoints = function(dataSnapshot) {
    $log.debug(TAG+': displayMapPoints');
    // set the locations snapshot that will be used to plot the markers
    locationsSnapshot = dataSnapshot;
    
    var i=0, arcodeData = [];
    var favouritedEventsStore = getArrayFromLocalStorage($localstorage, FAVOURITED_EVENTS_KEY);
    
    locationsSnapshot.forEach(function(childSnapshot) {
      
      var location = childSnapshot.val();
      var locationId = childSnapshot.key();
      var locationHasFavEvent = false;
      
      for (var j=0; j<favouritedEventsStore.length;j++) {

        // an event at this location has been favourited
        if (locationId === favouritedEventsStore[j].location) locationHasFavEvent = true;
      }
      
      arcodeData[i] = location;
      // added this so we could filter by my_schedule
      arcodeData[i].category = locationHasFavEvent ? 'my_schedule' : location.category;
      i++;
    });
    console.log('location', arcodeData);
    ARcode.arcodeview(arcodeData, function(data){
        console.log(data);
    });
  };

 /**
  * This is called when a map marker is clicked
  * We will bring up the pop with the location
  * details.
  *
  * We will need to handle both scheduled items and also
  * google places
  */
  
  // setup the data for the locations filter
  $scope.locationCategories = LocationCategories.get();
  $scope.data = {locationFilter: ''};

  /**
   * Filter the event markers on the map by
   * location category
   */
  $scope.filterLocations = function(){

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
    locationsRef.on('value', displayARPoints);
  });

  $scope.$on('$ionicView.beforeEnter', function(e) {
    $log.debug(TAG+": beforeEnter");
  });

  // view event listeners
  $scope.$on('$ionicView.leave', function(e) {
    $log.debug(TAG+": leave");
    // remove the fb listener
    locationsRef.off('value', displayARPoints);

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