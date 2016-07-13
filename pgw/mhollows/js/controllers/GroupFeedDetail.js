'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedDetailController', function ($scope, Utils, $stateParams, $state, $rootScope,
              $ionicScrollDelegate, $timeout, Mentions, Linkify, remoteFile, GroupService) {

          var self = this;

          $scope.postId = $stateParams.postId;
          $scope.newCommentText = '';

          $scope.likedByInString = function(post) {
            if (!post || !post.likedByUsers || post.likedByUsers.length == 0)
              return '';

            var result = '';

            var likedUserNames = [];

            var isLiked = $scope.isLiked(post);

            if (isLiked) //ensure that current user is in first place
              likedUserNames.push('You');


            if (post.likedByUsers.length <= 2) {
              for (var i in post.likedByUsers) {
                var user = post.likedByUsers[i];
                if (user.id != Parse.User.current().id)
                  likedUserNames.push(user.get('firstName') + ' ' + user.get('lastName'));
              }
            }
            else {
              if (!isLiked) {
                var user = post.likedByUsers[0];
                likedUserNames.push(user.get('firstName') + ' ' + user.get('lastName'));
              }

              likedUserNames.push((post.get('likedBy').length -1) + ' people');
            }

            return likedUserNames.join(' and ') + ' like this';
          };

          $scope.fetchPost = function () {
            Utils.showIndicator();
            Parse.Cloud.run('groupPostDetail', {postId: $scope.postId}, function(info){
              info.post.set('body', Mentions.parseMentionsInText(info.post.get('body'), info.post.get('mentions')));
              info.allFiles = info.images;

              $scope.$apply(function () {
                $scope.post = info.post;
                $scope.post.images = GroupService.postImages(info);
                $scope.post.files = GroupService.postFiles(info);
                $scope.post.comments = info.comments;
                $scope.$broadcast('scroll.refreshComplete');

                $scope.loadLikedUsers();
              });

              Utils.hideIndicator();
            });
          };

          $scope.refreshComments = function () {
            Parse.Cloud.run('groupPostDetail', {postId: $scope.postId}, function(info){
              $scope.$apply(function () {
                $scope.post.comments = info.comments;
              });
            });
          };

          $scope.loadLikedUsers = function() {
            var query = new Parse.Query(Parse.User);
            query.containedIn('objectId', $scope.post.get('likedBy'));

            query.find(function (users) {
              $scope.$apply(function () {

                $scope.post.likedByUsers = users;
              });
            });
          };

          $scope.pullToRefresh = function () {
            $scope.fetchPost();
          };

          $scope.decreaseBadge = function () {
            if ($scope.shared.groupBadges.posts) {
              var counter = $scope.shared.groupBadges.posts[$scope.postId];
              if (counter) {
                $scope.shared.groupBadges.total -= counter;
                $scope.shared.groupBadges.posts[$scope.postId] = 0;
              }
            }
          };

          $scope.getDisplayPostDate = function (date) {
            return moment(date).fromNow();
          };

          $scope.isLiked = function (post) {
            return GroupService.isLiked(post);
          };

          $scope.likePost = function (post) {
            if (!$scope.isLiked(post)) {
              var likedBy = post.get('likedBy') || [];
              likedBy.push(Parse.User.current().id);
              post.set('likedBy', likedBy);
              post.save();
            }
          };

          function isKB() {
            return typeof (cordova) !== 'undefined' && typeof (cordova.plugins.Keyboard) !== 'undefined';
          }

          $scope.addComment = function () {
            if (!$scope.newCommentText || $scope.isSending) {
              return;
            }
            Utils.showIndicator();
            $scope.isSending = true;
            Parse.Cloud.run('groupPostComment', {
              postId: $scope.post.id,
              body: $scope.newCommentText,
              mentions: Mentions.formMentionedList()
            }, function (response) {
              $scope.isSending = false;
              response.comment.set('body', Mentions.parseMentionsInText(response.comment.get('body'), response.comment.get('mentions')));

              $scope.post.comments.push(response.comment);
              $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
              });
              $scope.newCommentText = '';
              $('#txt_comment').trigger('propertychange')
              Utils.hideIndicator();

              if ($scope.post.images.length > 0) {
                $scope.post.images.forEach(function (item) {
                  item.commentCount = $scope.post.comments.length;
                });
              }
              $rootScope.$broadcast('groupspace.feedCommentCreated', $scope.post, response.comment);
            });
          };

          $("textarea").focus(function () {
            if (isCordova()) cordova.plugins.Keyboard.show();
          });

          $scope.hideCommentModal = function(){
            var nowPage = $('.page.has-commentbox');
            if (nowPage.length === 0) {
              return;
            }
            var footer = $('.commentbox.bar-footer');
            setTimeout(function () {
              footer.css('bottom', footer.data('prev-bottom'));
              nowPage.css('bottom', nowPage.data('prev-bottom'));
              $ionicScrollDelegate.$getByHandle('group-feed-detail').resize();
              footer.removeData('prev-bottom');
              nowPage.removeData('prev-bottom');
            });
          };

          $(document).off('click', '.pane').on('click', '.pane', function (e) {
            if (e.target.tagName.toLowerCase() !== 'textarea' &&
                    e.target.id !== 'group_feed_mention_users' &&
                    e.target.parentNode.id !== 'group_feed_mention_users') {
              $scope.hideCommentModal();
            } else {
              if (e.target.id === 'group_feed_detail_mention_users' || e.target.parentNode.id == 'group_feed_detail_mention_users') {
                alert(isKB());
                if (isKB()) {
                  cordova.plugins.Keyboard.show();
                }
              }
            }

          });

          $scope.messageInputChanged = function ($event) {
            Mentions.watchIfMentionCalled($scope.newCommentText);
          };

          /** Mentions */
          $scope.mentionsUsers = [];

          $scope.usersForMentionsCb = function () {
            //console.log('usersForMentionsCb', self.mentionsUsers, this);
            return self.mentionsUsers;
          };

          $scope.showMention = function () {
            return Mentions.displayMentionsList();
          };

          $scope.mentionUsersList = function () {
            return Mentions.getMentionUsersList();
          };

          $scope.addUserToMentions = function (user) {
            $scope.newCommentText = Mentions.addUserToMentions(user, $scope.newCommentText, function () {
            });
          };

          $scope.prepareMentionsData = function () {
            var query = new Parse.Query(Parse.User);
            query.limit(1000);
            query.include('profile');
            query.ascending('firstName');
            Utils.showIndicator();
            self.mentionsUsers = [];
            query.find().then(function (members) {
              self.mentionsUsers = members;
              //console.log('LOAD USERS FOR MEMBERS', members);
              Utils.hideIndicator();
            });
          };

          $scope.prepareMentionsData();
          Mentions.reset();
          Mentions.initialize($('.mention-input-feed-detail'), $scope.usersForMentionsCb);
          /** End of Mentions */

          pushNotifications.registerSilentEvent('groupPostCommentsChanged', this,
            function(notificationData) {
              return $state.current.name == 'app.group-feed-detail' && $stateParams.postId == notificationData.silent.postId;
            },
            function(notificationData) {
              console.log('new comment for post', $scope.postId);
              $scope.refreshComments();
            }
          )

          $scope.decreaseBadge();
          $scope.fetchPost();
        });
