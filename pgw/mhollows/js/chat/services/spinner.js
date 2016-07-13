'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatSpinner', function($ionicLoading, $timeout) {
  var r = {};

  this.spinner = true;

  r.showSpinner = function() {
    console.log('SHOW SPINNER');
    this.spinner = true;
    $ionicLoading.show({
      template: '<span class="preloader preloader-white"></span>'
    });
  };

  r.hideSpinner = function() {
    console.log('HIDE SPINNER');
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
