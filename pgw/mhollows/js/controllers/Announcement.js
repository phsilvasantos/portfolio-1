'use strict';

angular.module('gnApp.controllers')
        .controller('AnnouncementController', function ($scope, $stateParams, Utils, $ionicScrollDelegate, $ionicSideMenuDelegate, $sce, $timeout) {
          console.log('INSIDE ANNOUNCEMENT CONTROLLER');
          $ionicSideMenuDelegate.canDragContent(true);
          
          if (cordova != undefined && cordova.plugins != undefined) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
          }
          
          $scope.comments = [];
          $scope.likes = [];
          $scope.id = $stateParams.id;
          $scope.toggle = false;
          $scope.count = 10;
          $scope.toggleCount = function(){
            if($scope.count == 10){
              $scope.count = 'all';
              $ionicScrollDelegate.scrollBottom(true);
            }else{
              $scope.count = 10;
              $ionicScrollDelegate.scrollTop(true);
            }
          }

          Utils.showIndicator();

          var accessquery = new Parse.Query(Parse.Object.extend('AppSetting'));
          accessquery.equalTo('key', 'announcement_likes_and_comments');
          accessquery.find({
            success: function (results) {
              if(results.length){
                $scope.toggle = results[0].get('value');
              }
            }
          });
          var query = new Parse.Query(Parse.Object.extend('Announcement'));
          query.include('author.profile');
          query.get($scope.id).then(function (announcement) {
            console.log('announcement', announcement);
            Utils.trackMixPanel("View Announcement", {
              "Announcement ID": announcement.id,
              "Announcement Title": announcement.get('title')
            });
            // Get Comments with announcementId
            new Parse.Cloud.run('listAnnouncementComments', {
              announcementId: announcement.id,
              direction: 'asc',
              per: 100
            }, function (response) {
              console.log('listAnnouncementComments', response);
              Utils.hideIndicator();
              $scope.comments = response;
            });
            // Get Likes with announcementId
            new Parse.Cloud.run('listAnnouncementLikes', {
              announcementId: announcement.id,
              direction: 'desc',
              per: 100
            }, function (response) {
              console.log('listAnnouncementLikes', response);
              Utils.hideIndicator();
              $scope.likes = response;
            });

            announcement.displayPublishDate = Utils.formatDate(announcement.get('publishOn'), 'MMM D, YYYY');
            if (announcement.get('image')) {
              announcement.imageInfo = {
                'id': announcement.id,
                'imageUrl': announcement.get('image').url(),
                'author': announcement.get('author').get('firstName') + ' ' + announcement.get('author').get('lastName'),
                'createdAt': announcement.get('publishOn')
              };
            }
            $scope.$apply(function () {
              $scope.announcement = announcement;
              var bodyHtml = announcement.get('body'); 
              
              if(bodyHtml.indexOf('http://www.youtube.com') < 0){
                bodyHtml = bodyHtml.replace('//www.youtube.com', 'http://www.youtube.com');                
              }
              $scope.announcement_body = $sce.trustAsHtml(bodyHtml);
              console.log('iframe', $('iframe'));
            });
          });

          //open comment modal
          $scope.openCommentModal = function (e, comment) {
            var pageElem = $('.page-group-feed.feed-list');
            pageElem.data('prev-bottom', pageElem.css('bottom')).css('bottom', '0px');
            $('.tabbs-main').hide();
            $('#announcement_commentbox_modal').fadeIn('fast', function () {
              $('#announcement_commentbox_modal textarea').focus();
              if (isKB()) {
                cordova.plugins.Keyboard.show();
              }
              $scope.itemForComment = comment;
            });
          };

          function isKB() {
            return typeof (cordova) !== 'undefined' && typeof (cordova.plugins.Keyboard) !== 'undefined';
          }

          $scope.isLiked = function () {
            var returnVal = false;
            for (var i = 0; i < $scope.likes.length; i++) {
              if ($scope.likes[i].get('user').id == Parse.User.current().id) {
                returnVal = true;
                break;
              }
            }
            return returnVal;
          };

          $scope.saveComment = function (p, commentContent, callback) {
            if (!commentContent) {
              return;
            }
            Utils.showIndicator();
            $scope.isSending = true;
            Parse.Cloud.run('announcementComment', {
              announcementId: $scope.id,
              body: commentContent,
            }, function (response) {
              $scope.comments.push(response.comment[0]);
              $scope.announcement.set('commentCount', $scope.comments.length)
              $scope.isSending = false;
              Utils.hideIndicator();
              if (callback) {
                callback(response);
              }
            });
          };

          $scope.like = function (announcement, callback) {
            Utils.showIndicator();
            if (!$scope.isLiked(announcement)) {
              Parse.Cloud.run('announcementLike', {
                announcementId: $scope.id
              }, function (response) {
                $scope.likes.unshift(response.comment);
                $scope.announcement.set('likeCount', $scope.likes.length)
                $scope.isSending = false;
                Utils.hideIndicator();
                if (callback) {
                  callback(response);
                }
              });
            }
          };

          //hide comment modal
          $scope.hideCommentModal = function () {
            $scope.itemForComment = null;
            $scope.newCommentText = '';
            $('#announcement_commentbox_modal textarea').val('').trigger('input.autogrow');
            var pageElem = $('.page-announcement.feed-list');
            if (pageElem.data('prev-bottom')) {
              pageElem.css('bottom', pageElem.data('prev-bottom')).data('prev-bottom', null);
            }
            $('.tabbs-main').show();
            $('#announcement_commentbox_modal').fadeOut('fast');
          };

          //trigger blur event of comment textbox
          $(document).off('click', '#announcement_commentbox_modal').on('click', '#announcement_commentbox_modal', function (e) {
            if (e.target.tagName.toLowerCase() !== 'textarea') {
              $scope.hideCommentModal();
            }
          });
          
          $('#announcement_commentbox_modal textarea').blur(function(){
            $timeout($scope.hideCommentModal(), 1000);
          });

          $scope.addCommentFromModal = function () {
            $scope.saveComment($scope.itemForComment, $scope.newCommentText);
          };

          $scope.getDisplayPostDate = function (date) {
            return moment(date).fromNow();
          };

          $scope.lastItems = function (ary, cnt) {
            if(cnt == 'all'){
              return ary;
            }
            if (typeof (ary) !== 'object' || ary.length <= cnt || cnt <= 0) {
              return ary;
            }
            var ret = [];
            for (var i = 0; i < cnt; i++) {
              ret.push(ary[i]);
            }
            return ret;
          };
        });
