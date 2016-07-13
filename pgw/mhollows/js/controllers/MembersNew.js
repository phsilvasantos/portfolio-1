'use strict';

angular.module('gnApp.controllers')
        .controller('MembersNewController', function ($scope, $stateParams, Utils, $location, $ionicModal, $ionicScrollDelegate, $ionicPopover, $filter) {
          $scope.data = {};

          $scope.save = function () {
            Utils.showIndicator();
            Parse.Cloud.run('registerUser', $scope.data).then(function () {
              Utils.hideIndicator();
              Utils.alert(
                      'You have successfully added ' + $scope.data.firstName + ' ' + $scope.data.lastName + ' as a member of ' + Utils.getConfig().get('organizationName'),
                      null,
                      function () {
                        $location.url('/members/all?' + (new Date()).getTime());
                      }
              );
            }, function (response) {
              Utils.hideIndicator();
              var alertText = typeof (response) === 'string' ? response : response.message;
              Utils.alert(response);
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
          
          /* === Set photo cropper modal opeion === */
          $scope.cropOption = {
            success: function (base64Data) {              
              $scope.uploadProfilePhoto(base64Data);
            }
          };

          $scope.$on('$ionicView.enter', function () {
            $scope.isFromMenu = $location.search().from === 'menu';
            $scope.data = {};
          });

        });
