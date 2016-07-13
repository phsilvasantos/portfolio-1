'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFilesController', function ($scope, $stateParams, Utils, remoteFile) {
          $scope.files = [];
          $scope.images = [];
          $scope.groupId = $stateParams.groupId;
          $scope.Utils = Utils;

          $scope.options = {
            groupId: $scope.groupId, page: -1, per: 20
          };

          $scope.isMoreFiles = true;

          $scope.done = function () {
            window.history.back();
          };

          $scope.loadFiles = function () {
            if(!$scope.options.page){
              $scope.images = [];
              $scope.files = [];
            }
            Parse.Cloud.run('listGroupFiles', $scope.options, function (files) {
              var k = $scope.options.per * $scope.options.page;
              files.forEach(function (item, index) {
                item.isPicture = $scope.isPicture(item);
                item.thumbClass = $scope.getFileTypeClass(item);
                if (item.isPicture) {
                  item.pictureIndex = k++;
                  item.fullviewItem = {
                    imageUrl: item.get('fileUrl') || item.get('file').url(),
                    thumbImageUrl: (item.get('thumbUrl') || item.get('thumbImage') ? item.get('thumbUrl') || item.get('thumbImage').url() : ''),
                    author: item.get('author').get('firstName') + ' ' + item.get('author').get('lastName'),
                    createdAt: item.createdAt,
                    title: item.get('name') || item.get('file').name()
                  };
                  $scope.images.push(item.fullviewItem);
                }
              });

              $scope.$apply(function () {
                $scope.files = $scope.files.concat(files);
                $scope.isMoreFiles = files.length >= $scope.options.per;
                $scope.$broadcast('scroll.infiniteScrollComplete');
              });
            });
          };

          $scope.loadMoreFiles = function () {
            $scope.options.page++;
            $scope.loadFiles();
          };

          $scope.getDisplayCreatedDate = function (date) {
            return moment(date).fromNow();
          };
        });
