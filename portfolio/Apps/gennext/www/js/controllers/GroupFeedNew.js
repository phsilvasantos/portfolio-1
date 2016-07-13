'use strict';

angular.module('gnApp.controllers')
        .controller('GroupFeedNewController', function ($scope, $timeout, Utils, $stateParams, $location, Mentions) {
          var self = this;

          $scope.groupId = $stateParams.groupId;
          $scope.group = new (Parse.Object.extend('Group'))();
          $scope.group.id = $scope.groupId;
          $scope.data = {
            images: [],
            body: ''
          };
          $scope.newPostText = '';

          $scope.messageInputChanged = function($event) {
            Mentions.watchIfMentionCalled($scope.data.body);
          }

          /** Mentions */
          this.mentionsUsers = [];

          this.usersForMentionsCb = function() {
            console.log('usersForMentionsCb', self.mentionsUsers, this);
            return self.mentionsUsers;
          }

          this.showMention = function() {
            return Mentions.displayMentionsList();
          }

          this.mentionUsersList = function() {
            return Mentions.getMentionUsersList();
          }

          this.addUserToMentions = function(user) {
            var self = this;
            $scope.data.body = Mentions.addUserToMentions(user, $scope.data.body, function() {});
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
          Mentions.initialize($('.feed-textbox'), this.usersForMentionsCb);
          /** End of Mentions */

          var feedTextInput = null;

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

          $(document).on('click', '.page.feed-new .btn-addimg, .page.feed-new #new_post_image', function () {
            $('.page.feed-new .feed-textbox').blur();
            try {
              cordova.plugins.Keyboard.close();
            } catch (exc) {
            }
          });

          $(document).off('change', '.page.feed-new #new_post_image').on('change', '.page.feed-new #new_post_image', function () {
            var file = this.files[0];
            //var reader = new FileReader();
            //reader.onload = function (e) {

            $.canvasResize(file, {
              width: 640,
              quality: 100,
              callback: function (content, width, height) {
                //var content = e.target.result;
                content = Utils.correctImageDataURI(content);
                var parseFile = new Parse.File(file.name, {base64: content});
                Utils.showIndicator();
                parseFile.save().then(function (response) {
                  Utils.hideIndicator();
                  $scope.$apply(function () {
                    $scope.data.images.push({id: (new Date().getTime()), name: 'postimage.png', url: response.url()});
                  });
                }, function (response) {
                  Utils.hideIndicator();
                  alert(JSON.stringify(response));
                });
                return true;
              }
            });
            //};
            //reader.readAsDataURL(file);
          });

          $scope.removeImage = function (imageId) {
            for (var k = 0; k < $scope.data.images.length; k++) {
              if ($scope.data.images[k].id === imageId) {
                $scope.data.images.splice(k, 1);
                break;
              }
            }
          };

          $scope.createPost = function () {
            if($scope.isSending){
              return;
            }
            $scope.isSending = true;
            Utils.showIndicator();
            Parse.Cloud.run('groupPost', {
              groupId: $scope.groupId,
              images: $scope.data.images,
              body: $scope.data.body,
              mentions: Mentions.formMentionedList()
            }, function (response) {
              $scope.isSending = false;
              Utils.hideIndicator();
              $location.path('/group-feed/' + $scope.groupId);
            });
          };

          $scope.getGroup();
        });
