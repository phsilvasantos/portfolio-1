// Ionic wpIonic App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'wpIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'wpIonic.controllers' is found in controllers.js, wpIoinc.services is in services.js
var googleanalytics = angular.module('wpIonic', ['ionic', 'ngIOS9UIWebViewPatch', 'wpIonic.controllers','app.directives', 'app.filters', 'wpIonic.services', 'ionic.contrib.drawer', 'ngCordova'])

.run(function($ionicPlatform, $ionicPopup) {
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
    
    if(typeof analytics !== 'undefined') {
                analytics.startTrackerWithId("UA-37069810-6");
            } else {
                console.log("Google Analytics is Unavailable");
            }
        
  });

})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  // sets up our default state, all views are loaded through here
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.intro', {
    url: "/intro",
    views: {
      'menuContent': {
        templateUrl: "templates/intro.html",
        controller: 'IntroCtrl'
      }
    }
  })

  // this is the first sub view, notice menuContent under 'views', which is loaded through menu.html
  .state('app.posts', {
    url: "/posts",
    views: {
      'menuContent': {
        templateUrl: "templates/posts.html",
        controller: 'PostsCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/posts/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
        controller: 'PostCtrl'
      }
    }
  })

  .state('app.custom', {
    url: "/custom",
    views: {
      'menuContent': {
        templateUrl: "templates/custom.html"
      }
    }
  })

.state('app.dogs', {
    url: "/dogs",
    views: {
      'menuContent': {
        templateUrl: "templates/dogs.html",
        controller: 'DogsCtrl'
      }
    }
  })
  
  .state('app.singleDog', {
    url: "/dogs/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/single-dog.html",
        controller: 'SingleDogCtrl'
      }
    }
  })
  
  .state('app.cats', {
    url: "/cats",
    views: {
      'menuContent': {
        templateUrl: "templates/cats.html",
        controller: 'CatsCtrl'
      }
    }
  })
  
  .state('app.singleCat', {
    url: "/cats/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/single-cat.html",
        controller: 'SingleCatCtrl'
      }
    }
  })
  
  .state('app.others', {
    url: "/others",
    views: {
      'menuContent': {
        templateUrl: "templates/others.html",
        controller: 'OthersCtrl'
      }
    }
  })
  
.state('app.singleOther', {
    url: "/others/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/single-other.html",
        controller: 'SingleOthersCtrl'
      }
    }
  })
  
.state('app.news', {
    url: "/news",
    views: {
      'menuContent': {
        templateUrl: "templates/news.html",
        controller: 'PostsCtrl'
      }
    }
  })
  
  .state('app.howToAdopt', {
    url: "/how-to-adopt",
    views: {
      'menuContent': {
        templateUrl: "templates/how-to-adopt.html",
        controller: 'HowToAdoptCtrl'
      }
    }
  })
  
  .state('app.aboutUs', {
    url: "/about-us",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
        controller: 'AboutUsCtrl'
      }
    }
  })
  
  .state('app.tabs', {
    url: "/tabs",
    views: {
      'menuContent': {
        templateUrl: "templates/tabs.html",
        controller: 'TabsCtrl'
      }
    }
  })

  .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/intro');
});
