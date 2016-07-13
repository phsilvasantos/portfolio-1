/**
 * EventsLocationScheduledEventsCtrl
 * Displays all the location details including the scheduled events at that location
 */
angular.module('starter.controllers')
.controller('EventLocationCtrl', function($stateParams, $firebaseObject, $firebaseArray, $scope, AppConstants, $localstorage, DZHelpers, $ionicScrollDelegate, $activityIndicator, $cordovaToast, $timeout) {

  var locationName = $stateParams.locationName;

  // get the location name - this allows the title bar to be immediately filled
  $scope.locationName = locationName;

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
      $activityIndicator.stopAnimating(0); // remove the spinner
      $timeout(anchorScroll, 750); // scroll to an anchor
    });

    //enable toast
    $scope.showToast = function(message, duration, location) {
      document.addEventListener("deviceready", function(){
        $cordovaToast.show(message, duration, location).then(function(success) {

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