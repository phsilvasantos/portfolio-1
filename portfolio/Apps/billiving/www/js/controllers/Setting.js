angular.module('myApp.controllers')

        .controller('SettingCtrl', function ($scope, $http, Utils, AppConfig) {
          $scope.setting = Utils.getSettingData();
          $scope.currencies = Utils.getCurrencies();
          $scope.languages = Utils.getLanguages();
          $scope.dataformats = Utils.getDateFormats();
          Utils.hideIndicator();
          $scope.save = function () {
            Utils.showIndicator();

            var callback = function (response) {
              if (response.status === 200) {
                Utils.loadSettingData();
              } else {

              }
              Utils.hideIndicator();
            };

            $http.put(AppConfig.endpoint + 'settings', $scope.setting).then(callback);

          };
        });