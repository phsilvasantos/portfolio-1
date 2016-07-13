'use strict';

angular.module('gnApp.controllers')
  .controller('EventPhotoCommentsController', function ($scope, EventUtils, Utils, $location, $stateParams, $timeout) {
    $scope.photoId = $stateParams.photoId;
  });