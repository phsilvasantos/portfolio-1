'use strict';

angular.module('gnApp', [
    'ionic',
    'gnApp.controllers',
    'gnApp.services',
    'gnApp.filters',
    'gnApp.constants',
    'gnApp.directives',
    'gnApp.messagesModule',
    'gnApp.filesUploadingModule'
  ])

  .config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms|mailto|file|tel):/);
  }])

  .run(function ($rootScope, $ionicPlatform, $templateCache, $state, $stateParams, chatService, Utils, deviceState, appNotificationsCounter, remoteFile) {
    $rootScope.shared = {};

    $rootScope.shared.currentConversationTopic = '';
    $rootScope.shared.currentConversation = '';
    $rootScope.appNotificationsCounter = appNotificationsCounter;
    $rootScope.chatService = chatService;
    $rootScope.shared.groupBadges = {groups: {}, posts: {}, total: 0};
    //$rootScope.shared.groupBadges = {groups: {'E7nDtWA4F0': 23}, posts: {'LINRg9MFvF': 2, 'lT9obNtatb': 10}, total: 23};

    $rootScope.registerLoginAttempt = function(username, reason) {
      var platform = window.device ? device.platform : "Unknown";
      var version  = window.applicationConfiguration.appVersion;

      Parse.Cloud.run('registerLoginAttempt', {username: username, platform: platform, version: version, reason: reason})
    }

    $rootScope.isCurrentUser = function(user) {
      return Parse.User.current() && Parse.User.current().id == user.id
    };

    $rootScope.isChatAvailableForUser = function(user) {
      return $rootScope.chatEnabled && !_.isUndefined(user.get) && user.get('supportChat');
    };

    $rootScope.getFileTypeClass = function (item) {
      return remoteFile.getFileTypeClass(item);
    };

    $rootScope.openFile = function (f) {
      var file = f.file;
      if (remoteFile.isPicture(file)) {
        $rootScope.photoModalService.viewPhoto([file.fullviewItem], 0);
        return;
      }
      remoteFile.open(correctExternalURL(file.get('fileUrl') || file.get('file').url()));
    };

    $rootScope.isPicture = function (file) {
      return remoteFile.isPicture(file);
    };

    appStateManager.onResume(deviceState.resume);
    appStateManager.onPause(deviceState.pause);


    pushNotifications.registerSilentEvent('groupPostCreated', this,
      function(notificationData) {
        return $state.current.name != 'app.group-feed' || $stateParams.groupId != notificationData.silent.groupId;
      },
      function(notificationData) {
        var groupId = notificationData.silent.groupId;

        if ($rootScope.shared.groupBadges.groups[groupId]) {
          $rootScope.shared.groupBadges.groups[groupId] += 1;
        }
        else {
          $rootScope.shared.groupBadges.groups[groupId] = 1;
        }

        $rootScope.shared.groupBadges.total += 1;
        $rootScope.$apply(function() {
          appNotificationsCounter.increaseCounter(1);
        })
      }
    )

    pushNotifications.registerSilentEvent('groupPostCommented', this,
      function(notificationData) {
        return $state.current.name != 'app.group-feed-detail' || $stateParams.postId != notificationData.silent.postId;
      },
      function(notificationData) {
        console.log('groupPostCommented', notificationData);

        var groupId = notificationData.silent.groupId;
        var postId = notificationData.silent.groupId;

        if ($rootScope.shared.groupBadges.groups[groupId]) {
          $rootScope.shared.groupBadges.groups[groupId] += 1;
        }
        else {
          $rootScope.shared.groupBadges.groups[groupId] = 1;
        }

        if ($rootScope.shared.groupBadges.posts[postId]) {
          $rootScope.shared.groupBadges.posts[postId] += 1;
        }
        else {
          $rootScope.shared.groupBadges.posts[postId] = 1;
        }

        $rootScope.shared.groupBadges.total += 1;
        $rootScope.$apply(function() {
          appNotificationsCounter.increaseCounter(1);
        })
      }
    )

    $rootScope.appView = function(stateName) {
      var userId = null;
      if(Parse.User.current()) userId = Parse.User.current().id

      Utils.trackMixPanel("Screen View",{ "Screen": stateName });

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
        ionic.Platform.isFullScreen = true
      } catch(err) {

        // 'undefined is not a function' sometimes happens here
      }
      try {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true); // hide accessory bar by default
        cordova.plugins.Keyboard.disableScroll(false); // enable content push up.
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
        icon: 'ios-telephone',
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
