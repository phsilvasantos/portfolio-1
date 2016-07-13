'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFilesController', function ($scope, $stateParams, Utils, FileTypeIcons) {
          $scope.files = [];
          $scope.images = [];
          $scope.groupId = $stateParams.groupId;
          $scope.Utils = Utils;

          $scope.done = function () {
            window.history.back();
          };

          $scope.isPicture = function (item) {
            return item.type === 'PostImage' || (item.contentType && item.contentType.indexOf('image/') === 0);
          };

          $scope.loadFiles = function () {
            Utils.showIndicator();
            Parse.Cloud.run('listGroupFiles', {groupId: $scope.groupId}, function (files) {
              $scope.images = [];
              var k = 0;
              files.forEach(function (item, index) {
                item.isPicture = $scope.isPicture(item);
                item.thumbClass = $scope.getFileTypeClass(item);
                if (item.isPicture) {
                  item.pictureIndex = k++;
                  item.fullviewItem = {
                    imageUrl: item.file.url(),
                    author: item.author.get('firstName') + ' ' + item.author.get('firstName'),
                    createdAt: item.createdAt,
                    title: item.name || item.file.name()
                  };
                  $scope.images.push(item.fullviewItem);
                }
              });

              $scope.$apply(function () {
                $scope.files = files;
              });

              Utils.hideIndicator();
            });
          };

          $scope.getFileTypeClass = function (item) {
            var ext = '';
            if (item.contentType) {
              var ary = item.contentType.split('/');
              ext = ary.length > 1 ? ary[ary.length - 1] : item.contentType;
              if (item.contentType === 'text/plain') {
                ext = 'txt';
              }
            } else if (item.file) {
              var ary = item.file.name().split(/\./g);
              ext = ary[ary.length - 1];
            }
            return FileTypeIcons[ext];
          };

          $scope.getDisplayCreatedDate = function (date) {
            return moment(date).fromNow();
          };

          $scope.openFile = function (item) {
            if ($scope.isPicture(item)) {
              return;
            }
            window.open(item.file.url(), '_blank', 'location=no,EnableViewPortScale=yes');
          };

          $scope.loadFiles();
        });
