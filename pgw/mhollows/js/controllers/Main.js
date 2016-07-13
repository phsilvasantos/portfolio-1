'use strict';

angular.module('gnApp.controllers', [])
        .controller('MainController', function ($scope, $rootScope, $state, AppConfig, Utils, chatService, $ionicSideMenuDelegate, appNotificationsCounter, $timeout, $interval, HttpUtils, $location, $ionicModal, $ionicPopover, $stateParams) {

          $scope.getRightMenuWidth = function () {
            if ($scope.messages.canDragRight()) {
              return $(document).width();
            }
            return 300;
          };

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
            console.log('INITIALIZE CHAT');
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
            $scope.shared.user.isPending = $scope.shared.user.get('status') === 'pending';
            $scope.shared.user.isAdmin = $scope.shared.user.get('admin');
            var profile = Parse.User.current().get('profile');
            profile.fetch({
              success: function (profile) {
                $scope.$apply(function () {
                  $scope.shared.user.profile = profile;
                });
              }
            });
            $rootScope.registerActivity();
            $interval.cancel($rootScope.sendActivity);
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

          $scope.shouldShowTabs = function () {
            return Parse.User.current() && !$scope.shared.user.isPending &&
                    !$state.includes('app.login') && !$state.includes('app.passcode')
                    && !$state.includes('app.messages-room') && !$state.includes('app.messages-new')
                    && !$state.includes('app.group-feed-new') && !$state.includes('app.group-feed-detail');
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

          $scope.loadFeatureSetting = function () {
            var query = new Parse.Query(Parse.Object.extend('FeatureSetting'));
            query.ascending('position');
            query.equalTo('status', true);
            query.find().then(function (results) {
              $scope.$apply(function () {
                $rootScope.chatEnabled = _.some(results, function(setting) { return setting.get('pageId') === 'messages'; });
                $scope.featureSetting = results;
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

          $scope.openContentPageWithTracking = function (url, name) {
            Utils.trackMixPanel("View Content Page", {
              "Name": name,
              "URL": url
            });

            $scope.openContentUrl(url);
          };

          $scope.openContentUrl = function (url) {
            var ref = appStateManager.openUrl(url);
          };

          $scope.logOut = function () {
            $interval.cancel($rootScope.sendActivity);
            notificationsService.sendParseConnectionStatus(false);
            Utils.trackMixPanel("Log Out");
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
                if (user.get('status') === 'inactive') {
                  $scope.$apply(function () {
                    $scope.logOut();
                  });
                } else {
                  $scope.setupUserInfo();
                }
              }
            });
          };

          $scope.loadActiveGroupFeeds = function () {
            HttpUtils.getUserGroups(null, function (groups) {
              $scope.activeGroups = _.sortBy(groups, function (item) {
                return item.get('name');
              });
            });
          };

          $scope.$on('joinedToGroup', function() {
            $scope.loadActiveGroupFeeds();
          })

          $scope.refreshMenuData = function () {
            $scope.loadContentPages();
            $scope.loadActiveGroupFeeds();
            $scope.loadMenuItems();
            $scope.loadFeatureSetting();
          };


          $scope.initPhotoFullviewModal = function () {
            $rootScope.photoModal = null;

            $rootScope.photoModalService = {
              formatDate: Utils.formatDate,
              photos: [],
              activeSlide: 0,
              category: '',
              like: function (photo) {
                if (this.category === 'group-feed') {
                  var pageScope = angular.element($('.page-group-feed')).scope();
                  if (!pageScope.isLiked(photo.post)) {
                    pageScope.likePost(photo.post);
                    photo.likeCount++;
                    photo.liked = true;
                    $rootScope.$broadcast('groupspace.feedLiked', photo.post);
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
              },
              viewPhoto: function (photos, index, category) {
                $rootScope.photoModalService.photos = photos;
                $rootScope.photoModalService.category = category;
                $rootScope.photoModal.show();
                Utils.showIndicator();
                $('.modal-photoview .slider-slides').css('opacity', 0);
                var _self = this;
                $timeout(function () {
                  _self.activeSlide = index || 0;
                  $timeout(function () {
                    $('.modal-photoview .slider-slides').animate({opacity: 1}, 500);
                    $('.modal-photoview .modal-content').removeClass('hide-caption');
                    Utils.hideIndicator();
                  }, 200);
                }, 300);
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
              var photo = $rootScope.photoModalService.photos[$rootScope.photoModalService.activeSlide];
              if (action === 'open-in') {
                if (window.ExternalFileUtil) {
                  ExternalFileUtil.openWith(photo.imageUrl, 'public.jpeg', {}, function () {
                    //alert('success');
                    $rootScope.photoActionsPopover.hide();
                  }, function () {
                    appStateManager.openUrl(photo.imageUrl);
                    $rootScope.photoActionsPopover.hide();
                  });
                } else {
                  appStateManager.openUrl(photo.imageUrl);
                  $rootScope.photoActionsPopover.hide();
                }
              } else if (action === 'save') {
                if (window.FileTransfer) {
                  var fileName = photo.imageUrl.split(/\//g).pop();
                  if(fileName.indexOf('.') === -1){
                    fileName += '.jpg';
                  }
                  var relativeFilePath = 'Download/' + fileName;
                  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                    var fileTransfer = new FileTransfer();
                    Utils.showIndicator();
                    fileTransfer.download(
                            photo.imageUrl,
                            // The correct path!
                            fileSystem.root.toURL() + '/' + relativeFilePath,
                            function (entry) {
                              Utils.alert('File has been saved in Download folder.');
                              $rootScope.photoActionsPopover.hide();
                              Utils.hideIndicator();
                            },
                            function (error) {
                              alert("Error during download. Code = " + error.code);
                              Utils.hideIndicator();
                            }
                    );
                  });
                }else{
                  alert('Could not find FileTransfer class!');
                }
              }
            };
          };

          $scope.setupUserInfo();

          if (window.applicationConfiguration['appVersion']) {
            $scope.versionNumber = window.applicationConfiguration['appVersion'];
            $scope.versionString = 'Version ' + $scope.versionNumber;
          } else {
            $scope.versionString = 'A Robots + Rockets App';
          }

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

          if (Parse.User.current()) {
            $scope.refreshMenuData();
          }

          $scope.initPhotoFullviewModal();

          // Keyboard hide event when click the elements except textboxs or inputs.
          $(document).off('click', '.view-container').on('click', '.view-container', function (e) {
            if (e.target.tagName.toLowerCase() != 'textarea' && e.target.tagName.toLowerCase() != 'input') {
              if(typeof (cordova) != 'undefined' && typeof (cordova.plugins.Keyboard) != 'undefined') {
                cordova.plugins.Keyboard.close();
              }
            }
          });
        });
