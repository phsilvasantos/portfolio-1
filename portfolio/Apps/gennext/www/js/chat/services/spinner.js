'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatSpinner', function($ionicLoading, $timeout) {
  var r = {};

  this.spinner = true;

  r.showSpinner = function() {
    this.spinner = true;
    $ionicLoading.show({
      template: '<span class="preloader preloader-white"></span>'
    });
  };

  r.hideSpinner = function() {
    window.iL = $ionicLoading;
    var self = this;
    $timeout(function() {
      self.spinner = false;
      $ionicLoading.hide();
    }, 1500);
  };

  r.getSpinnerState = function() {
    return this.spinner;
  };

  return r;
});