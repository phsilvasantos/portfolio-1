'use strict';

angular.module('gnApp.controllers')
        .controller('EventsController', function ($scope, EventUtils, $ionicSideMenuDelegate, $location, $ionicModal, Utils) {
          $ionicSideMenuDelegate.canDragContent(true);

          if (!Parse.User.current()) {
            $location.path('/login');
            return;
          }

          $scope.data = {};
          $scope.eventType = 'upcoming';

          EventUtils.loadMyAttendedEvents();
          $scope.eventUtils = EventUtils;

          $scope.selectEventType = function (type) {
            $scope.eventType = type;
            $scope.loadEvents();
          };

          $scope.events = [];
          $scope.loadEvents = function (bool) {
            if (bool !== false) {
              Utils.showIndicator();
            }

            Parse.Cloud.run('listEvents', {filter: $scope.eventType}, function (data) {

              Utils.hideIndicator();
              var events = [];
              data.forEach(function (ev) {
                var eventItem = ev.event;
                if (eventItem.get('photoCount') > 0) {
                  eventItem.photos = [];
                  ev.photos.forEach(function (photo) {
                    eventItem.photos.push({thumbUrl: photo.get('thumbImage').url(), id: photo.id});
                  });
                }
                events.push(eventItem);
              });
              $scope.$apply(function () {
                $scope.events = events;
              });
              $scope.$broadcast('scroll.refreshComplete');
            });
            /*var query = new Parse.Query(Parse.Object.extend('Event'));
             query.equalTo("status", true);
             
             var d = new Date();
             d.setHours(0, 0, 0, 0)
             
             if ($scope.eventType == 'past') {
             query.lessThan('startAt', d);
             query.descending('startAt');
             } else {
             query.ascending('startAt');
             query.greaterThanOrEqualTo('startAt', d);
             }
             query.find({
             success: function (data) {
             data.forEach(function (ev) {
             ev.photos = [
             {thumbUrl: 'img/example/1.jpg', id: 1},
             {thumbUrl: 'img/example/2.jpg', id: 2},
             {thumbUrl: 'img/example/3.jpg', id: 3},
             {thumbUrl: 'img/example/4.jpg', id: 4},
             {thumbUrl: 'img/example/1.jpg', id: 5},
             {thumbUrl: 'img/example/3.jpg', id: 6},
             {thumbUrl: 'img/example/1.jpg', id: 7},
             {thumbUrl: 'img/example/2.jpg', id: 8},
             {thumbUrl: 'img/example/1.jpg', id: 9},
             {thumbUrl: 'img/example/1.jpg', id: 10}
             ];
             });
             $scope.$apply(function () {
             $scope.events = data;
             });
             Utils.hideIndicator();
             $scope.$broadcast('scroll.refreshComplete');
             },
             error: function () {
             Utils.hideIndicator();
             $scope.$broadcast('scroll.refreshComplete');
             }
             });*/
          };

          $scope.viewPhotos = function (eventId) {
            $location.url('/event-detail/' + eventId + '?tab=photo');
          };

          $scope.loadEvents();
        });