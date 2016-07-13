'use strict';

angular.module('myApp.services', [])
        .factory('Utils', function ($ionicLoading, $ionicPopup, AppConfig) {
          var UtilsSrv = {
            config: null,
            showIndicator: function () {
              window.iL = $ionicLoading;
              console.log('SHOW INDICATOR');
              $ionicLoading.show({
                template: '<span class="preloader preloader-white"></span>'
              });
            },
            hideIndicator: function () {
              $ionicLoading.hide();
            },
            alert: function (msg, title, callback) {
              title = title || AppConfig.appName;
              var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
              });
              if (callback) {
                alertPopup.then(function (res) {
                  callback();
                });
              }
            },
            confirm: function (msg, title, success, cancel) {
              var confirmPopup = $ionicPopup.confirm({
                title: title || AppConfig.appName,
                template: msg
              });
              confirmPopup.then(function (res) {
                if (res) {
                  if (success)
                    success();
                } else {
                  if (cancel)
                    cancel();
                }
              });
            },
            correctImageDataURI: function (dataURI) {
              //if mime type is not defined(specifically on samsung galaxy)
              if (/data:;?base64,/.test(dataURI)) {
                dataURI = dataURI.replace(/data:;?base64,/, 'data:image/jpeg;base64,');
              }
              return dataURI;
            },
            detectDevice: function (deviceType) {
              //Return boolean value according to deviceType
              var deviceInfo = window.navigator.userAgent;
              if (deviceInfo.toLowerCase().indexOf(deviceType) >= 0)
                return true
              else
                return false;
            }
          };

          return UtilsSrv;
        });
