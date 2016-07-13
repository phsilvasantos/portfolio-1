/**
 * Tis is the screen where you can see all the things happening at an event and favourite them
 */
angular.module('starter.controllers')
.controller('EventScheduleCtrl', function($log, $stateParams, $firebaseObject, $firebaseArray, $scope, Events, $ionicScrollDelegate, $location, $filter, AppConstants, $localstorage, ScheduledEvents, $activityIndicator,$cordovaToast,$shareOptions, $rootScope) {

  var TAG = "EventScheduleCtrl";

  var isWebView = ionic.Platform.isWebView();

  // setup defaults and get params
  $scope.isScheduledEventCategories = false;
  var eventId = $stateParams.eventId;
  $scope.categoryFilter = '';
  $rootScope.showNoResults = false;

  // look after the scroll when we change the filter
  $scope.categoryFilterChange = function(){
    $ionicScrollDelegate.$getByHandle('scheduleScroll').scrollTop(true);
  };

  var firebaseUrl = AppConstants.getEnvVars().firebase;
  var scheduledEventCategoriesRef = new Firebase(firebaseUrl+"/scheduled_event_categories/");
  var categoriesForThisEventRef = scheduledEventCategoriesRef.orderByChild('eventId').equalTo(eventId);

  //get the object that will store all our favourited scheduled events
  var favouritedEventsStore;

  $scope.$on('$ionicView.beforeEnter', function(e) {

    //flag to determine whether our view should display only favourited events
    if (typeof $rootScope.showFavOnly === "undefined") $rootScope.showFavOnly = false;
    favouritedEventsStore = getArrayFromLocalStorage($localstorage, FAVOURITED_EVENTS_KEY);
  });

    // view event listeners
  $scope.$on('$ionicView.enter', function(e) {

    //turn on the accessory bar because we're not actually a native app and need the done button
    if (isWebView) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
  });

  // view event listeners
  $scope.$on('$ionicView.leave', function(e) {

    //turn on the accessory bar because we're not actually a native app and need the done button
    if (isWebView) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
  }); 

  /**
   * Category filter
   */
  $scope.scheduledEventCategories = $firebaseArray(categoriesForThisEventRef);

  // listener for categories
  categoriesForThisEventRef.on('value', function(dataSnapshot){
    // look after our no results
    $scope.isScheduledEventCategories = dataSnapshot.numChildren() > 0;
  });

  /**
   * Loaded
   */
  $scope.$on('$ionicView.loaded', function(e) {

    //toggles between showing only the favourited events or not
    $scope.toggleShowFavOnly = function() {

      $rootScope.showFavOnly = !$rootScope.showFavOnly;

      //scroll to top
      $ionicScrollDelegate.scrollTop(true);  
    }

    $scope.showShareOptions = function (event)
    {
      $shareOptions.show(event);
    }

    //enable toast
    $scope.showToast = function(message, duration, location) {
      if (isWebView) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            
        }, function (error) {
            console.log("The toast was not shown due to " + error);
        });
      }
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
    
    $scope.filtering = function(arr) {
      
      return $filter('min')
        ($filter('map')(arr, $scope.predicate));
    }

    //determines whether our favourites list is empty or not
    $scope.isFavouriteEmpty = function() {

      var validExists = false;

      //loop through all of our stored favourites
      for (var i = 0; i < favouritedEventsStore.length; i++) {

        //and make sure that the favourites is valid. A favourite must have a location and an id, as well as be one of the events to be potentially displayed in this list
        if (favouritedEventsStore[i].id !== undefined && favouritedEventsStore[i].location !== undefined && $scope.scheduledEvents.$getRecord(favouritedEventsStore[i].id) !== null) {

          validExists = true;
          break;
        }
      }

      return !validExists;
    }

    // check to see if 

    // get the schedule
    $scope.scheduledEvents = ScheduledEvents.getByEventId(eventId);
    console.log('scheduledEvents1',$scope.scheduledEvents);
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

      if ($rootScope.showFavOnly === false) {

        return true;
      }
      else {

        return $scope.isScheduledEventFavourited(id);
      }
    }

    $scope.showSectionHeader = function(value){
      // show favs not selected
      if ($rootScope.showFavOnly === false) {
        return true;
      }
      // show favs selected
      else {
        // loop through the value passed and return if we get a true otherwise return false
        var isFavouritedItemInSection = false;
        for (var i = 0; i < value.length; i++){
          if ($scope.isScheduledEventFavourited(value[i].$id)) {
            isFavouritedItemInSection = true;
          }
        }
        return isFavouritedItemInSection;
      }      
    };   

    $scope.isEmpty = function(obj){
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
      }
      return true;      
    }; 
  });
})