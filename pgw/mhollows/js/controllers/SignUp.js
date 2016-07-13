'use strict';

angular.module('gnApp.controllers')
        .controller('SignUpController', function ($scope, $rootScope, Utils, $location, $ionicModal, $ionicSideMenuDelegate) {
          $ionicSideMenuDelegate.canDragContent(false);

          $scope.data = {};
          $scope.organizationName = '';
          try {
            $scope.organizationName = Utils.getConfig().get('organizationName');
          } catch (exc) {

          }

          $scope.isSaved = false;

          $scope.save = function () {
            Utils.showIndicator();
            Parse.Cloud.run('registerUser', $scope.data).then(function (response) {
              Utils.hideIndicator();
              $scope.isSaved = true;
              $scope.data.passcode = response;
            }, function (response) {
              Utils.hideIndicator();
              var alertText = typeof (response) === 'string' ? response : response.message;
              Utils.alert(alertText);
            });
          };

          $scope.takeIntoApp = function () {
            Utils.showIndicator();
            Parse.User.logIn($scope.data.phoneNumber, $scope.data.passcode, {
              success: function (user) {
                Utils.hideIndicator();
                window.identifyUser();
                Utils.trackMixPanel("Log In");

                window.subscribeUserToChannels();
                window.checkLatestVersion(false);

                $location.path('/home');
                $rootScope.$broadcast('userLoggedIn');
              },
              error: function (user, error) {
                Utils.hideIndicator();
                Utils.alert("Cannot process login.");
              }
            });
          };

          $scope.uploadProfilePhoto = function (base64Data) {
            if (base64Data) {
              Utils.showIndicator();

              var parseFile = new Parse.File('profilephoto.png', {base64: base64Data});
              parseFile.save().then(
                      function () {
                        Utils.hideIndicator();
                        $scope.$apply(function () {
                          $scope.data.picture = {name: 'profilephoto', url: parseFile.url()};
                        });
                      },
                      function (error) {
                        Utils.hideIndicator();
                        Utils.alert('Unable to save photo.', 'Error');
                      }
              );
            } else {
              Utils.alert('No new profile photo to save.');
            }
          };
          $scope.cropOption = {
            success : function (base64Data) {              
              $scope.uploadProfilePhoto(base64Data);
            }
          };

          $scope.$on('$ionicView.enter', function () {
            $scope.isFromMenu = $location.search().from === 'menu';
            $scope.data = {};
          });

        });
