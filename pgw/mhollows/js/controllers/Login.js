'use strict';

angular.module('gnApp.controllers')
        .controller('LoginController', function ($scope, Utils, HttpUtils, $location, $ionicSideMenuDelegate, AppConfig, $filter) {
          $ionicSideMenuDelegate.canDragContent(false);

          if (Parse.User.current()) {
            setTimeout(function () {
              $location.path('/home');
            });
            return;
          }

          //define private functions
          function isSignupEnabled() {
            var signupEnabled = true;
            if ($scope.appConfig && $scope.appConfig.get) {
              var configVal = $scope.appConfig.get('signupEnabled');
              if (typeof (configVal) !== 'undefined') {
                signupEnabled = !(configVal === false || configVal === 'false');
              }
            }
            return signupEnabled;
          }

          //define public properties
          $scope.data = {};
          $scope.appConfig = Utils.getConfig();
          $scope.signupEnabled = isSignupEnabled();

          try {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true); // hide accessory bar by default
          } catch (e) {
          }

          AppConfig.config().then(function (config) {
            if (config.get('logoLarge')) {
              $scope.$apply(function () {
                $scope.appConfig = config;
                $scope.signupEnabled = isSignupEnabled();
              });
            }
          });

          $scope.isValidPhone = function () {
            var telnum = $scope.getActualPhoneNumber($('#telnum').val());
            var valid = false;
            if ((telnum.indexOf('+') === -1 && telnum.length === 10) ||
                    (telnum.indexOf('+') === 0 && telnum.length >= 12)) {
              valid = true;
            }

            return valid;
          };

          $scope.getActualPhoneNumber = function (num) {
            return String(num).replace(/[\(\)\s-_]/g, '');
          };

          $scope.handleInvalidPhone = function (isSubmit, phoneNum) {
            if (phoneNum)
              $scope.registerLoginAttempt(phoneNum, 'Invalid Phone');

            Utils.alert(
                    isSubmit ?
                    'Please enter a valid mobile phone number in order to recieve your passcode.' :
                    'Please enter a valid mobile phone number in order to enter your passcode.'
                    );
          };

          $scope.knownPin = function () {
            var phoneNum = $scope.getActualPhoneNumber($('#telnum').val());
            if ($scope.isValidPhone()) {
              Utils.showIndicator();
              $scope.checkPhoneNumberExisting(phoneNum, function () {
                Utils.hideIndicator();
                $location.path('/passcode/' + phoneNum);
              });
            }
            else {
              $scope.handleInvalidPhone(false);
            }
          };

          $scope.submit = function () {
            var phoneNum = $scope.getActualPhoneNumber($('#telnum').val());
            if ($scope.isValidPhone()) {
              Utils.showIndicator();
              $scope.checkPhoneNumberExisting(phoneNum, function () {
                $('#telnum').blur();
                HttpUtils.requestPin(phoneNum, function () {
                  $location.path('/passcode/' + phoneNum);
                });
              });
            } else {
              $scope.handleInvalidPhone(true);
            }
          };

          $scope.checkPhoneNumberExisting = function (phoneNum, callback) {
            var query = new Parse.Query(Parse.User);
            query.equalTo("username", phoneNum);  // find all the women
            query.count({
              success: function (response) {
                if (response > 0) {
                  callback(phoneNum);
                } else {
                  $scope.registerLoginAttempt(phoneNum, 'Phone number does not exist');
                  Utils.alert('Oops! We don\'nt recognize the mobile number you have just entered. ' +
                          'Please try again or Sign Up for access to the app.');
                }
              }
            });
          };

          $scope.onPhoneNumberChanged = function () {
            $('.contact-admin').attr('href', $scope.supportEmailURL());
          };

          $scope.supportEmailURL = function () {
            if (!$scope.appConfig) {
              return '';
            }
            var content =
                    ($scope.isValidPhone() ? 'Phone number: ' + $filter('actualPhoneNumber')($('#telnum').val()) + '\n' : '') +
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
