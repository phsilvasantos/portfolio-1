'use strict';

angular.module('gnApp.controllers')
        .controller('LoginController', function ($scope, Utils, HttpUtils, $location, $ionicSideMenuDelegate, AppConfig) {
          $ionicSideMenuDelegate.canDragContent(false);

          if (Parse.User.current()) {
            setTimeout(function () {
              $location.path('/home');
            });
            return;
          }

          $scope.data = {};

          try {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true); // hide accessory bar by default
          } catch (e) {
          }

          AppConfig.config().then(function (config) {
            if (config.get('logoLarge')) {
              $scope.$apply(function () {
                var logoLargeURL = config.get('logoLarge').url();
                var cssPropertyValue = "url('" + logoLargeURL + "');";
                $('.logo').attr('style', 'background-image:' + cssPropertyValue);
                $scope.appConfig = config;
              });
            }
          });

          $scope.isValidPhone = function () {
            return $scope.getActualPhoneNumber($('#telnum').val()).length == 10;
          };

          $scope.getActualPhoneNumber = function (num) {
            return String(num).replace(/[\(\)\s-_]/g, '');
          };

          $scope.handleInvalidPhone = function (isSubmit) {
            Utils.alert(
                    isSubmit ?
                    'Please enter a valid, 10-digit mobile phone number in order to recieve your passcode.' :
                    'Please enter a valid, 10-digit mobile phone number in order to enter your passcode.'
                    );
            $('#telnum').focus();
          };

          $scope.knownPin = function () {
            if ($scope.isValidPhone()) {
              $location.path('/passcode/' + $scope.getActualPhoneNumber($('#telnum').val()));
            }
            else {
              $scope.handleInvalidPhone(false);
            }
          };

          $scope.submit = function () {
            var phoneNum = $scope.getActualPhoneNumber($('#telnum').val());
            if ($scope.isValidPhone()) {
              $('#telnum').blur();
              HttpUtils.requestPin(phoneNum, function () {
                $location.path('/passcode/' + phoneNum);
              });
            } else {
              $scope.handleInvalidPhone(true);
            }
          };

          $scope.onPhoneNumberChanged = function () {
            $('.contact-admin').attr('href', $scope.supportEmailURL());
          };

          $scope.supportEmailURL = function () {
            if (!$scope.appConfig) {
              return '';
            }
            var content =
                    ($scope.isValidPhone() ? 'Phone number: ' + $('#telnum').val() + '\n' : '') +
                    (window.applicationConfiguration['appVersion'] ? 'App version: ' + window.applicationConfiguration['appVersion'] + '\n' : '') +
                    'OS: ' + navigator.platform;

            var url = 'mailto:' + $scope.appConfig.get('administratorEmail');
            url += '?subject=' + encodeURIComponent('Problem with my login') +
                    '&body=' + encodeURIComponent(content);
            return url;
          };

          $scope.maskPhoneNumberInput = function () {
            setTimeout(function () {
              if ($scope.shared.devicePlatform !== 'android') {
                //$("#telnum").mask("(999) 999-9999");
              }
            }, 300);
          };

          $scope.$on("devicePlatformLoaded", function (event, args) {
            $scope.maskPhoneNumberInput();
          });

          if ($scope.shared.devicePlatform) {
            $scope.maskPhoneNumberInput();
          }

        });
