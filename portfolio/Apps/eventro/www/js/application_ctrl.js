/**
 * General Controller for whole app
 */
angular.module('starter.controllers')
.controller('ApplicationCtrl', function($scope, $location, $rootScope, AppConstants,$cordovaNetwork, $state) {

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
    });
    
  });
})