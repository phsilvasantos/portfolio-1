// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'controllers','services','ngCookies','ngCordova'])

.run(function($ionicPlatform,$ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
        StatusBar.styleDefault();
    }
    if(typeof analytics !== "undefined") {
        analytics.startTrackerWithId("UA-7185940-2");
    } else {
        console.log("Google Analytics Unavailable");
    }
    // if (!window.cordova) {
    //   facebookConnectPlugin.browserInit("1477616479148318");
    //   // version is optional. It refers to the version of API you may want to use.
    // }
    // facebookConnectPlugin.browserInit("1477616479148318");
  });


})

.run(function( $http, $cookies ){

    // For CSRF token compatibility with Django
    $http.defaults.headers.post['X-CSRFToken'] = $cookies['_xsrf'];
})

.config(function($httpProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
})

.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
})

.config(function($stateProvider, $urlRouterProvider) {
    var checkLoggedIn = function($q, $state, $http, $rootScope) {
        var deferred = $q.defer();
        //var user = null;
        var d = false;
        if(window.localStorage['gmailLogin']=="true"){
            deferred.resolve();
            d = true;
        }
        else {
            deferred.reject();
            d = false;
            $state.go('app');
        }
        return deferred.promise;
        //return d;
    };
    $stateProvider

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'TestCtrl'
    })
    .state('intro', {
      url: "/intro",
      templateUrl: "templates/intro.html",
      controller: 'IntroCtrl'
    })
    .state('advert', {
      url: "/advert",
      templateUrl: "templates/advert.html",
      controller: 'AdvertCtrl'
    })
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.detail', {
      url: "/detail/:assetId",
      views: {
        'menuContent' :{
          templateUrl: "templates/detail.html",
          controller: 'DetailCtrl'
        }
      }
    })
    .state('app.notice', {
      url: "/notice/:noticeId",
      views: {
        'menuContent' :{
          templateUrl: "templates/notice.html",
          controller: 'NoticeCtrl'
        }
      }
    })
    .state('app.shareddetail', {
      url: "/shareddetail/:sharedId",
      views: {
        'menuContent' :{
          templateUrl: "templates/shareddetail.html",
          controller: 'SharedDetailCtrl'
        }
      }
    })
    .state('app.viewers', {
      url: "/viewers/:assetId",
      views: {
        'menuContent' :{
          templateUrl: "templates/viewers.html",
          controller: 'ViewerCtrl'
        }
      }
    })
    .state('app.useradmin', {
      url: "/useradmin",
      views: {
        'menuContent' :{
          templateUrl: "templates/useradmin.html",
          controller: 'UserAdminCtrl'
        }
      }
    })
    .state('app.orgedit', {
      url: "/orgedit/:orgId",
      views: {
        'menuContent' :{
          templateUrl: "templates/orgedit.html",
          controller: 'OrgEditCtrl'
        }
      }
    })
    .state('app.assetedit', {
      url: "/assetedit/:assetId",
      views: {
        'menuContent' :{
          templateUrl: "templates/assetedit.html",
          controller: 'AssetEditCtrl'
        }
      }
    })
    .state('app.message', {
      url: "/message/:assetId",
      views: {
        'menuContent' :{
          templateUrl: "templates/message.html",
          controller: 'MessageCtrl'
        }
      }
    })
    .state('app.messagelist', {
      url: "/message",
      views: {
        'menuContent' :{
          templateUrl: "templates/message_list.html",
          controller: 'MessageListCtrl'
        }
      }
    })
    .state('app.messageView', {
      url: "/message/view/:messageId",
      views: {
        'menuContent' :{
          templateUrl: "templates/message_view.html",
          controller: 'MessageViewCtrl'
        }
      }
    })
    .state('app.publicmessage', {
      url: "/publicmessage",
      views: {
        'menuContent' :{
          templateUrl: "templates/public_message.html",
          controller: 'PublicMessageCtrl'
        }
      }
    })
    .state('app.invitation', {
      url: "/invitation",
      views: {
        'menuContent' :{
          templateUrl: "templates/invitation.html",
          controller: 'InvitationCtrl'
        }
      }
    })
    .state('app.shares', {
      url: "/shares",
      views: {
        'menuContent' :{
          templateUrl: "templates/share.html",
          controller: 'ShareCtrl'
        }
      }
    })
    .state('app.sharedetail', {
      url: "/sharedetail/:assetId",
      views: {
        'menuContent' :{
          templateUrl: "templates/detail.html",
          controller: 'DetailCtrl'
        }
      }
    })
    .state('app.traffic', {
      url: "/traffic",
      views: {
        'menuContent' :{
          templateUrl: "templates/traffic.html",
          controller: 'TrafficCtrl'
        }
      }
    })
    .state('app.fb', {
      url: "/facebook",
      views: {
        'menuContent' :{
          templateUrl: "templates/facebook_connect.html",
          controller: 'FacebookCtrl'
        }
      }
    })
    .state('app.event', {
      url: "/event",
      views: {
        'menuContent' :{
          templateUrl: "templates/event.html",
          controller: 'EventCtrl'
        }
      }
    })
    .state('app.subscription', {
      url: "/subscription",
      views: {
        'menuContent' :{
          templateUrl: "templates/subscription.html",
          controller: 'SubscriptionCtrl'
        }
      }
    })
    .state('app.subscribe', {
      url: "/subscription/:assetId",
      views: {
        'menuContent' :{
          templateUrl: "templates/subscribe_asset.html",
          controller: 'SubscribeAssetCtrl'
        }
      }
    })
    .state('app.notifications', {
      url: "/notifications",
      views: {
        'menuContent' :{
          templateUrl: "templates/notifications.html",
          controller: 'NotificationCtrl'
        }
      }
    })
    .state('app.order', {
      url: "/order",
      views: {
        'menuContent' :{
          templateUrl: "templates/order.html",
          controller: 'OrderCtrl'
        }
      }
    })
    .state('app.setup', {
      url: "/setup",
      views: {
        'menuContent' :{
          templateUrl: "templates/setup.html",
          controller: 'SetupCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});


