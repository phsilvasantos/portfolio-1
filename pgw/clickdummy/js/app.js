angular.module('myApp', ['ionic', 'ionic.contrib.ui.tinderCards', 'myApp.controllers', 'myApp.filters', 'myApp.services', 'myApp.directives'])

.run(function($ionicPlatform, $ionicConfig) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  $ionicConfig.views.swipeBackEnabled(false);
});
