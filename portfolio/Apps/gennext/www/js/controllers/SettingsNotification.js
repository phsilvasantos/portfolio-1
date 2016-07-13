'use strict';

angular.module('gnApp.controllers')
  .controller('SettingsNotificationController', function ($scope, Utils, HttpUtils, $location) {

    var dataKey = '__notification_settings';

    $scope.getSettings = function () {
      var data = {};
      if (localStorage[dataKey]) {
        data = JSON.parse(localStorage[dataKey]);
      }
      return data;
    };

    $scope.saveSettings = function (data) {
      data = jQuery.extend($scope.getSettings(), data);
      localStorage[dataKey] = JSON.stringify(data);
      return data;
    };

    $scope.data = $scope.getSettings();
    
    $scope.$watch('data', function(n){
      if(n){
        $scope.saveSettings($scope.data);
      }
    }, true);

  });