// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic','ionic.service.core','ionic.service.analytics',
  'starter.controllers',
  'starter.services',
  'firebase',
  'ngCordova',
  'ngGPlaces',
  'ion-sticky',
  'ngActivityIndicator',
  'ngIOS9UIWebViewPatch',
  'ionic.ion.autoListDivider',
  'angular.filter'
  ])

.run(function($ionicPlatform, $rootScope, $state, $ionicAnalytics) {
  $ionicPlatform.ready(function() {

    //init ionic analytics
    $ionicAnalytics.register();

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
  $rootScope.gotoPage = function(page, params){
      $state.go(page, params);
    };
})

.config(function($stateProvider, $urlRouterProvider, ngGPlacesAPIProvider, $compileProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // Each tab has its own nav history stack:
  .state('events', {
    url: '/events',
    templateUrl: 'templates/events.html',
    controller: 'EventsCtrl'
  })
  .state('event-map', {
    url: '/event-map/:eventId/map',
    templateUrl: 'templates/event-map.html',
    controller: 'EventMapCtrl'
  })
  .state('event-arview', {
    url: '/event-arview/:eventId/arview',
    templateUrl: 'templates/event-arview.html',
    controller: 'EventArviewCtrl'
  })
  .state('event-schedule', {
    url: '/event-schedule/:eventId/schedule',
    templateUrl: 'templates/event-schedule.html',
    controller: 'EventScheduleCtrl'
  })
  .state('event-location', {
    url: '/event-location/:locationId/:locationName#:fragment',
    templateUrl: 'templates/event-location.html',
    controller: 'EventLocationCtrl'
  })
  .state('test', {
    url: '/test',
    templateUrl: 'templates/test.html',
    controller: 'TestCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/events');

  // setup the defaults for Google Places Plugin
  ngGPlacesAPIProvider.setDefaults({

    radius: 2000,
    nearbySearchKeys: ['name', 'reference', 'vicinity', 'icon', 'geometry', ],
  });

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|geo|mailto|tel):/);

  //disable back swipe
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.views.maxCache(0);
});
