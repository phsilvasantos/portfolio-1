'use strict';

angular.module('gnApp.controllers')
  .controller('SettingsController', function ($scope, Utils, HttpUtils, $location, $ionicSideMenuDelegate, AppConfig) {

    $scope.checkVersion = function () {
      Utils.showIndicator();
      window.checkLatestVersion(true);
      $scope.versionIsOutOfDate = window.versionIsOutOfDate;
      Utils.hideIndicator();
    };


    $scope.applyAppConfig = function () {
      AppConfig.config().then(function (config) {
        $scope.$apply(function () {
          $scope.appConfig = config;
          $scope.helpURL = 'http://' + config.get('groupfireId') + '.admin.groupfire.com/help?user_id=' + (Parse.User.current() ? Parse.User.current().id : '');
          $scope.changeLogURL = config.get('changelogURL');
          $scope.aboutThisAppURL = config.get('aboutThisAppURL');
          $scope.downloadURL = 'http://' + config.get('groupfireId') + '.admin.groupfire.com/download';
        });
      });
    };

    $scope.applyAppConfig();
  })
  .controller('SettingsChatNotificationsController', function($state, $ionicLoading, $timeout){
    var defaultChecked = 0;
    var pushChatSettingName = "chatPushNotifications";
    var mailChatSettingName = "chatMailNotifications";
    var self = this;

    var settings = Parse.User.current().get('notificationSettings');

    this.pushChecked = null;
    this.mailChecked = null;

    if (settings) {
      console.log('SETTINGS PRESENTS');
      settings.fetch().then(function(record) {
        console.log(record.attributes);
        self.pushChecked = record.get(pushChatSettingName) === null || record.get(pushChatSettingName) === undefined ? defaultChecked : record.get(pushChatSettingName);
        self.mailChecked = record.get(mailChatSettingName) === null || record.get(mailChatSettingName) === undefined ? defaultChecked : record.get(mailChatSettingName);
      })
    }
    else {
      console.log('defaultChecked');
      this.pushChecked = defaultChecked;
      this.mailChecked = defaultChecked;
    }

    /** Chat notifications settings model
    */

    this.settings = {
      push: {
        options: {
          0: "All messages",
          1: "All direct and @mentions",
          2: "All direct",
          3: "None"
        },
        groupName: "push",
        checked: this.pushChecked === null ? defaultChecked : this.pushChecked,
      },
      mail: {
        options: {
          0: "Once every 15 minute",
          1: "Once every hour",
          2: "Never"
        },
        groupName: "mail",
        checked: this.mailChecked == null ? defaultChecked : this.mailChecked
      }
    };

    console.log('ChatPushNotificationsSettings', this.settings);

    /** Validate and save setted data by user
    */

    this.saveOptions = function(){
      $ionicLoading.show({
        template: '<span class="preloader preloader-white"></span>'
      });

      this.pushChecked = parseInt(this.pushChecked);
      this.mailChecked = parseInt(this.mailChecked);

      var pushOptionsCount = Object.keys(this.settings.push.options).length;
      var mailOptionsCount = Object.keys(this.settings.mail.options).length;

      if(this.pushChecked === null || this.pushChecked === undefined){
        this.pushChecked = defaultChecked;
      }
      if(!this.mailChecked === null || this.mailChecked === undefined){
        this.mailChecked = defaultChecked;
      }

      if(this.pushChecked < pushOptionsCount && this.mailChecked < mailOptionsCount){
         this.saveOptionsToParse(this.pushChecked, this.mailChecked);
      }
      else{
        this.finishSave("Are you trying to hack me?");
        return;
      }
    };

    /** Save validated data to parse
    *
    *   @variable {Number} pushChecked
    *   @variable {Number} mailChecked
    */

    this.saveOptionsToParse = function(pushChecked, mailChecked) {
      var user = Parse.User.current();
      var self = this;

      var settings = Parse.User.current().get('notificationSettings');

      if (settings) {
        settings.fetch().then(function(record) {
          record.set(pushChatSettingName, self.pushChecked);
          record.set(mailChatSettingName, self.mailChecked);
          record.save().then(function(){
            self.finishSave("Chat settings were successfully saved.");
          })
        })
      }
      else {
        var NotificationsSettings = Parse.Object.extend("NotificationsSettings");
        var record = new NotificationsSettings();

        record.set(pushChatSettingName, self.pushChecked);
        record.set(mailChatSettingName, self.mailChecked);
        record.save().then(function(){
          var user = Parse.User.current();
          user.set('notificationSettings', record);

          user.save().then(function (user){
            self.finishSave("Chat settings were successfully saved.");
          }, function(error){
            console.log('Error: %s', error);
          });
        })

      }
    };

    /** After data was saved removes spinner, moves user to the /settings and shows toasty
    *
    *   @variable {String} message
    */

    this.finishSave = function(message){
      $ionicLoading.hide({
        template: '<span class="preloader preloader-white"></span>'
      });
      $state.go('app.settings');
      $timeout(function(){
        if (window.plugins.toast)
          window.plugins.toast.showShortTop(message);
        else
          alert(message);
      }, 500);
    }
  })



  .controller('SettingsGroupNotificationsController', function($state, $ionicLoading, $timeout){
    var defaultChecked = 0;
    var mailDefaultChecked = 2;
    var pushGroupSettingName = "groupPushNotifications";
    var mailGroupSettingName = "groupMailNotifications";
    var self = this;

    var settings = Parse.User.current().get('notificationSettings');

    this.pushChecked = null;
    this.mailChecked = null;

    if (settings) {
      settings.fetch().then(function(record) {
        self.pushChecked = record.get(pushGroupSettingName) === null || record.get(pushGroupSettingName) === undefined ? defaultChecked : record.get(pushGroupSettingName);
        self.mailChecked = record.get(mailGroupSettingName) === null || record.get(mailGroupSettingName) === undefined ? mailDefaultChecked : record.get(mailGroupSettingName);
      })
    }
    else {
      this.pushChecked = defaultChecked;
      this.mailChecked = mailDefaultChecked;
    }

    /** Chat notifications settings model
    */

    this.settings = {
      push: {
        options: {
          0: "All posts and activity",
          1: "Only when my posts are commented on",
          2: 'Receive push notifications only for @mentions',
          3: "Never"
        },
        groupName: "push",
        checked: this.pushChecked === null ? defaultChecked : this.pushChecked,
      },
      mail: {
        options: {
          0: "Once every 15 minute",
          1: "Once every hour",
          2: "Daily", // Daily is a default value
          3: "Never"
        },
        groupName: "mail",
        checked: this.mailChecked === null ? mailDefaultChecked : this.mailChecked
      }
    };

    /** Validate and save setted data by user
    */

    this.saveOptions = function(){
      $ionicLoading.show({
        template: '<span class="preloader preloader-white"></span>'
      });

      this.pushChecked = parseInt(this.pushChecked);
      this.mailChecked = parseInt(this.mailChecked);

      var pushOptionsCount = Object.keys(this.settings.push.options).length;
      var mailOptionsCount = Object.keys(this.settings.mail.options).length;

      if(!this.pushChecked === null || this.pushChecked === undefined){
        this.pushChecked = defaultChecked;
      }
      if(!this.mailChecked === null || this.mailChecked === undefined){
        this.mailChecked = mailDefaultChecked;
      }

      if(this.pushChecked < pushOptionsCount && this.mailChecked < mailOptionsCount){
         console.log(this.pushChecked, this.mailChecked);

         this.saveOptionsToParse(this.pushChecked, this.mailChecked);
      }
      else{
        this.finishSave("Are you trying to hack me?");
        return;
      }
    };

    /** Save validated data to parse
    *
    *   @variable {Number} pushChecked
    *   @variable {Number} mailChecked
    */

    this.saveOptionsToParse = function(pushChecked, mailChecked) {
      var user = Parse.User.current();
      var self = this;

      var settings = Parse.User.current().get('notificationSettings');

      if (settings) {
        settings.fetch().then(function(record) {
          record.set(pushGroupSettingName, self.pushChecked);
          record.set(mailGroupSettingName, self.mailChecked);
          record.save().then(function(){
            self.finishSave("Group settings were successfully saved.");
          })
        })
      }
      else {
        var NotificationsSettings = Parse.Object.extend("NotificationsSettings");
        var record = new NotificationsSettings();

        record.set(pushGroupSettingName, self.pushChecked);
        record.set(mailGroupSettingName, self.mailChecked);
        record.save().then(function(){
          var user = Parse.User.current();
          user.set('notificationSettings', record);

          user.save().then(function (user){
            self.finishSave("Group settings were successfully saved.");
          }, function(error){
            console.log('Error: %s', error);
          });
        })

      }
    };

    /** After data was saved removes spinner, moves user to the /settings and shows toasty
    *
    *   @variable {String} message
    */

    this.finishSave = function(message){
      $ionicLoading.hide({
        template: '<span class="preloader preloader-white"></span>'
      });
      $state.go('app.settings');
      $timeout(function(){
        if (window.plugins.toast)
          window.plugins.toast.showShortTop(message);
        else
          alert(message);
      }, 500);
    }
  })
