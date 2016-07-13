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
            Utils.showIndicator();
            Parse.Cloud.run('listGroupFiles', {groupId: $scope.groupId, postImagesOnly: true, per: 100}, function (files) {
              var images = [];
              //console.log(files);
              files.forEach(function (item) {
                var post = item.get('post');
                var newItem = {
                  'id': item.id,
                  'imageUrl': item.get('file').url(),
                  'author': item.get('author').get('firstName') + ' ' + item.get('author').get('lastName'),
                  'thumbImageUrl': (item.get('thumbImage') ? item.get('thumbImage').url() : null),
                  'createdAt': item.createdAt
                };
                if(post){
                  newItem.title = post.get('body');
                  newItem.likeCount = post.get('likedBy').length;
                  newItem.commentCount = post.get('commentCount');
                  newItem.post = post;
                  newItem.liked = $scope.isLiked(post);
                }
                images.push(newItem);
              });
              $scope.$apply(function () {
                $scope.photos = images;
              });
              Utils.hideIndicator();
            });
          };

          $scope.isLiked = function (post) {
            if (!post) {
              return;
            }
            var likedBy = post.get('likedBy') || [];
            return likedBy.indexOf(Parse.User.current().id) !== -1;
          };

          $scope.likePost = function (post) {
            if (!$scope.isLiked(post)) {
              var likedBy = post.get('likedBy') || [];
              likedBy.push(Parse.User.current().id);
              post.set('likedBy', likedBy);
              post.save();
            }
          };

          $scope.loadPhotos();
        });
