'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedNewController', function ($scope, $ionicScrollDelegate, FileTypeIcons, Utils, $stateParams,
            $location, Mentions, $rootScope, $timeout, $state, fileUploader, Linkify) {
          var self = this;

          if (cordova != undefined && cordova.plugins != undefined) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
          }

          $scope.groupId = $stateParams.groupId;
          $scope.isMentionList = false;
          $scope.group = new (Parse.Object.extend('Group'))();
          $scope.group.id = $scope.groupId;
          $scope.isEdit = false;
          $scope.data = {
            images: [],
            body: ''
          };
          $scope.newPostText = '';

          $scope.messageInputChanged = function ($event) {
            Mentions.watchIfMentionCalled($scope.data.body);
            $scope.isMentionList = Mentions.displayMentionsList();
            $ionicScrollDelegate.$getByHandle('feed-posting-mentions').scrollTop();
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
            $scope.data.body = Mentions.addUserToMentions(user, $scope.data.body, function () {
              $scope.isMentionList = Mentions.displayMentionsList();
            });
          };

          this.prepareMentionsData = function () {
            var query = new Parse.Query(Parse.User);
            query.limit(1000);
            query.include('profile');
            query.ascending('firstName');
            self.mentionsUsers = [];
            query.find().then(function (members) {
              self.mentionsUsers = members;
              //console.log('LOAD USERS FOR MEMBERS', members);
            });
          };

          this.prepareMentionsData();
          Mentions.reset();
          Mentions.initialize($('.feed-textbox'), this.usersForMentionsCb);
          /** End of Mentions */

          $scope.getGroup = function () {
            var query = new Parse.Query(Parse.Object.extend('Group'));
            query.get($scope.groupId).then(function (group) {
              $scope.$apply(function () {
                $scope.group = group;
              });
            });
          };

          $scope.isValidForm = function () {
            return $scope.data.body !== '' || $scope.data.images.length > 0;
          };

          function isKB() {
            return typeof (cordova) !== 'undefined' && typeof (cordova.plugins.Keyboard) !== 'undefined';
          }


          $(document).on('click', '.page.feed-new', function (e) {
            if (!isKB() && e.target.tagName.toLowerCase() !== 'textarea') {
              $('.page.feed-new .feed-textbox').blur();
              try {
                cordova.plugins.Keyboard.close();
              } catch (exc) {
              }
            }

          });


          // Set options for image-uploader directive.
          $scope.uploadOption = {
            success: function (parseFile) {
              console.log(parseFile);
              Utils.showIndicator();
              parseFile.save().then(function (response) {
                Utils.hideIndicator();
                $scope.$apply(function () {
                    $scope.data.images.push({id: (new Date().getTime()), name: parseFile.name(), contentType: 'image/jpeg', url: response.url()});
                });
              }, function (response) {
                Utils.hideIndicator();
                alert(JSON.stringify(response));
              });
            }
          };

          $scope.removeImage = function (fileUrl) {
            for (var k = 0; k < $scope.data.images.length; k++) {
              if ($scope.data.images[k].fileUrl === fileUrl) {
                $scope.data.images.splice(k, 1);
                break;
              }
            }
          };

          $scope.createPost = function () {
            if ($scope.isSending) {
              return;
            }
            // when click post button, if keyboard was appeared on display, hide it and show the main menu.

            $scope.isSending = true;
            Utils.showIndicator('groupFeedNew:createPost');
            fileUploader.uploadLinks(Linkify.fetchLinks($scope.data.body), function(files) {
              Parse.Cloud.run('groupPostV2', {
                groupId: $scope.groupId,
                files: $scope.data.images,
                body: $scope.data.body,
                mentions: Mentions.formMentionedList()
              }, function (response) {
                Utils.trackMixPanel("Member added a post", {
                  "Group ID": $scope.groupId,
                  "Group Name": $scope.group.get('name'),
                  "Post Content": $scope.data.body
                });

                $scope.isSending = false;
                Utils.hideIndicator('groupFeedNew:createPost');
                $location.path('/group-feed/' + $scope.groupId);
                $rootScope.$broadcast('groupspace.feedCreated', $scope.groupId, response);
              });
            })
          };
          // Edit / Unedit toggle
          $scope.editMessage = function () {
            $scope.isEdit = !$scope.isEdit;
            ionic.DomUtil.ready(function () {
              if ($scope.isEdit) {
                $('.feed-textbox').focus();
              } else {
                $('.feed-textbox').blur();
              }
            });

          };

          // Editable variable is set false
          $scope.onHideKeyboard = function () {
            $scope.isEdit = false;
          };
          // Customized back button.
          $scope.back = function () {
            $scope.onHideKeyboard();
            window.history.back();
          };

          window.addEventListener('native.keyboardshow', function (e) {
            $scope.isEdit = true;
          });

          window.addEventListener('native.keyboardhide', function (e) {
            if (!$state.includes('app.group-feed-new') || $scope.shared.devicePlatform !== 'android') {
              return;
            }
            $scope.onHideKeyboard();
          });

          this.takePhoto = function() {
            fileUploader.takePhoto()
          }

          this.useExistingPhoto = function() {
            fileUploader.useExistingPhoto();
          }

          this.showPhotoModal = function() {
            console.log('MODAL');
            $scope.modal.show();
          }

          this.selectFile = function(file) {
            console.log(file);
            $scope.$apply(function () {
              $scope.data.images.push(file);
            })
          }

          $scope.isPicture = function (item) {
            return item.contentType && item.contentType.indexOf('image/') === 0;
          };

          $scope.getFileTypeClass = function (item) {
            var ext = '';
            var contentType = item.contentType;
            if (contentType) {
              var ary = contentType.split('/');
              ext = ary.length > 1 ? ary[ary.length - 1] : contentType;
              if (contentType === 'text/plain') {
                ext = 'txt';
              }
            }
            return FileTypeIcons[ext] ? 'flaticon-' + FileTypeIcons[ext] : 'svg-icon clip-white';
          };

          fileUploader.initialize($scope, this, this.selectFile, {camera: 'disabled', library: 'disabled'});

          $scope.getGroup();
        });
