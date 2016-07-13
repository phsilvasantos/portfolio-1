'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedDetailController', function ($scope, Utils, $stateParams, $rootScope, $ionicScrollDelegate, $timeout, Mentions) {
          var self = this;

          $scope.postId = $stateParams.postId;
          $scope.newCommentText = '';

          var Post = Parse.Object.extend('Post');
          var PostImage = Parse.Object.extend('PostImage');
          var PostComment = Parse.Object.extend('PostComment');

          $scope.fetchPost = function () {
            var query = new Parse.Query(Post);
            query.include('author,author.profile,group');
            Utils.showIndicator();
            query.get($scope.postId, function (post) {
              $scope.$apply(function () {
                post.set('body', Mentions.parseMentionsInText(post.get('body'), post.get('mentions')));
                $scope.post = post;
              });

              //get post images
              query = new Parse.Query(PostImage);
              query.equalTo('post', $scope.post);
              query.find(function (data) {
                var images = [];
                data.forEach(function (item) {
                  images.push({
                    'id': item.id,
                    'imageUrl': item.get('image').url(),
                    'author': post.get('author').get('firstName') + ' ' + post.get('author').get('lastName'),
                    'likeCount': post.get('likedBy').length,
                    'commentCount': post.get('commentCount'),
                    'createdAt': item.createdAt,
                    'post': post
                  });
                });
                $scope.$apply(function () {
                  $scope.post.images = images;
                });
              });

              $scope.loadComments();
            });
          };

          $scope.loadComments = function () {
            //get post comments
            var query = new Parse.Query(PostComment);
            query.include('author,author.profile');
            query.equalTo('post', $scope.post);
            query.limit(20);
            query.ascending('createdAt');
            query.find(function (comments) {
              $scope.$apply(function () {
                for (var i in comments) {
                  comments[i].set('body', Mentions.parseMentionsInText(comments[i].get('body'), comments[i].get('mentions')));
                }
                $scope.post.comments = comments;
                if ($rootScope.gotoLastComment) {
                  $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                  });
                  $rootScope.gotoLastComment = null;
                }
                $scope.$broadcast('scroll.refreshComplete');
              });
              Utils.hideIndicator();
            });
          };

          $scope.pullToRefresh = function () {
            $scope.loadComments();
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
            });
          };

          window.addEventListener('native.keyboardshow', function (e) {
            var nowPage = $('.page.has-commentbox');
            if (nowPage.length === 0 || nowPage.data('prev-bottom')) {
              return;
            }
            //alert('Keyboard height is: ' + e.keyboardHeight);
            var footer = $('.commentbox.bar-footer');
            $('.tabbs-main').hide();
            footer.data('prev-bottom', footer.css('bottom'));
            nowPage.data('prev-bottom', nowPage.css('bottom'));
            setTimeout(function () {
              footer.css('bottom', '0px');
              nowPage.css('bottom', footer.outerHeight() + 'px');
              $ionicScrollDelegate.$getByHandle('group-feed-detail').resize();

            });
          });
          window.addEventListener('native.keyboardhide', function (e) {
            var nowPage = $('.page.has-commentbox');
            if (nowPage.length === 0) {
              return;
            }
            var footer = $('.commentbox.bar-footer');
            $('.tabbs-main').show();
            setTimeout(function () {
              footer.css('bottom', footer.data('prev-bottom'));
              nowPage.css('bottom', nowPage.data('prev-bottom'));
              $ionicScrollDelegate.$getByHandle('group-feed-detail').resize();
              footer.removeData('prev-bottom');
              nowPage.removeData('prev-bottom');
            });
          });

          $scope.messageInputChanged = function ($event) {
            Mentions.watchIfMentionCalled($scope.newCommentText);
          }

          /** Mentions */
          this.mentionsUsers = [];

          this.usersForMentionsCb = function () {
            console.log('usersForMentionsCb', self.mentionsUsers, this);
            return self.mentionsUsers;
          }

          this.showMention = function () {
            return Mentions.displayMentionsList();
          }

          this.mentionUsersList = function () {
            return Mentions.getMentionUsersList();
          }

          this.addUserToMentions = function (user) {
            var self = this;
            $scope.newCommentText = Mentions.addUserToMentions(user, $scope.newCommentText, function () {
            });
          };

          this.prepareMentionsData = function () {
            var query = new Parse.Query(Parse.User);
            query.limit(1000);
            query.include('profile');
            query.ascending('firstName');
            Utils.showIndicator();
            self.mentionsUsers = [];
            query.find().then(function (members) {
              self.mentionsUsers = members;
              console.log('LOAD USERS FOR MEMBERS', members);
              Utils.hideIndicator();
            });
          };

          this.prepareMentionsData();
          Mentions.reset();
          Mentions.initialize($('.feed-post-comment-input'), this.usersForMentionsCb);
          /** End of Mentions */

          $scope.decreaseBadge();
          $scope.fetchPost();
        });
