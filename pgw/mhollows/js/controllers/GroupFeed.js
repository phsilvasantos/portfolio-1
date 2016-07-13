'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedController', function ($scope, Utils, $stateParams, $location, $state,
          $ionicSideMenuDelegate, $rootScope, $ionicScrollDelegate, appNotificationsCounter, Mentions, Linkify, $timeout,
          fileUploader, remoteFile, GroupService) {

          if (cordova != undefined && cordova.plugins != undefined) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
          }

          $scope.posts = [];
          $scope.groupId = $stateParams.groupId;
          $scope.group = new (Parse.Object.extend('Group'))();
          $scope.group.id = $scope.groupId;

          $scope.isModeratable = false;
          $scope.hasWritePermission = false;

          $scope.groupMembersCount = 0;

          $scope.thumbMembers = [];

          $scope.options = {
            groupId: $scope.groupId, page: -1, per: 20, feedcomments_num: 5
          };

          $scope.isMorePosts = true;

          $scope.getGroup = function () {
            var query = new Parse.Query(Parse.Object.extend('Group'));
            query.get($scope.groupId).then(function (group) {
              $scope.$apply(function () {
                $scope.group = group;
                $scope.groupMembersCount = $scope.group.get('memberCount') || 0;
                $scope.groupFilesCount = group.get('fileCount') || 0;
              });

              if ($('.sidemenu-group-members').length > 0) {
                var menuScope = angular.element($('.sidemenu-group-members')).scope();
                menuScope.$apply(function () {
                  menuScope.setGroup($scope.group);
                });
              }
            });
          };

          $scope.loadFiles = function () {
            Parse.Cloud.run('listGroupFiles', {groupId: $scope.groupId, per: 10, direction: 'desc'}, function (files) {
              var recentFiles = [];
              files.forEach(function (item, index) {
                item.isPicture = $scope.isPicture(item);
                item.fullviewItem = {
                  imageUrl: item.get('fileUrl') || item.get('file').url(),
                  author: item.get('author').get('firstName') + ' ' + item.get('author').get('lastName'),
                  createdAt: item.createdAt,
                  title: item.get('name') || item.get('file').name()
                };
                var obj = {};
                obj.file = item;
                if (item.isPicture && (item.get('thumbUrl') || item.get('thumbImage'))) {
                  obj.thumbUrl = item.get('thumbUrl') || item.get('thumbImage').url();
                } else {
                  obj.icon = $scope.getFileTypeClass(item);
                }
                recentFiles.push(obj);
              });
              $scope.$apply(function () {
                $scope.recentFiles = recentFiles;
              });
            });
          };

          $scope.decreaseBadge = function () {
            if ($scope.shared.groupBadges.groups) {
              var counter = $scope.shared.groupBadges.groups[$scope.groupId];
              if (counter) {
                appNotificationsCounter.decreaseCounter(counter);
                $scope.shared.groupBadges.total -= counter;
                $scope.shared.groupBadges.groups[$scope.groupId] = 0;
              }
            }
          };

          $scope.badgeCounter = function (post) {
            if ($scope.shared.groupBadges.posts && $scope.shared.groupBadges.posts[post.id])
              return $scope.shared.groupBadges.posts[post.id];
            else
              return null;
          };

          $scope.fetchMembers = function () {
            var query = new Parse.Query(Parse.Object.extend('GroupMember'));
            query.include('position,user,user.profile');
            query.ascending('status');
            query.equalTo('group', $scope.group);
            query.find().then(function (groupMembers) {
              $scope.$apply(function () {
                groupMembers = _.sortBy(groupMembers, function (gm) {
                  return gm.get('position') ? gm.get('position').get('position') : null;
                });

                //sort by profile image and lastInAppAt
                groupMembers = _.sortBy(groupMembers, function (m) {
                  try {
                    m.thumbUrl = m.get('user').get('profile').get('thumbImage').url();
                  } catch (exc) {
                  }
                  var lastInAppAt = m.get('user').get('lastInAppAt');
                  if (m.thumbUrl && lastInAppAt) {
                    return -1 * lastInAppAt.getTime();
                  }
                  return m.thumbUrl;
                });

                groupMembers = groupMembers.splice(0, 8);

                //get thumb members
                $scope.thumbMembers = [];
                groupMembers.forEach(function (m) {
                  $scope.thumbMembers.push({profileId: m.get('user').get('profile').id, thumbUrl: m.thumbUrl});
                });
              });
            });
          };

          $scope.fetchPosts = function () {
            var canOpenLink = function(url) { return fileUploader.linkIsToRemoteFile(url) }
            Parse.Cloud.run('groupFeed', $scope.options).then(function (posts) {
              console.log('post', posts);
              posts.forEach(function (p) {
                p.post.set('body', Mentions.parseMentionsInText(p.post.get('body'), p.post.get('mentions')));
                //p.post.set('body', Linkify.stubLinks(p.post.get('body'), {sourceLink: true, sourceImage: 'link'}));
                p.post.set('body', Linkify.parseLinks(p.post.get('body'), {linkCssClass: "group-post-link", skipImages: true, skipLinks: canOpenLink}));
                p.allFiles = p.images;

                p.images = GroupService.postImages(p);
                p.files  = GroupService.postFiles(p);
              });
              Utils.hideIndicator();
              $scope.$apply(function () {
                if ($scope.options.page === 0) {
                  $scope.posts = posts;
                } else {
                  $scope.posts = $scope.posts.concat(posts);
                }
                $scope.isMorePosts = posts.length >= $scope.options.per;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
              });
            });
          };

          $scope.pullToRefresh = function () {
            $scope.options.page = 0;
            $scope.fetchPosts();
            $scope.loadFiles();
          };

          $scope.getDisplayPostDate = function (date) {
            return moment(date).fromNow();
          };

          $scope.isLiked = function (post) {
            return GroupService.isLiked(post);
          };

          $scope.likePost = function (post, p) {
            if (!$scope.isLiked(post)) {
              var likedBy = post.get('likedBy') || [];
              likedBy.push(Parse.User.current().id);
              post.set('likedBy', likedBy);
              post.save({
                success: function (response) {
                  if (p) { //update like count and liked status in photo fullview modal
                    $scope.$apply(function () {
                      p.images.forEach(function (item) {
                        item.likeCount = likedBy.length;
                        item.liked = true;
                      });
                    });
                  }
                }
              });
            }
          };

          $scope.fetchMorePosts = function () {
            $scope.options.page++;
            $scope.fetchPosts();
          };

          $scope.deletePost = function (post) {
            Utils.confirm('Are you sure you would like to delete this post?', null, function () {
              Utils.showIndicator();
              post.destroy({
                success: function () {
                  for (var k = 0; k < $scope.posts.length; k++) {
                    if (post.id === $scope.posts[k].post.id) {
                      $scope.$apply(function () {
                        $scope.posts.splice(k, 1);
                      });
                      break;
                    }
                  }
                  Utils.hideIndicator();
                }
              });
            });
          };

          $scope.checkModeratable = function () {
            if (Parse.User.current().get('admin')) {
              $scope.isModeratable = true;
              return;
            }
            var query = new Parse.Query(Parse.Object.extend('GroupMember'));
            query.equalTo('user', Parse.User.current());
            query.equalTo('group', $scope.group);
            query.find().then(function (groupMembers) {
              $scope.$apply(function () {
                if (groupMembers.length === 0) {
                  $scope.isModeratable = false;
                } else {
                  $scope.isModeratable = groupMembers[0].get('moderator');
                }
              });
            });
          };

          $scope.checkWritePermission = function () {
            Parse.Cloud.run('checkGroupPermission', {groupId: $scope.groupId}).then(function (response) {
              $scope.$apply(function () {
                $scope.hasWritePermission = response;
              });
            });
          };

          $scope.onScrollContent = function () {
            var btnElem = jQuery('.btn-newpost');
            if (btnElem.length === 0) {
              return true;
            }
            var scrollTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
            var buttonTop = jQuery('.groupinfo').outerHeight() + jQuery('.members').outerHeight(true);
            if (scrollTop > buttonTop) {
              btnElem.css({
                position: 'absolute',
                top: scrollTop
              });
              jQuery('.feeds.list').css('margin-top', btnElem.outerHeight(true));
            } else {
              btnElem.css('position', '');
              btnElem.css('top', '');
              jQuery('.feeds.list').css('margin-top', 0);
            }
          };

          $scope.viewGroupMembers = function () {
            $ionicSideMenuDelegate.toggleRight();
          };

          $scope.viewGroupFiles = function () {
            $location.path('/group-files/' + $scope.groupId);
          };

          $scope.viewMemberDetail = function (m) {
            $location.url('/profile/' + m.profileId);
          };

          $scope.saveComment = function (p, commentContent, callback) {
            if (!commentContent) {
              return;
            }
            Utils.showIndicator();
            $scope.isSending = true;
            Parse.Cloud.run('groupPostComment', {
              postId: p.post.id,
              body: commentContent,
              mentions: Mentions.formMentionedList()
            }, function (response) {
              $scope.isSending = false;

              response.comment.set('body', Mentions.parseMentionsInText(response.comment.get('body'), response.comment.get('mentions')));

              p.comments.push(response.comment);
              Utils.hideIndicator();

              p.post.comments = p.comments;
              $rootScope.$broadcast('groupspace.feedCommentCreated', p.post, response.comment);
              if (callback) {
                callback(response);
              }
            });
          };

          function isKB() {
            return typeof (cordova) !== 'undefined' && typeof (cordova.plugins.Keyboard) !== 'undefined';
          }

          //open comment modal
          $scope.openCommentModal = function (e, p) {
            var pageElem = $('.page-group-feed.feed-list');
            pageElem.data('prev-bottom', pageElem.css('bottom')).css('bottom', '0px');
            $('.tabbs-main').hide();
            $('#groupfeed_commentbox_modal').fadeIn('fast', function () {
              $('#groupfeed_commentbox_modal textarea').focus();
              if (isKB())
                cordova.plugins.Keyboard.show();
              $scope.itemForComment = p;
            });
          };

          //hide comment modal
          $scope.hideCommentModal = function () {
            $scope.itemForComment = null;
            $scope.newCommentText = '';
            $('#groupfeed_commentbox_modal textarea').val('').trigger('input.autogrow');
            var pageElem = $('.page-group-feed.feed-list');
            if (pageElem.data('prev-bottom')) {
              pageElem.css('bottom', pageElem.data('prev-bottom')).data('prev-bottom', null);
            }
            $('.tabbs-main').show();
            $('#groupfeed_commentbox_modal').fadeOut('fast');
          };

          //trigger blur event of comment textbox
          $(document).off('click', '#groupfeed_commentbox_modal').on('click', '#groupfeed_commentbox_modal', function (e) {
            if (e.target.tagName.toLowerCase() != 'textarea' &&
                    e.target.id != 'group_feed_mention_users' &&
                    e.target.parentNode.id != 'group_feed_mention_users') {
              $scope.hideCommentModal();
            } else {
              if (e.target.id === 'group_feed_mention_users' || e.target.parentNode.id == 'group_feed_mention_users') {
                if (isCordova())
                  cordova.plugins.Keyboard.show();
              }
            }
          });

          $("textarea").focus(function () {
            if (isCordova())
              cordova.plugins.Keyboard.show();
          });

          $scope.addCommentFromModal = function () {
            $scope.saveComment($scope.itemForComment, $scope.newCommentText);
          };

          $scope.lastItems = function (ary, cnt) {
            if (typeof (ary) !== 'object' || ary.length <= cnt || cnt <= 0) {
              return ary;
            }
            var ret = [];
            for (var i = ary.length - cnt; i < ary.length; i++) {
              ret.push(ary[i]);
            }
            return ret;
          };

          $scope.fetchMembers();
          $scope.checkModeratable();
          $scope.checkWritePermission();
          $scope.decreaseBadge();

          //triggered when new post is created
          $rootScope.$on('groupspace.feedCreated', function (e, groupId, postInfo) {
            if (groupId === $scope.groupId) {
              $scope.pullToRefresh();
            }
          });

          //triggered when new post comment is created
          $rootScope.$on('groupspace.feedCommentCreated', function (e, post, comment) {
            if (post.get('group').id === $scope.groupId) {
              var changedPost = $scope.posts.filter(function (item) {
                return post.id === item.post.id;
              });
              if (changedPost.length > 0) {
                changedPost = changedPost[0];
                changedPost.post.set('commentCount', post.comments.length);
                changedPost.comments = post.comments;
                if (changedPost.images.length > 0) {
                  changedPost.images.forEach(function (item) {
                    item.commentCount = post.comments.length;
                  });
                }
              }
            }
          });

          $scope.showPhotoModal = function() {
            console.log('MODAL');
            $scope.modal.show();
          };

          this.uploadFile = function(file) {
            var data = { files: [file], body: '', groupId: $scope.groupId };
            Utils.showIndicator('groups:shareFile');
            Parse.Cloud.run('groupPostV2', data, function (response) {
              console.log('POST WAS CREATED');
              $scope.getGroup();
              $scope.pullToRefresh();
              Utils.hideIndicator('groups:shareFile');
            });
          };

          fileUploader.initialize($scope, this, this.uploadFile);

          //triggered when feed is liked newly
          $rootScope.$on('groupspace.feedLiked', function (e, post) {
            if (post.get('group').id === $scope.groupId) {
              var changedPost = $scope.posts.filter(function (item) {
                return post.id === item.post.id;
              });
              if (changedPost.length > 0) {
                changedPost = changedPost[0];
                changedPost.post.set('likedBy', post.get('likedBy'));
                changedPost.images.forEach(function (item) {
                  item.likeCount = post.get('likedBy').length;
                  item.liked = true;
                });
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
            return $scope.mentionsUsers;
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
            query.include('profile');
            query.ascending('firstName');
            Utils.showIndicator();
            $scope.mentionsUsers = [];
            query.find().then(function (members) {
              $scope.mentionsUsers = members;
              //console.log('LOAD USERS FOR MEMBERS', members);
              Utils.hideIndicator();
            });
          };

          $scope.prepareMentionsData();

          pushNotifications.registerSilentEvent('groupMembersListChanged', this,
            function(notificationData) {
              return $state.current.name == 'app.group-feed' && $stateParams.groupId == notificationData.silent.groupId;
            },
            function(notificationData) {
              console.log('received message about change group members list');
              Mentions.reset();
              Mentions.initialize($('.mention-input-feed'), $scope.usersForMentionsCb);
              $scope.fetchMembers();
            }
          )

          /** End of Mentions */

          $scope.$on('$ionicView.enter', function () {
            Mentions.reset();
            Mentions.initialize($('.mention-input-feed'), $scope.usersForMentionsCb);
            $scope.getGroup();
            $scope.loadFiles();
            $scope.isFromMenu = $location.search().from === 'menu';
          });
          // Customized back button.
          $scope.back = function () {
            $state.go('app.groups');
          };
        });
