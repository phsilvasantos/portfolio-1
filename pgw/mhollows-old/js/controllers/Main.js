'use strict';

angular.module('gnApp.controllers', [])
        .controller('MainController', function ($scope, $rootScope, $state, AppConfig, Utils, chatService, $ionicSideMenuDelegate, appNotificationsCounter, $ionicSlideBoxDelegate, $interval, HttpUtils, $location, $ionicModal, $ionicPopover) {
          
          $scope.getRightMenuWidth = function(){
            if($scope.messages.canDragRight()){
              return $(document).width();
            }
            return 300;
          };

          $scope.firstName = null;
          $scope.lastName = null;
          $scope.profileId = null;
          $scope.avatarImageURL = '';

          $scope.onMenuDragLeft = function () {
            $ionicSideMenuDelegate.toggleLeft(false);
          };
          $scope.onMenuDragRight = function () {
            $ionicSideMenuDelegate.toggleRight(false);
          };

          if (window.mixpanel) {
            window.mixpanel.track_links("#primary-menu-items a", "Menu Item Click", function (domElement) {
              return {"Menu Item Text": $(domElement).text()}; // side menus
            });
            window.mixpanel.track_links("#tabs a", "Tab Menu Click", function (domElement) {
              return {"Menu Item Text": $(domElement).text()}; // bottom menu
            });
          }

          if (!chatService.isReady() && Parse.User.current()) {
            chatService.initialize(Parse.User.current()); // Initialize chat
          }

          $rootScope.registerActivity = function () {
            Parse.Cloud.run('registerActivity', {}, {
              success: function (result) {
              },
              error: function (error) {
              }
            });
          };

          $scope.setupUserInfo = function () {
            if (!Parse.User.current()) {
              return;
            }
            $scope.shared.user = Parse.User.current();
            $scope.firstName = Parse.User.current().get('firstName');
            $scope.lastName = Parse.User.current().get('lastName');
            var profile = Parse.User.current().get('profile');
            $scope.profileId = profile.id;
            profile.fetch({
              success: function (profile) {
                var avatar = profile.get('thumbImage');
                if (avatar) {
                  $scope.$apply(function () {
                    $scope.avatarImageURL = avatar.url();
                    $scope.shared.user.profile = profile;
                  });
                }
              }
            });
            $rootScope.registerActivity();
            $rootScope.sendActivity = $interval($rootScope.registerActivity, 60000);
          };

          $scope.$on("userLoggedIn", function (event, args) {
            window.identifyUser();
            $scope.$apply(function () {
              $scope.setupUserInfo();
              $scope.refreshMenuData();
              chatService.initialize(Parse.User.current());
              notificationsService.sendParseConnectionStatus(true);
              appNotificationsCounter.enable();

            });
          });

          $scope.setupUserInfo();

          $scope.shouldShowTabs = function () {
            return !$state.includes('app.login') && !$state.includes('app.passcode')
                    && !$state.includes('app.messages-room') && !$state.includes('app.messages-new');
          };

          $scope.shared.devicePlatform = 'device';
          $scope.window = window;
          $scope.$watch('window.device.platform', function () {
            if (window.device && window.device.platform) {
              console.log('WATCH DEVICE PLATFORM');
              $scope.shared.devicePlatform = window.device.platform.toLowerCase();
              $rootScope.shared.devicePlatform = $scope.shared.devicePlatform;
              $rootScope.$broadcast('devicePlatformLoaded');
            }
          });

          $scope.isTabActive = function (stateName) {
            return $state.includes(stateName);
          };

          $scope.applyLogo = function () {
            AppConfig.config().then(function (config) {
              $scope.$apply(function () {
                $scope.organizationName = config.get('organizationName');
                var logo = config.get('logoSmall');
                if (logo) {
                  $('img.navbar-logo').attr('src', config.get('logoSmall').url());
                  $('img.navbar-logo').each(function () {
                    if ($(this).closest('.table-center').length === 0) {
                      $(this).wrap('<div class="table-center"><div class="cell"></div></div>');
                    }
                  });
                }
                $scope.appConfig = config;
              });
            });
          };

          $scope.loadMenuItems = function () {
            var query = new Parse.Query(Parse.Object.extend('MenuSetting'));
            query.ascending('position');
            query.find().then(function (results) {
              $scope.$apply(function () {
                $scope.menuItems = results;
              });
            });
          };

          $scope.loadContentPages = function () {
            var query = new Parse.Query(Parse.Object.extend('ContentPage'));
            query.ascending('position');
            query.find().then(function (results) {
              $scope.$apply(function () {
                $scope.contentPages = results;
              });
            });
          };

          if (window.applicationConfiguration['appVersion']) {
            $scope.versionNumber = window.applicationConfiguration['appVersion'];
            $scope.versionString = 'Version ' + $scope.versionNumber;
          } else {
            $scope.versionString = 'A Robots + Rockets App';
          }

          $scope.openContentPageWithTracking = function (url, name) {
            if (window.mixpanel) {
              window.mixpanel.track("View Content Page", {
                "Name": name,
                "URL": url
              });
            }
            $scope.openContentUrl(url);
          };

          $scope.openContentUrl = function (url) {
            var ref = window.open(url, '_blank', 'location=no,EnableViewPortScale=yes');
          };

          $scope.logOut = function () {
            $interval.cancel($rootScope.sendActivity);
            notificationsService.sendParseConnectionStatus(false);
            if (window.mixpanel) {
              window.mixpanel.track("Log Out");
            }
            chatService.initData();
            Parse.User.logOut();
            appNotificationsCounter.disable();

            $state.go('app.login');
          };

          $scope.checkUserActive = function () {
            if (!Parse.User.current()) {
              return;
            }
            Parse.User.current().fetch({
              success: function (user) {
                if (!user.get('active')) {
                  $scope.$apply(function () {
                    $scope.logOut();
                  });
                }
              }
            });
          };

          $scope.loadActiveGroupFeeds = function () {
            HttpUtils.getUserGroups(null, function (groups) {
              $scope.activeGroups = groups;
            });
          };

          $scope.refreshMenuData = function () {
            $scope.loadContentPages();
            $scope.loadActiveGroupFeeds();
            $scope.loadMenuItems();
          };


          $scope.initPhotoFullviewModal = function () {
            $rootScope.photoModal = null;

            $rootScope.photoModalService = {
              formatDate: Utils.formatDate,
              photos: [],
              category: '',
              like: function (photo) {
                if (this.category === 'group-feed') {
                  var pageScope = angular.element($('.page-group-feed')).scope();
                  if (!pageScope.isLiked(photo.post)) {
                    pageScope.likePost(photo.post);
                    photo.likeCount++;
                  }
                }
              },
              comment: function (photo) {
                $rootScope.photoModal.hide();
                if (this.category === 'event') {
                  $state.go('app.event-photo-comments', {photoId: photo.id});
                } else if (this.category === 'group-feed') {
                  $state.go('app.group-feed-detail', {postId: photo.post.id});
                }
              }
            };
            $ionicModal.fromTemplateUrl('templates/partials/modal-photoview.html', {
              id: 'viewphoto',
              scope: $rootScope,
              animation: 'slide-in-up'
            }).then(function (modal) {
              $rootScope.photoModal = modal;
            });

            $rootScope.$on('$destroy', function () {
              $rootScope.photoModal.remove();
            });

            $rootScope.$on('modal.shown', function (event, modal) {
              if (modal.id == 'viewphoto') {
                if (window.StatusBar) {
                  StatusBar.hide();
                }
                setTimeout(function () {
                  $('.modal-photoview').find('.modal-content')
                          .width($(document).width())
                          .height($(document).height());
                });
              }
            });

            $rootScope.$on('modal.hidden', function (event, modal) {
              if (modal.id == 'viewphoto') {
                if (window.StatusBar) {
                  StatusBar.show();
                }
              }
            });

            //init action popover
            $rootScope.photoActionsPopover = null;
            $ionicPopover.fromTemplateUrl('templates/partials/photoview-actions-popover.html', {
              scope: $rootScope
            }).then(function (popover) {
              $rootScope.photoActionsPopover = popover;
            });
            $rootScope.onSelectPhotoAction = function (action, e) {
              //alert(action);
              $rootScope.photoActionsPopover.hide();
            };
          };

          if (Parse.User.current()) {
            $scope.refreshMenuData();
          }

          $scope.initPhotoFullviewModal();
        });
