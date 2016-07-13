// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'nvd3ChartDirectives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.workout-category', {
      url: "/home/:categoryId",
      views: {
        'menuContent' :{
          templateUrl: "templates/category.html",
          controller: 'WorkoutCategoryCtrl'
        }
      }
    })

    .state('app.workout-custom', {
      url: "/custom",
      views: {
        'menuContent' :{
          templateUrl: "templates/custom.html",
          controller: 'WorkoutCustomCtrl'
        }
      }
    })

    .state('app.workout-length', {
      url: "/home/:categoryId/:typeId",
      views: {
        'menuContent' :{
          templateUrl: "templates/time.html",
          controller: 'WorkoutTimeCtrl'
        }
      }
    })

    .state('app.workout', {
      url: "/home/:categoryId/:typeId/:timeId/workout",
      views: {
        'menuContent' :{
          templateUrl: "templates/workout.html",
          controller: 'WorkoutCtrl'
        }
      }
    })

    .state('app.timing', {
      url: "/timing",
      views: {
        'menuContent' :{
          templateUrl: "templates/timing.html",
          controller: 'TimingCtrl'
        }
      }
    })

    .state('app.progress', {
      url: "/progress",
      views: {
        'menuContent' :{
          templateUrl: "templates/progress.html",
          controller: 'ProgressCtrl'
        }
      }
    })

    .state('app.log', {
      url: "/progress/log",
      views: {
        'menuContent' :{
          templateUrl: "templates/logs.html",
          controller: 'LogCtrl'
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })

    .state('app.rewards', {
      url: "/rewards",
      views: {
        'menuContent' :{
          templateUrl: "templates/rewards.html",
          controller: "RewardsCtrl"
        }
      }
    })

    .state('app.reminders', {
      url: "/reminders",
      views: {
        'menuContent' :{
          templateUrl: "templates/reminders.html",
          controller: "RemindersCtrl"
        }
      }
    })

    .state('app.exercises', {
      url: "/exercises",
      views: {
        'menuContent' :{
          templateUrl: "templates/exercises.html",
          controller: "ExerciseListCtrl"
        }
      }
    })   

    .state('app.apps', {
      url: "/apps",
      views: {
        'menuContent' :{
          templateUrl: "templates/apps.html",
          controller: "PartnerAppsCtrl"
        }
      }
    })

    .state('app.nexercise', {
      url: "/nexercise",
      views: {
        'menuContent' :{
          templateUrl: "templates/nexercise.html",
          controller: "NexerciseAppCtrl"
        }
      }
    })

    .state('app.sworkitpro', {
      url: "/sworkitpro",
      views: {
        'menuContent' :{
          templateUrl: "templates/sworkitpro.html",
          controller: "SworkitProAppCtrl"
        }
      }
    })

    .state('app.help', {
      url: "/help",
      views: {
        'menuContent' :{
          templateUrl: "templates/help.html",
          controller: "HelpCtrl"
        }
      }
    });      
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

