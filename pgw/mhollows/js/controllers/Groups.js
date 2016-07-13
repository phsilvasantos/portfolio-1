'use strict';

angular.module('gnApp.controllers')
        .controller('GroupsController', function ($scope, $rootScope, Utils, $ionicPopover, $timeout, $location) {
          $scope.groupTypes = [];
          $scope.groups = [];
          $scope.joinedGroups = [];
          $scope.model = {};
          $scope.model.selectedCategory = "";
          $scope.listType = 'joined';
          $scope.selectedCategory = "All Types";

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
            var query = new Parse.Query(GroupType);
            query.greaterThan('groupCount', 0);
            query.find().then(function (groupTypes) {
              $scope.$apply(function () {
                $scope.groupTypes = groupTypes;
                if (callback)
                  callback();
              });
            });
          };

          $scope.badgeCounter = function (group) {
            if ($scope.shared.groupBadges.groups && $scope.shared.groupBadges.groups[group.id])
              return $scope.shared.groupBadges.groups[group.id];
            else
              return null;
          };
//          $('.header-item').css({left:'0px', right:'0px', fontSize:15 + 'px'});
          $scope.loadGroups = function (showIndicator) {
            if (showIndicator !== false) {
              Utils.showIndicator();
            }
            $scope.groups = [];
            var groupTypeId = $scope.model.selectedCategory ? $scope.model.selectedCategory.id : 'all';
            if ($scope.listType === 'joinable') {
              $scope.getGroups({filter: 'pending', groupTypeId: groupTypeId}, function (pendingGroups) {
                
                pendingGroups.forEach(function (group) { //prepend pending groups
                  group.set('status', 'pending');
                });
                $scope.getGroups({filter: $scope.listType, groupTypeId: groupTypeId}, function (groups) {
                  groups = pendingGroups.concat(groups);
                  var groupIds = [];
                  for (var i = 0; i < $scope.joinedGroups.length; i++) {
                    groupIds[i] = $scope.joinedGroups[i].id;
                  }
                  
                  for (var i = 0; i < groups.length; i++) {
                    if (groups[i].get('parent')) {
                      if (groupIds.indexOf(groups[i].get('parent').id) >= 0){
                        $scope.$apply(function () {
                          $scope.groups.push(groups[i]);
                        });
                      }
                    } else {
                      $scope.$apply(function () {
                        $scope.groups.push(groups[i]);
                      });
                    }
                  }
                  if (showIndicator !== false) {
                    Utils.hideIndicator();
                  }
                });
              });
            } else {
              $scope.getGroups({filter: $scope.listType, groupTypeId: groupTypeId}, function (groups) {
                $scope.$apply(function () {
                  $scope.groups = groups;
                  $scope.joinedGroups = groups;
                });
                if (showIndicator !== false) {
                  Utils.hideIndicator();
                }
              });
            }
          };

          $scope.getGroups = function (options, callback) {
            Parse.Cloud.run('listGroups', options, function (groups) {
              callback(groups);
            });
          };

          $scope.checkGroupJoinable = function (index, callback) {
            if ($scope.groups[index].get('parent')) {
              Utils.showIndicator();
              console.log('parent', $scope.groups[index].get('parent'));
              var query = new Parse.Query(Parse.Object.extend('GroupMember'));
              query.limit(-1);
              query.equalTo('group', $scope.groups[index].get('parent'));
              query.equalTo('user', Parse.User.current());
              //query.ascending($scope.filterBy);
              query.find().then(function (groupMembers) {
                if (groupMembers.length) {
                  callback(true);
                } else {
                  for (var i = 0; i < $scope.groups.length; i++) {
                    if ($scope.groups[index].get('parent').id == $scope.groups[i].id) {
                      console.log($scope.groups[i].get('name'), $scope.groups[i].id);
                      Utils.hideIndicator();
                      callback(false, $scope.groups[i].get('name'));
                    }
                  }
                }
              });
            } else {
              callback(true);
            }
          };

          $scope.joinGroup = function (group, index) {
            $scope.checkGroupJoinable(index, function (result, groupname) {
              if (!result) {
                Utils.alert('You can\'t join to this group because is a child group of &lt;' + groupname + '&gt;.</br>Before join to this group, you have to join to &lt;' + groupname + '&gt');
                return;
              }

              Utils.confirm('Are you sure to join into &lt;' + group.get('name') + '&gt;?', null, function () {
                Utils.showIndicator();
                Parse.Cloud.run('joinGroup', {
                  groupId: group.id
                }, function (response) {
                  if (response) { //if returned object is instance of GroupMember
                    $scope.$apply(function () {
                      $rootScope.$broadcast('joinedToGroup');

                      if (response.get('group').get('joinability') === 'free_join') {
                        $scope.gotoGroupDetail(group);
                        $scope.loadGroups(false);
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
//            jQuery('#selected_typename').text(jQuery(e.toElement).text());
            $scope.selectedCategory = jQuery(e.toElement).text();
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
            if (!group.get('hasGroupFeed')) {
              $location.path('/members/' + group.id);
              return;
            }
            Utils.showIndicator();
            Parse.Cloud.run('checkGroupVisibility', {groupId: group.id}).then(function (response) {
              Utils.hideIndicator();
              $scope.$apply(function () {
                if (response) {
                  $location.path('/group-feed/' + group.id);
                } else {
                  $location.path('/members/' + group.id);
                }
              });
            });
          };

          $scope.checkSubGroup = function (group) {
            console.log(group);
          };

          $scope.loadGroupTypes();

          $scope.loadGroups();
        });
