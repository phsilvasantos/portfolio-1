'use strict';

angular.module('gnApp.controllers')
        .controller('MembersController', function ($scope, $stateParams, Utils, $location, $ionicModal, $ionicScrollDelegate, $filter) {

          $scope.data = {};
          $scope.group = null;
          $scope.members = [];
          $scope.groupMembers = [];
          $scope.dividedMembers = [];
          $scope.groupId = $stateParams.groupId;
          $scope.orderBy = 'lastName';
          $scope.title = '';
          $scope.isViewingGroup = !!$scope.groupId;

          $scope.searchMembers = function (word) {
            $scope.data.searchword = word;
          };

          jQuery('#txt_search_members').on('search', function () {
            $scope.$apply(function () {
              var searchTerm = jQuery('#txt_search_members').val();
              if (window.mixpanel) {
                window.mixpanel.track("Search Membership", {
                  "Search Term": searchTerm
                });
              }
              $scope.searchMembers(searchTerm);
            });
            $ionicScrollDelegate.scrollTop(false);
            jQuery(this).blur();
          }).on('keyup', function () {
            //if ($(this).val() !== '') {
            //  $(this).closest('.searchbar').removeClass('noempty');
            //}
          }).on('blur', function () {
            if ($(this).val() === '') {
              $(this).closest('.searchbar').removeClass('noempty');
            }
          }).on('focus', function () {
            $(this).closest('.searchbar').addClass('noempty');
          });

          var Member = Parse.Object.extend('User');

          $scope.subtitleForMember = function (m) {
            var title, company;
            try {
              title = m.get('profile').get('sections')['Professional Info']['Title'];
              company = m.get('profile').get('sections')['Professional Info']['Company Name'];
            } catch (exc) {
              return '';
            }

            if (title && company) {
              return title + ', ' + company;
            }

            if (title)
              return title;
            if (company)
              return company;
          };

          $scope.getGroup = function (id) {
            Utils.showIndicator();
            var query = new Parse.Query(Parse.Object.extend('Group'));
            query.get(id).then(function (group) {
              $scope.$apply(function () {
                $scope.group = group;
              });
            });
          };

          $scope.fetchMembers = function () {
            if ($scope.isViewingGroup) {
              $scope.fetchGroupMembers();
            } else {
              var query = new Parse.Query(Member);
              query.limit(10000);
              query.include('profile');
              query.ascending($scope.orderBy);
              Utils.showIndicator();
              query.find().then(function (members) {
                $scope.$apply(function () {
                  $scope.members = members;
                  // always show the dividers; unless we are
                  // viewing the members of a group
                  $scope.divideMembers();
                  $ionicScrollDelegate.scrollTop(false);
                });
                Utils.hideIndicator();
              });
            }
          };

          $scope.fetchGroupMembers = function () {
            if (!$scope.groupId) {
              return;
            }
            var group = new (Parse.Object.extend('Group'))();
            group.id = $scope.groupId;

            var query = new Parse.Query(Parse.Object.extend('GroupMember'));
            query.limit(10000);
            query.include('position,user,user.profile');
            query.equalTo('group', group);
            query.find().then(function (groupMembers) {
              $scope.$apply(function () {
                var allMembers = [];
                groupMembers = _.sortBy(groupMembers, function (gm) {
                  if (gm.get('user')) {
                    allMembers.push(gm.get('user'));
                  }
                  return gm.get('position') ? gm.get('position').get('position') : null;
                });
                $scope.groupMembers = groupMembers;
                $scope.members = allMembers;
                $scope.divideMembers();
                $ionicScrollDelegate.scrollTop(false);
              });
              Utils.hideIndicator();
            });
          };

          /* === filter modal === */
          $scope.filterModal = null;
          $ionicModal.fromTemplateUrl('filter-modal-html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            $scope.filterModal = modal;
          });

          $scope.sortMembers = function (orderBy) {
            $scope.orderBy = orderBy;
            $scope.divideMembers();
            $ionicScrollDelegate.scrollTop(false);
            $scope.filterModal.hide();
          };

          $scope.$on('$destroy', function () {
            $scope.filterModal.remove();
          });

          $scope.clearSearch = function () {
            $scope.data.searchword = '';
          };

          $scope.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
          $scope.divideMembers = function () {
            //return;
            var members = $filter('gnMembersSearch')($scope.members, $scope.data.searchword);
            members = _.sortBy(members, function (member) {
              return member.get($scope.orderBy);
            });
            var tmp = {};
            $scope.dividers = [];
            if ($scope.isViewingGroup) {
              if ($scope.groupMembers.length > 0) {
                var dividedPositionMembers = {};
                _.each($scope.groupMembers, function (gm) {
                  if (!gm.get('position')) {
                    return;
                  }
                  var positionName = gm.get('position').get('name');
                  var member = gm.get('user');
                  dividedPositionMembers[positionName] = dividedPositionMembers[positionName] || [];
                  member.positionNumber = gm.get('position').get('position');
                  dividedPositionMembers[positionName].push(member);
                });
                _.each(dividedPositionMembers, function (membs, positionName) {
                  membs = $filter('gnMembersSearch')(membs, $scope.data.searchword);
                  membs = _.sortBy(membs, function (member) {
                    return member.get($scope.orderBy);
                  });
                  $scope.dividers.push(positionName);
                  tmp[positionName] = membs;
                });
              }
              tmp['Members'] = members;
              $scope.dividers.push('Members');
            } else {
              var re = /[a-zA-Z]/;
              _.each(members, function (member) {
                var letter = member.get($scope.orderBy).charAt(0).toUpperCase();
                if (!re.test(letter)) {
                  letter = '#';
                }
                tmp[letter] = tmp[letter] || [];
                tmp[letter].push(member);
              });
              $scope.dividers = $scope.letters;
            }
            $scope.dividedMembers = tmp;
            return tmp;
          };

          $scope.scrollToDivider = function (fl) {
            if ($scope.dividedMembers[fl] && $scope.dividedMembers[fl].length > 0) {
              $location.hash(fl);
              $ionicScrollDelegate.anchorScroll(true);
            }
          };

          $scope.$watch('data.searchword', function () {
            $scope.divideMembers();
            $ionicScrollDelegate.scrollTop(false);
          });

          if ($scope.groupId) {
            $scope.getGroup($scope.groupId);
            $scope.$watch('group', function (n) {
              if (n) {
                $scope.title = n.get('name');
                if (window.mixpanel) {
                  window.mixpanel.track("View Group Members", {
                    "Group ID": $scope.groupId,
                    "Group Name": n.get('name')
                  });
                }
              }
            });
          } else {
            $scope.title = 'Browse Members';
          }
          $scope.fetchMembers();
        });
