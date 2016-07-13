'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedPhotosController', function ($scope, $stateParams, Utils) {
          $scope.photos = [];
          $scope.groupId = $stateParams.groupId;
          $scope.group = new (Parse.Object.extend('Group'))();
          $scope.group.id = $scope.groupId;

          $scope.done = function () {
            window.history.back();
          };

          $scope.getDisplayCreatedDate = function (date) {
            return moment(date).fromNow();
          };

          $scope.loadPhotos = function () {
            var query = new Parse.Query(Parse.Object.extend('PostImage'));
            query.equalTo('group', $scope.group);
            query.ascending('createdAt');
            query.include('post,post.author');
            Utils.showIndicator();
            query.find(function (data) {
              var images = [];
              //console.log(data);
              data.forEach(function (item) {
                var post = item.get('post');
                var newItem = {
                  'id': item.id,
                  'imageUrl': item.get('image').url(),
                  'thumbImageUrl': (item.get('thumbImage') ? item.get('thumbImage').url() : null),
                  'createdAt': item.createdAt
                };
                if(post){
                  newItem.author = post.get('author').get('firstName') + ' ' + post.get('author').get('lastName');
                  newItem.likeCount = post.get('likedBy').length;
                  newItem.commentCount = post.get('commentCount');
                  newItem.post = post;
                }
                images.push(newItem);
              });
              $scope.$apply(function () {
                $scope.photos = images;
              });
              Utils.hideIndicator();
            });

          };

          $scope.loadPhotos();
        });
