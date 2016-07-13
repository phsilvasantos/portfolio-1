'use strict';

angular.module('gnApp.controllers')
        .controller('GroupsController', function ($scope, Utils, $ionicPopover, $timeout, $location) {
          $scope.groupTypes = [];
          $scope.groups = [];
          $scope.model = {};
          $scope.model.selectedCategory = "";
          $scope.listType = 'joined';


          var chapterTypeName = 'chapter';

          try {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false); // show accessory bar by default
          } catch (e) {
          }

          var Group = Parse.Object.extend('Group');
          var GroupType = Parse.Object.extend('GroupType');
          var GroupMember = Parse.Object.extend('GroupMember');

          $scope.$watch('model.selectedCategory', function (newV, oldV) {
            if (newV !== oldV) {
              $scope.loadGroups();
            }
          });

          $scope.selectListType = function (type) {
            $scope.listType = type;
            $scope.loadGroups();
          };

          $scope.loadGroupTypes = function (callback) {
            Utils.showIndicator();
            var groupQuery = new Parse.Query(Group);
            groupQuery.equalTo('parent', null);
            groupQuery.find().then(function (groups) {
              var uniqueGroupTypes = [];
              $(groups).each(function () {
                if ($.inArray(this.get('type').id, uniqueGroupTypes) === -1) {
                  uniqueGroupTypes.push(this.get('type').id);
                }
              });
              var query = new Parse.Query(GroupType);
              query.containedIn('objectId', uniqueGroupTypes);
              query.notEqualTo('name', chapterTypeName);
              query.find().then(function (groupTypes) {
                Utils.hideIndicator();
                $scope.$apply(function () {
                  $scope.groupTypes = groupTypes;
                  if (callback)
                    callback();
                });
              });
            });
          };

          $scope.badgeCounter = function (group) {
            if ($scope.shared.groupBadges.groups && $scope.shared.groupBadges.groups[group.id])
              return $scope.shared.groupBadges.groups[group.id];
            else
              return null;
          };

          $scope.loadGroups = function () {
            Utils.showIndicator();
            var groupTypeId = $scope.model.selectedCategory ? $scope.model.selectedCategory.id : 'all';
            if ($scope.listType === 'joinable') {
              $scope.getGroups({filter: 'pending', groupTypeId: groupTypeId}, function (pendingGroups) {
                pendingGroups.forEach(function (group) { //prepend pending groups
                  group.set('status', 'pending');
                });
                $scope.getGroups({filter: $scope.listType, groupTypeId: groupTypeId}, function (groups) {
                  groups = pendingGroups.concat(groups);
                  $scope.$apply(function () {
                    $scope.groups = groups;
                  });
                  Utils.hideIndicator();
                });
              });
            } else {
              $scope.getGroups({filter: $scope.listType, groupTypeId: groupTypeId}, function (groups) {
                $scope.$apply(function () {
                  $scope.groups = groups;
                });
                Utils.hideIndicator();
              });
            }
          };

          $scope.getGroups = function (options, callback) {
            Parse.Cloud.run('listGroups', options, function (groups) {
              callback(groups);
            });
          };

          $scope.joinGroup = function (group) {
            Utils.confirm('Are you sure to join into &lt;' + group.get('name') + '&gt;?', null, function () {
              Utils.showIndicator();
              Parse.Cloud.run('joinGroup', {
                groupId: group.id
              }, function (response) {
                if (response) { //if returned object is instance of GroupMember
                  $scope.$apply(function () {
                    if (response.get('group').get('joinability') === 'free_join') {
                      $scope.gotoGroupDetail(group);
                    } else {
                      group.set('status', 'pending');
                      Utils.hideIndicator();
                    }
                  });
                } else {
                  Utils.alert('You can join into this group only by admin.');
                  Utils.hideIndicator();
                }
              });
            });
          };

          /** == filters menu == */
          $scope.typePopover = null;
          $ionicPopover.fromTemplateUrl('grouptypes-popover', {
            scope: $scope
          }).then(function (popover) {
            $scope.typePopover = popover;
          });

          $scope.$on('$destroy', function () {
            $scope.typePopover.remove();
          });

          $scope.onSelectGroupType = function (type, e) {
            jQuery('#selected_typename').text(jQuery(e.toElement).text());
            $scope.model.selectedCategory = type;
            $scope.typePopover.hide();
          };

          $scope.pluralize = function (str, cnt) {
            return pluralize(str, cnt);
          };

          $scope.capitalize = function (string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
          };

          $scope.gotoGroupDetail = function (group) {
            if(!group.get('hasGroupFeed')){
              $location.path('/members/' + group.id);
              return;
            }
            Utils.showIndicator();
            Parse.Cloud.run('checkGroupVisibility', {groupId: group.id}).then(function (response) {
              $scope.$apply(function () {
                if (response) {
                  $location.path('/group-feed/' + group.id);
                } else {
                  $location.path('/members/' + group.id);
                }
              });
            });
          };

          $scope.loadGroupTypes();

          var query = new Parse.Query(GroupType);
          query.equalTo('name', chapterTypeName);
          query.find().then(function (groupTypes) {
            if (groupTypes.length > 0) {
              $scope.chapterType = groupTypes[0];
            } else {
              $scope.chapterType = null;
            }
            $scope.loadGroups(null);
          });
        });
