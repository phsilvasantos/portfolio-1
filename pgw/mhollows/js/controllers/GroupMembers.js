'use strict';

angular.module('gnApp.controllers')
        .controller('GroupMembersController', function ($scope, $stateParams, Utils, $ionicModal, $ionicScrollDelegate, $filter) {

          $scope.data = {};
          $scope.group = null;
          $scope.members = [];
          $scope.groupMembers = [];
          $scope.dividedMembers = [];
          $scope.filterBy = 'lastName';
          $scope.title = '';

          $scope.searchMembers = function (word) {
            $scope.data.searchword = word;
          };

          $scope.setGroup = function (group) {
            $scope.group = group;
            //console.error('fetchGroupMembers');
            $scope.fetchGroupMembers();
            $scope.data.searchword = '';
            $('#txt_search_group_members').val('');
          };

          jQuery('#txt_search_group_members').on('search', function () {
            $scope.$apply(function () {
              var searchTerm = jQuery('#txt_search_group_members').val();
              Utils.trackMixPanel("Search Group Membership", {
                "Search Term": searchTerm
              });

              $scope.searchMembers(searchTerm);
            });
            $ionicScrollDelegate.$getByHandle('group-members').scrollTop(false);
            jQuery(this).blur();
          }).on('keyup', function () {
            if ($(this).val() === '') {
              $(this).closest('.searchbar').removeClass('noempty');
            } else {
              $(this).closest('.searchbar').addClass('noempty');
            }
          });

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

          $scope.fetchGroupMembers = function () {
            var query = new Parse.Query(Parse.Object.extend('GroupMember'));
//            This is maximum limit on Parse Api
            query.limit(1000);
            query.include('position,user,user.profile');
            query.equalTo('group', $scope.group);
            //query.ascending($scope.filterBy);
            Utils.showIndicator();
            query.find().then(function (groupMembers) {
              Utils.hideIndicator();
              $scope.$apply(function () {
                var allMembers = [];
                groupMembers = groupMembers.filter(function(item){
                  return !!item;
                });
                groupMembers = _.sortBy(groupMembers, function (gm) {
                  if (gm.get('position')) {
                    return gm.get('position');
                  }
                  if (gm.get('user') && gm.get('user').get('status') === 'active') {
                    allMembers.push(gm.get('user'));
                  }
                  return null;
                });
                $scope.groupMembers = groupMembers;
                $scope.members = allMembers;
                $scope.divideMembers();
                $ionicScrollDelegate.$getByHandle('group-members').scrollTop(false);
              });
              //Utils.hideIndicator();
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

          $scope.sortMembers = function (filterBy) {
            $scope.filterBy = filterBy;
            $scope.divideMembers();
            $ionicScrollDelegate.$getByHandle('group-members').scrollTop(false);
            $scope.filterModal.hide();
          };

          $scope.$on('$destroy', function () {
            $scope.filterModal.remove();
          });

          $scope.clearSearch = function () {
            $scope.data.searchword = '';
          };

          $scope.divideMembers = function () {
            var members = $filter('gnMembersSearch')($scope.members, $scope.data.searchword);
            members = _.sortBy(members, function (member) {
              return member && member.get($scope.filterBy);
            });
            var tmp = {};
            $scope.dividers = [];
            if ($scope.groupMembers.length > 0) {
              var dividedPositionMembers = {};
              _.each($scope.groupMembers, function (gm) {
                if (!gm.get('position')) {
                  return;
                }
                var positionName = gm.get('position').get('name');
                var member = gm.get('user');
                if(member.get('status') === 'active'){
                  dividedPositionMembers[positionName] = dividedPositionMembers[positionName] || [];
                  member.positionNumber = gm.get('position').get('position');
                  dividedPositionMembers[positionName].push(member);
                }
              });
              _.each(dividedPositionMembers, function (membs, positionName) {
                membs = $filter('gnMembersSearch')(membs, $scope.data.searchword);
                membs = _.sortBy(membs, function (member) {
                  return member.get($scope.filterBy);
                });
                $scope.dividers.push(positionName);
                tmp[positionName] = membs;
              });
            }
            tmp['Members'] = members;
            $scope.dividers.push('Members');
            $scope.dividedMembers = tmp;
            return tmp;
          };

          $scope.$watch('data.searchword', function () {
            $scope.divideMembers();
            $ionicScrollDelegate.$getByHandle('group-members').scrollTop(false);
          });

        });
