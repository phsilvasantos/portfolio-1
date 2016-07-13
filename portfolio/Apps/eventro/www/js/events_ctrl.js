/**
 * EventsCtrl
 */
angular.module('starter.controllers')
.controller('EventsCtrl', function($log, $scope, Events, $ionicScrollDelegate, $location, $state, AppConstants, $rootScope) {
  var TAG = 'EventsCtrl';

  $log.log(TAG);

  var registerParseInstallation = function() {

      parsePlugin.initialize(AppConstants.parseKeys.applicationId, AppConstants.parseKeys.clientKey, function() {

        // get the installationId
        parsePlugin.getInstallationId(function(id) {

          console.log('Parse installationId: ', id);

          // get the current subscriptions
          parsePlugin.getSubscriptions(function(subscriptions) {

            console.log(subscriptions);

            //Android nuance - sends data back as string not array
            if(typeof(subscriptions) == "string")
            {
              subscriptions = subscriptions.replace('[','').replace(']','').replace(' ','');
              if(subscriptions.length == 0)
                subscriptions = [];
              else
                subscriptions = subscriptions.split(",");
            }
            // iOS sends back an array
            else {
              if (subscriptions === null) {
                subscriptions = [];
              }
            }

            // save the subscriptions to root scope (the subscription will be the event ids)
            $rootScope.parseSubscriptions = subscriptions;

            console.log('$rootScope.parseSubscriptions: ', $rootScope.parseSubscriptions);

          }, function(err) {
            $log.error(err);
          });      
        }, function(err) {
            $log.error(err);
        });
      }, function(err) {
          $log.error(err);
      });

  };

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

    document.addEventListener("deviceready", function (){
      registerParseInstallation();
    });

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