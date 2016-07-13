'use strict';

angular.module('gnApp.controllers')
        .controller('PasscodeController', function ($scope, $stateParams, HttpUtils, Utils, $location, $ionicSideMenuDelegate, AppConfig, $rootScope) {
          $ionicSideMenuDelegate.canDragContent(false);

          if (Parse.User.current()) {
            setTimeout(function () {
              $location.path('/home');
            });
            return;
          }

          $scope.data = {};
          $scope.data.telnum = $stateParams.tel;

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

          $scope.submit = function () {
            if ($('#passcode').val().length == 4) {
              Utils.showIndicator();
              Parse.User.logIn($scope.data.telnum, $scope.data.passcode, {
                success: function (user) {
                  Utils.hideIndicator();

                  if (user.get('status') !== 'active') {
                    Parse.User.logOut();
                    $location.path('/login');
                    var notificationText = 'This account has been suspended and cannot log in.';
                    if (user.get('status') === 'pending') {
                      notificationText = 'This account has not been approved yet and cannot log in.';
                    }
                    notificationText += 'Contact your organization\'s administrator for more information.';
                    if (window.device) {
                      navigator.notification.alert(
                              notificationText, // message
                              null,
                              user.get('status') === 'pending' ? 'Account in Pending' : 'Account Suspended',
                              'OK'
                              );
                    } else {
                      Utils.alert(notificationText);
                    }
                    return;
                  }

                  window.identifyUser();
                  if (window.mixpanel) {
                    window.mixpanel.track("Log In");
                  }

                  window.subscribeUserToChannels();
                  window.checkLatestVersion(false);

                  $location.path('/home');
                  $rootScope.$broadcast('userLoggedIn');
                },
                error: function (user, error) {
                  Utils.hideIndicator();
                  Utils.alert("Invalid username or password. Please try again.");
                }
              });

              $('#passcode').blur();
            } else {
              Utils.alert('Please enter 4 digit number.');
              $('#passcode').focus();
            }
          };

          $scope.resendPasscode = function () {
            HttpUtils.requestPin($scope.telnum, function () {
              Utils.alert('New passcode has been sent!');
              $('#passcode').val('');
            });
          };
        });