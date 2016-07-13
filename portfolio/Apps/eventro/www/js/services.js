angular.module('starter.services', [])

.service("AppConstants", function AppConstants() {

  var env = 'production';

  this.getEnvVars = function (){

    var envVars = {};

    switch(env) {

      /**
       * Local
       */
      case 'local':

        envVars.env = 'local';
        envVars.firebase = 'https://eventro-local.firebaseio.com';
        envVars.firebaseHostingUrl = 'https://eventro-local.firebaseapp.com';
        break;

      /**
       * Development
       */
      case 'development':

        envVars.env = 'development';
        envVars.firebase = 'https://eventro-development.firebaseio.com';
        envVars.firebaseHostingUrl = 'https://eventro-development.firebaseapp.com';
        break;

      /**
       * Staging
       */
      case 'staging':

        envVars.env = 'staging';
        envVars.firebase = 'https://eventro-staging.firebaseio.com';
        envVars.firebaseHostingUrl = 'https://eventro-staging.firebaseapp.com';
        break;

      /**
       * Production
       */
      case 'production':

        envVars.env = 'production';
        envVars.firebase = 'https://eventro.firebaseio.com';
        envVars.firebaseHostingUrl = 'https://geteventro.com';
        break;
    }
    return envVars;
  };

  this.parseKeys = {
    applicationId: "EWVn1O9MYRPjbTmwXKnGH3Vht52wQ5Mw7JeNsGt9",
    clientKey: "LVReR0mRHrAVkIGXwSRm22XkaubHLjgb4QxZnHxp"
  };
})
.factory("ScheduledEvents", function($q, AppConstants, $firebaseArray, $activityIndicator, $ionicLoading, $rootScope) {

  var firebaseUrl = AppConstants.getEnvVars().firebase;
  var ref = new Firebase(firebaseUrl);

  var getByLocationId = function (locationId) {

    var scheduledEventsRef = ref.child('scheduled_events').orderByChild('locationId').equalTo(locationId);

    //$ionicLoading.show();
    $activityIndicator.startAnimating();

    scheduledEventsRef.on('value', function(dataSnapshot) {
      $activityIndicator.stopAnimating(0);
    });

    return $firebaseArray(scheduledEventsRef);
  }

  var getByEventId = function (eventId) {

    var scheduledEventsRef = ref.child('scheduled_events').orderByChild('eventId').equalTo(eventId);

    //$ionicLoading.show();
    $activityIndicator.startAnimating();

    scheduledEventsRef.on('value', function(dataSnapshot) {

      $activityIndicator.stopAnimating(0);
      //$ionicLoading.hide();
      $rootScope.showNoResults = true;
    });

    return $firebaseArray(scheduledEventsRef);
  }

  // this is for the revealing module pattern - ie the methods included here are public
  return {

    getByLocationId: getByLocationId,
    getByEventId: getByEventId
  };
})

.factory("LocationCategories", function($q, AppConstants, $firebaseArray) {

  var firebaseUrl = AppConstants.getEnvVars().firebase;
  var ref = new Firebase(firebaseUrl);

  var get = function () {

    var locationCategoriesRef = ref.child('location_categories');
    var locationCategories = $firebaseArray(locationCategoriesRef);

    return locationCategories;
  }

  // this is for the revealing module pattern - ie the methods included here are public
  return {

    get: get
  };
})

.factory("Events", function($firebaseArray, $ionicLoading, AppConstants, $activityIndicator) {

  var getAll = function () {

    var firebaseUrl = AppConstants.getEnvVars().firebase;
    var eventsRef = new Firebase(firebaseUrl+"/events");

    //$ionicLoading.show();
    $activityIndicator.startAnimating();

    eventsRef.on('value', function(dataSnapshot) {
      $activityIndicator.stopAnimating(0);
    });

    var now  = (new Date()).getTime();

    // orderByChild('is_available_on_app').equalTo(true)
    //var query = eventsRef.orderByChild("end").startAt(now, "end");
    var query = eventsRef.orderByChild('is_available_on_app').equalTo(true);
    return $firebaseArray(query);
  }

  // this is for the revealing module pattern - ie the methods included here are public
  return {

    getAll: getAll,
  };
})


.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.service('DZHelpers', ['$q', function($q) {

  return {

    getNativeGeoLink: function(latitude, longitude, isGoogleMap) {
      var deferred = $q.defer();
      
      var isIOS = ionic.Platform.isIOS();
      var isAndroid = ionic.Platform.isAndroid();
      var destination = "";
      var isGoogleMap = isGoogleMap || false;
      console.log('isAndroid', isAndroid);
      navigator.geolocation.getCurrentPosition(function(position){
        console.log('position', position);
        if (isIOS){
          destination = (isGoogleMap)
            ?"comgooglemaps://?daddr=" + latitude +"," + longitude + "&directionsmode=walking"
            :"maps://?ll=" + position.coords.latitude +","+position.coords.longitude+"&daddr=" + latitude +"," + longitude;
        } else if (isAndroid === true)
          destination = "geo:" + position.coords.latitude +"," + position.coords.longitude+"?q=" + latitude +"," + longitude;
        else
          destination = "http://maps.google.com/?ll=" + latitude +"," + longitude;
        deferred.resolve(destination);
      }, function(err){
        if (isIOS){
          destination = (isGoogleMap)
            ?"comgooglemaps://?daddr=" + latitude +"," + longitude + "&directionsmode=walking"
            :"maps://?ll=" + latitude +","+longitude;
        } else if (isAndroid === true)
          destination = "geo:" + "?q=" + latitude +"," + longitude;
        else
          destination = "http://maps.google.com/?ll=" + latitude +"," + longitude;
        deferred.resolve(destination);
      }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
      
      return deferred.promise;
    }
  };
}])

//reusable actionsheet
.service('$shareOptions', function ($log, $ionicActionSheet, $rootScope, $cordovaSocialSharing, $cordovaToast) {
  return {
    show: function (event) {
      var pushText;
      var subscribed;

      console.log("$rootScope.parseSubscriptions", $rootScope.parseSubscriptions);

      // user is subscribed to this event
      if ($rootScope.parseSubscriptions && typeof $rootScope.parseSubscriptions !== "undefined" && $rootScope.parseSubscriptions.indexOf("channel"+event.$id) !== -1) {
        pushText = "Unsubscribe from Event Notifications";
        subscribed = true;
      }
      // user not subscribed
      else {
        pushText = "Subscribe to Event Notifications";
        subscribed = false;
      }

      var buttons = [
        {text: pushText},
        {text: 'Share Event'}
      ];

      $ionicActionSheet.show({
        titleText: null,
        buttons: buttons,
        cancelText: 'Cancel',
        cancel: function() {
        },
        buttonClicked: function(index) {
          console.log('index: ', index);

          switch(index) {

            /**
             * push notifications
             */
            case 0:
              document.addEventListener("deviceready", function(){
                // unsubscribe the user
                if (subscribed) {
                  // make call to parse to unsubscribe
                  var channel = "channel"+event.$id; // channel must start with a letter
                  parsePlugin.unsubscribe(channel, function(msg) {

                    $log.debug("User unsubscribed from channel:", channel);
                    $log.debug("msg:", msg);

                    // update root scope
                    var index = $rootScope.parseSubscriptions.indexOf(channel);
                    if (index > -1) {$rootScope.parseSubscriptions.splice(index, 1);}

                     $cordovaToast.show("Unsubscribed", "short", "bottom").then(function(success) {
                          //console.log("The toast was shown");
                      }, function (error) {
                          console.log("The toast was not shown due to " + error);
                      });

                  }, function(err) {
                    $log.error(err);
                  })

                }
                // subscribe the user
                else {

                  // make call to parse to subscribe
                  var channel = "channel"+event.$id; // channel must start with a letter
                  parsePlugin.subscribe(channel, function() {
                      $log.debug("User subscribed to channel:",channel);

                      // update root scope
                      $rootScope.parseSubscriptions.push(channel);

                      $cordovaToast.show("Subscribed", "short", "bottom").then(function(success) {
                          //console.log("The toast was shown");
                      }, function (error) {
                          console.log("The toast was not shown due to " + error);
                      });

                  }, function(err) {
                    $log.error(err);
                  })

                }                
              });
              break;

            /**
             * facebook share
             */
            case 1:

              var eventDate = new Date(event.start);
              eventDate = eventDate.getDate() + "/" + (eventDate.getMonth()+1) + "/" + eventDate.getFullYear();
              var shareDescription = "I'm going to " + event.name + " on " + eventDate + " via @eventro";
              var shareTitle = event.name;
              var shareAppStoreLink;
              var isAndroid = ionic.Platform.isAndroid();
              
              //check if android device
              if(isAndroid)
              {
                shareAppStoreLink = 'https://play.google.com/store/apps/details?id=com.geteventro.app';
              }
              else
              {
                shareAppStoreLink = 'https://itunes.apple.com/app/eventro/id1034836056';
              }

              $cordovaSocialSharing
                .share(shareDescription, shareTitle, null, shareAppStoreLink) // Share via native share sheet
                .then(function(result) {
                   console.log("Shared successfuly");
                }, function(err) {
                    console.log("Share failed");
                });
              break;
          }
          return true;
        }
      });
    }
  }
})

//This directive will hide or show a directive element depeneding on whether we have connection to a firebase reference
.directive('dzNoConnectionElement', ['$ionicPlatform', function($ionicPlatform) {

  return {

    restrict: 'E',
    scope: {
      //this must be a firebase refrence to a node in the database
      dependency: '='
    },
    templateUrl: 'templates/directives/noConnItem.html',

    link: function(scope, element, attrs) {

      //default to optimist! Once we fail to connect, then we can show the no connection screen. In the meantime, default to connected and let the loading spinner in the screen do all the work
      var isConnectedToDatabase = true;

      scope.dependency.on('value', function(connectedSnap) {

        isConnectedToDatabase = connectedSnap.val();

        if (connectedSnap.val()) {

          //check for window.Conneciton as this will only work on mobile device
          if (window.Connection && navigator.connection.type == Connection.None) {

            isConnectedToDatabase = false;
          }
        }
        //check for window.Conneciton as this will only work on mobile device
        //we got null from firebase but we have interent, therefore an empty database!
        else if (window.Connection && navigator.connection.type != Connection.None) {

          isConnectedToDatabase = true;
        }
      });

      scope.shouldShowNoConnectionElement = function() {

        return !isConnectedToDatabase;
      };
    }
  };
}])

//DOES NOT WORK AS IT CLEARS THE INNER HTML OF AN ELEMENT
//This attribute will create a link that will take a user to a geographical location.
.directive('dzGeoLink', ['DZHelpers', function(DZHelpers) {

  return {

    restrict: 'A',
    scope: {
      latitude: '=',
      longitude: '='
    },
    replace: false,
    template: '<a class="item" href="#" ng-click="openMapURL(latitude, longitude)"></a>',

    link: function(scope, element, attrs) {

      //console.log("Element ", element);
      //console.log("Attrs ", attrs);

      scope.openMapURL = function(lat, lng) {
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
      }
    }
  };
}])

//this directive will accept 2 parameter urls and create 2 buttons that will redirect to either link
.directive('dzItemToggler', [function() {

  return {

    restrict: 'E',

    scope: {
      linka: '@',
      linkb: '@',
      texta: '@',
      textb: '@'
    },
    templateUrl: 'templates/directives/dzMapToggleItem.html'
  };

}])

//This directvive will add a modal view to the top of the view stack, telling the user to get an internet connection because it's the 21st century
.directive('dzNoConnectionModel', ['$interval', '$ionicModal', function($interval, $ionicModal) {

  return {

    restrict: 'E',

    scope: {

      msinterval: '@'
    },

    link: function (inScope, element, attrs) {

      var showNoConnectionModal = false;
      var ourModal;

      //only do the internet connection check on a connection dodgy device such as mobile
      if (window.Connection) {

        console.log("connection support check");
        runIntermittentNetworkCheck();
      }
      else
        console.log("no connection support");

      //called by the modal view to decide whether we should show
      inScope.shouldShow = function() {

        return showNoConnectionModal;
      };

      //this function will schedule a network check every couple of seconds, and toggle the network view as appropiate
      function runIntermittentNetworkCheck() {

        //maybe allow unknown because on the landing screen the device might not have kicked into gear yet?
        var allowedNetworkStates = [Connection.WIFI, Connection.CELL_4G, Connection.CELL_3G, Connection.CELL_2G];

        //this function adds or removes a modal view depending on connection
        function checkNetworkState() {

          if (allowedNetworkStates.indexOf(navigator.connection.type) === -1) {

            //we are now offline
            showNoConnectionModal = true;

            //if we don't have a modal already on screen, display one
            if (ourModal === undefined) {

              $ionicModal.fromTemplateUrl('templates/modals/dzNoConnectionModal.html',
              {
                scope: inScope
              }
              ).then(function(modal) {

                ourModal = modal;
                ourModal.show();
              });
            }
          }
          else if (ourModal !== undefined) {

            showNoConnectionModal = false;

            //remove the modal and make undefined
            ourModal.remove();
            ourModal = undefined;
          }
        }

        //..and then schedule every few seconds
        stop = $interval(checkNetworkState, inScope.msinterval);

        //in case this view gets destroyed but there is still an interval sceduled, avoid a memory leak-esque error
        inScope.$on('$destroy', function() {

          $interval.cancel(stop);
        });
      }
    }
  }
}]);
