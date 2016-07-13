'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedMoreController', function ($scope, $stateParams, Utils, $ionicPopover, $state, $ionicSideMenuDelegate) {
          $scope.groupId = $stateParams.groupId;
          $scope.group = new (Parse.Object.extend('Group'))();
          $scope.group.id = $scope.groupId;
          $scope.notificationSettings = {
            periodInMins: 0,
            mute: false
          };

          $scope.periods = [
            {mins: 15, label: '15 minutes'},
            {mins: 60, label: '1 hours'},
            {mins: 480, label: '8 hours'},
            {mins: 1440, label: '24 hours'},
            {mins: 0, label: 'Until I turn it back on'}
          ];

          $scope.getGroup = function () {
            var query = new Parse.Query(Parse.Object.extend('Group'));
            query.get($scope.groupId).then(function (group) {
              $scope.$apply(function () {
                $scope.group = group;
              });
            });
          };

          $scope.openRightSidebar = function () {
            $ionicSideMenuDelegate.toggleRight();
          };

          $scope.loadNotificationSettings = function () {
            var query = new Parse.Query(Parse.Object.extend('GroupMember'));
            query.limit(-1);
            query.equalTo('group', $scope.group);
            query.equalTo('user', Parse.User.current());
            //query.ascending($scope.filterBy);
            Utils.showIndicator();
            query.find().then(function (groupMembers) {
              Utils.hideIndicator();
              $scope.$apply(function () {
                var periodMins = 0;
                if (groupMembers.length > 0) {
                  $scope.notificationSettings.mute = groupMembers[0].get('mute');
                  periodMins = groupMembers[0].get('muteForMins') || 0;
                  $scope.onSelectNotificationsPeriod($scope.periods[0]);
                }
                var filtered = $scope.periods.filter(function (item) {
                  return item.mins == periodMins;
                });
                if (filtered.length === 0) {
                  $scope.onSelectNotificationsPeriod({mins: periodMins, label: periodMins + ' minutes'});
                } else {
                  $scope.onSelectNotificationsPeriod(filtered[0]);
                }
              });
            });
          };

          $scope.done = function () {
            $state.go('app.group-feed', {groupId: $scope.groupId});
          };

          $scope.saveNotificationSettings = function (callback) {
            Utils.showIndicator();
            var c = function () {
              Utils.hideIndicator();
              if (callback) {
                callback();
              }
            };
            if ($scope.notificationSettings.mute) {
              Parse.Cloud.run('muteGroupFeedNotifications', {
                groupId: $scope.groupId,
                muteForMins: $scope.notificationSettings.periodInMins
              }, c);
            } else {
              Parse.Cloud.run('unmuteGroupFeedNotifications', {
                groupId: $scope.groupId
              }, c);
            }
          };

          /** == period dropdown menu == */
          $scope.notificationsPeriodPopover = null;
          $ionicPopover.fromTemplateUrl('notifications-period-popover', {
            scope: $scope
          }).then(function (popover) {
            $scope.notificationsPeriodPopover = popover;
          });

          $scope.$on('$destroy', function () {
            $scope.notificationsPeriodPopover.remove();
          });

          $scope.onSelectNotificationsPeriod = function (item) {
            jQuery('#notifications_period_label').text(item.label);
            $scope.notificationSettings.periodInMins = item.mins;
            $scope.notificationsPeriodPopover.hide();
            $scope.saveNotificationSettings();
          };

          $scope.getGroup();
          $scope.loadNotificationSettings();
        });
