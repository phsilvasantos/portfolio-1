angular.module('myApp.controllers', []).controller('AppCtrl', function ($scope, $ionicModal, $window, $rootScope, $location) {

  $rootScope.openUploadCategories = function (imgStr) {
    $rootScope.takenCardPhoto = imgStr;
    $location.path('/upload-categories');
  };

  $rootScope.goBack = function () {
    $window.history.back();
  };
});