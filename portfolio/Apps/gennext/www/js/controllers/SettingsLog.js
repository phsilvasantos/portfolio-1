'use strict';

angular.module('gnApp.controllers')
.controller('SettingsLogController', function ($scope, Utils, HttpUtils, $location) {
  $scope.logMessages = window.Groupfire.logMessages;
});
