'use strict';

angular.module('gnApp.controllers')
        .controller('EventsController', function ($scope, $rootScope, EventUtils, $ionicSideMenuDelegate, $location, $stateParams, Utils) {
          $ionicSideMenuDelegate.canDragContent(true);

          if (!Parse.User.current()) {
            $location.path('/login');
            return;
          }

          $scope.pageTitle = ($stateParams.pageTitle)?$stateParams.pageTitle:'Programs';
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
              console.log('event', data);
              var events = [];
              data.forEach(function (ev) {
                var eventItem = ev.event;
                eventItem.status = $scope.eventType;
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
          };

          $scope.viewPhotos = function (eventId) {
            $location.url('/event-detail/' + eventId + '?tab=photo');
          };
          
          $scope.viewFullScreen = function (item, event, index) {
            var selectedItemId = item.id;
            Utils.showIndicator();
            var query = new Parse.Query(Parse.Object.extend('EventPhoto'));
            query.equalTo("event", event);
            query.descending('createdAt');
            query.find({
              success: function (data) {
                var photos = [];
                var i = 0;
                var selectedIndex = 0;
                data.forEach(function (item) {
                  if(selectedItemId == item.id){
                    selectedIndex = i;
                  }
                  photos.push({
                    'id': item.id,
                    'imageUrl': item.get('photo').url(),
                    'thumbImageUrl': item.get('thumbImage').url(),
                    'author': item.get('speaker'),
                    'title': item.get('title'),
                    'createdAt': item.createdAt
                  });
                  i++;
                });
                $rootScope.photoModalService.viewPhoto(photos, parseInt(selectedIndex), 'event');
                Utils.hideIndicator();
              },
              error: function () {
                Utils.hideIndicator();
              }
            });
//            alert(index);
            
          };
          
          $scope.loadEvents();
        });