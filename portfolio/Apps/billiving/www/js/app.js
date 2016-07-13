angular.module('myApp', [
  'ionic',
  'myApp.constants',
  'myApp.filters',
  'myApp.directives',
  'myApp.services',
  'myApp.controllers'
]).run(function ($ionicPlatform, Utils) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    Utils.initialize();
  });
});