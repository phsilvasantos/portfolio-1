angular.module('myApp.controllers', [])

        .controller('AppCtrl', function($scope, AuthService, Utils, $interval) {
          $scope.logOut = function() {
            AuthService.doLogout();
          };
          
        });