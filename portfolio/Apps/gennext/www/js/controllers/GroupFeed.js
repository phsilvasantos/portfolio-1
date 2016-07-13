'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedController', function ($scope, FileTypeIcons, Utils, $stateParams, $location, $ionicSideMenuDelegate, $ionicPopover, $ionicScrollDelegate, appNotificationsCounter, Mentions) {

          $scope.posts = [];
          $scope.groupId = $stateParams.groupId;
          $scope.group = new (Parse.Object.extend('Group'))();
          $scope.group.id = $scope.groupId;

          $scope.isModeratable = false;
          $scope.hasWritePermission = false;

          $scope.groupMembersCount = 0;
          $scope.groupFilesCount = 0;

          $scope.thumbMembers = [];
          $scope.recentFiles = [];

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
              });
              var query = new Parse.Query(Parse.Object.extend('PostImage'));
              query.equalTo('group', $scope.group);
              query.count().then(function(imageCount){
                $scope.$apply(function(){
                  $scope.groupFilesCount = ($scope.group.get('fileCount') || 0) + imageCount;
                });
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
                var obj = {};
                if (item.isPicture && item.thumbImage) {
                  obj.thumbUrl = item.thumbImage.url();
                } else {
                  obj.icon = $scope.getFileTypeClass(item);
                }
                recentFiles.push(obj);
              });
              $scope.$apply(function () {
                $scope.recentFiles = recentFiles;
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
            return FileTypeIcons[ext] ? 'flaticon-' + FileTypeIcons[ext] : 'svg-icon clip-white';
          };
          
          $scope.isPicture = function (item) {
            return item.type === 'PostImage' || (item.contentType && item.contentType.indexOf('image/') === 0);
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
            query.limit(15);
            query.include('position,user,user.profile');
            query.equalTo('group', $scope.group);
            query.find().then(function (groupMembers) {
              $scope.$apply(function () {
                groupMembers = _.sortBy(groupMembers, function (gm) {
                  return gm.get('position') ? gm.get('position').get('position') : null;
                });
                $scope.thumbMembers = [];
                groupMembers.forEach(function (m) {
                  var obj = {};
                  try {
                    obj.thumbUrl = m.get('user').get('profile').get('thumbImage').url();
                  } catch (exc) {
                  }
                  $scope.thumbMembers.push(obj);
                });
              });
              Utils.hideIndicator();
            });
          };

          $scope.fetchPosts = function () {
            //Utils.showIndicator();
            Parse.Cloud.run('groupFeed', $scope.options).then(function (posts) {
              posts.forEach(function (p) {
                p.post.set('body', Mentions.parseMentionsInText(p.post.get('body'), p.post.get('mentions')));

                var images = [];
                p.images.forEach(function (item) {
                  images.push({
                    'id': item.id,
                    'imageUrl': item.get('image').url(),
                    'thumbImageUrl': (item.get('thumbImage') ? item.get('thumbImage').url() : ''),
                    'author': p.post.get('author').get('firstName') + ' ' + p.post.get('author').get('lastName'),
                    'likeCount': p.post.get('likedBy').length,
                    'commentCount': p.post.get('commentCount'),
                    'createdAt': item.createdAt,
                    'post': p.post
                  });
                });
                p.images = images;
              });
              $scope.$apply(function () {
                //Utils.hideIndicator();
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

          $scope.caculateVisibleAvatarCount = function () {
            var avatarsContainerWidth = $('.page-content').width() - $('.horiz-list .viewmore').width() - 20;
            $scope.visibleMembersCount = Math.round(avatarsContainerWidth / 76);
          };

          $scope.resize = function () {
            $scope.$apply(function () {
              $scope.caculateVisibleAvatarCount();
            });
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


          $(window).unbind('resize', $scope.resize)
                  .bind('resize', $scope.resize);

          ionic.DomUtil.ready(function () {
            $scope.caculateVisibleAvatarCount();
          });

          $scope.getGroup();
          $scope.fetchMembers();
          $scope.checkModeratable();
          $scope.checkWritePermission();
          $scope.decreaseBadge();
          $scope.loadFiles();
          //$scope.fetchPosts();
        });
