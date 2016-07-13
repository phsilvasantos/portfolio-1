'use strict';

angular.module('gnApp', [
    'ionic',
    'gnApp.controllers',
    'gnApp.services',
    'gnApp.filters',
    'gnApp.constants',
    'gnApp.directives',
    'gnApp.messagesModule'
  ])

  .config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|mailto|file|tel):/);
  }])

  .run(function ($rootScope, $ionicPlatform, $templateCache, $state, chatService, Utils, deviceState, appNotificationsCounter) {
    $rootScope.shared = {};

    $rootScope.shared.currentConversationTopic = '';
    $rootScope.shared.currentConversation = '';
    $rootScope.appNotificationsCounter = appNotificationsCounter;
    $rootScope.chatService = chatService;
    $rootScope.shared.groupBadges = {groups: {}, posts: {}, total: 0};
    //$rootScope.shared.groupBadges = {groups: {'E7nDtWA4F0': 23}, posts: {'LINRg9MFvF': 2, 'lT9obNtatb': 10}, total: 23};

    document.addEventListener("resume", deviceState.resume, false);
    document.addEventListener("pause",  deviceState.pause,  false);

    // for groups we should play with Group Section badge counter on pause and resume
    // should ask server and add new value on resume
    document.addEventListener("resume", function() {
      if (Parse.User.current()) {
        Parse.Cloud.run("checkNewPosts", { userId: Parse.User.current().id }).then(function(result) {
          console.log('CHECK NEW POSTS', result);
          for (var key in result.groups) {
            if ($rootScope.shared.groupBadges.groups[key]) {
              $rootScope.shared.groupBadges.groups[key] += result.groups[key];  
            }
            else {
              $rootScope.shared.groupBadges.groups[key] = result.groups[key];
            }
          }

          for (var key in result.posts) {
            if ($rootScope.shared.groupBadges.posts[key]) {
              $rootScope.shared.groupBadges.posts[key] += result.posts[key];
            }
            else {
              $rootScope.shared.groupBadges.posts[key] = result.posts[key];
            }
          }

          $rootScope.shared.groupBadges.total += result.total;
          appNotificationsCounter.increaseCounter(result.total)
        });
      }

    }, false);

    $rootScope.appView = function(stateName) {
      var userId = null;
      if(Parse.User.current()) userId = Parse.User.current().id

      if(window.mixpanel) {
        window.mixpanel.track("Screen View",{ "Screen": stateName });
      }

      if(navigator.analytics) {
        try {
          navigator.analytics.sendAppViewWithParams(stateName, {
            userId: userId
          }, function(){ // success
            console.log('[GA] app view: '+stateName);
          }, function(){ // error
            console.log('[GA] app view FAILED: '+stateName);
          });
        } catch(err) {
          console.log(err.message);
        }
      } else {
        // not ready yet
      }
    };

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $rootScope.appView(toState.name);
    });

    $rootScope.messages = {};

    $rootScope.messages.canDragRight = function(){
      return $state.current.name == 'app.messages-room' && $rootScope.messages.room;
    };


    $rootScope.groupspace = {};
    $rootScope.groupspace.canDragRight = function(){
      return $state.current.name.indexOf('app.group-') === 0;
    };

    $ionicPlatform.ready(function () {
      try {
        $ionicPlatform.fullScreen(true,true);
      } catch(err) {

        // 'undefined is not a function' sometimes happens here
      }
      try {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false); // hide accessory bar by default
      } catch (e) {
      }
    });

    $(document).on('click', '.navbar-logo', function () {
      $state.go('app.feed');
    });

    $rootScope.styleRules = {
      'first name': {
        icon: 'person',
        type: 'text',
        placeholder: 'Enter First Name'
      },
      'last name': {
        icon: 'person',
        type: 'text',
        placeholder: 'Enter Last Name'
      },
      'birthday': {
        icon: 'calendar',
        type: 'date',
        placeholder: 'Enter Birthday'
      },
      'birthdate': {
        icon: 'calendar',
        type: 'date',
        placeholder: 'Enter Birthday'
      },
      'phone': {
        icon: 'ios7-telephone',
        type: 'tel',
        placeholder: 'Enter Phone Number'
      },
      'email': {
        icon: 'email',
        type: 'email',
        placeholder: 'Enter Email'
      },
      'location': {
        icon: 'location',
        type: 'text',
        placeholder: 'Enter Location'
      },
      'website': {
        icon: 'link',
        type: 'url',
        placeholder: 'Enter Website Address'
      },
      'company name': {
        icon: 'briefcase',
        type: 'text',
        placeholder: 'Enter Company Name'
      },
      'title': {
        icon: 'ribbon-b',
        type: 'text',
        placeholder: 'Enter Title'
      },
      'industry': {
        icon: 'cube',
        type: 'text',
        placeholder: 'Enter Industry'
      },
      'facebook': {
        icon: 'facebook',
        square_icon: 'fa-facebook-square',
        type: 'text',
        placeholder: 'Enter Facebook URL'
      },
      'linkedin': {
        icon: 'linkedin',
        square_icon: 'fa-linkedin-square',
        type: 'text',
        placeholder: 'Enter Linkedin URL'
      },
      'twitter': {
        icon: 'twitter',
        square_icon: 'fa-twitter-square',
        type: 'text',
        placeholder: 'Enter Twitter URL'
      },
      'google plus': {
        icon: 'google-plus',
        square_icon: 'fa-google-plus-square',
        type: 'text',
        placeholder: 'Enter Google+ URL'
      }
    };

    $rootScope.getStyleRule = function (fieldKey) {
      return $rootScope.styleRules[fieldKey.toLowerCase()] || {
        icon: 'information-circled',
        type: 'text',
        placeholder: ''
      };
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (typeof(current) !== 'undefined')
        $templateCache.remove(current.templateUrl);
    });

    if (Parse.User.current()) {
      var user = Parse.User.current();
      if (window.testFlight) {
        window.testFlight.addCustomEnvironmentInformation(null, null, 'parseUserID', user.id);
        window.testFlight.addCustomEnvironmentInformation(null, null, 'userName', user.get('name'));
      }
    }
  });
