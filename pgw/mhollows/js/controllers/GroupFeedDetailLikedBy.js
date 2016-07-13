'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedDetailLikedByController', function ($scope, Utils, $stateParams) {
          var self = this;

          $scope.postId = $stateParams.postId;
          $scope.users = [];

          var Post = Parse.Object.extend('Post');

          $scope.fetchMembers = function (withoutIndicator) {
            var query = new Parse.Query(Post);
            if(!withoutIndicator){
              Utils.showIndicator();
            }
            query.get($scope.postId, function (post) {
              var query = new Parse.Query(Parse.User);
              query.containedIn('objectId', post.get('likedBy'));
              query.include('profile');

              query.find(function (users) {
                Utils.hideIndicator();
                $scope.$apply(function () {
                  $scope.users = users;
                  $scope.$broadcast('scroll.refreshComplete');
                });
              });

            });
          };

          $scope.pullToRefresh = function () {
            $scope.fetchMembers(true);
          };

          $scope.fetchMembers();
        });
