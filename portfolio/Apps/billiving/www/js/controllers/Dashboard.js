angular.module('myApp.controllers')

        .controller('DashboardCtrl', function ($scope, $http, AppConfig, Utils, AuthService, $state) {
          Utils.hideIndicator();
          if (!AuthService.isLoggedIn()) {
            $state.go('app.login');
            return;
          }
        });