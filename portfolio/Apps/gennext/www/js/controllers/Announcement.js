'use strict';

angular.module('gnApp.controllers')
        .controller('AnnouncementController', function ($scope, $stateParams, Utils, $location, $ionicSideMenuDelegate) {
          console.log('INSIDE ANNOUNCEMENT CONTROLLER');
          $ionicSideMenuDelegate.canDragContent(true);

          Utils.showIndicator();

          var query = new Parse.Query(Parse.Object.extend('Announcement'));
          query.include('author.profile');
          query.get($stateParams.id).then(function (announcement) {

            if (window.mixpanel) {
              window.mixpanel.track("View Announcement", {
                "Announcement ID": announcement.id,
                "Announcement Title": announcement.get('title')
              });
            }

            Utils.hideIndicator();
            announcement.displayPublishDate = Utils.formatDate(announcement.get('publishOn'));
            if(announcement.get('image')){
              announcement.imageInfo = {
                'id': announcement.id,
                'imageUrl': announcement.get('image').url(),
                'author': announcement.get('author').get('firstName') + ' ' + announcement.get('author').get('lastName'),
                'createdAt': announcement.get('publishOn')
              };
            }
            $scope.$apply(function () {
              $scope.announcement = announcement;
            });
          });
        });
