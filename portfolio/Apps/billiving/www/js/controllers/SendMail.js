angular.module('myApp.controllers')

        .controller('SendMailCtrl', function ($scope, $http, $stateParams, Utils, AppConfig, $rootScope) {

          $scope.isID = ($stateParams.id) ? $stateParams.id : '';
          $scope.dataUrl = ($stateParams.dataurl) ? $stateParams.dataurl : '';

          $scope.isValidForm = function () {
            return $scope.sendmailForm.$valid;
          };
          Utils.hideIndicator();
          $scope.loadMailTemp = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + $scope.dataUrl + $scope.isID + '/mail')
                    .then(function (response) {
                      var mailTemp = response.data;
                      $scope.mailTemp = mailTemp;

                      Utils.hideIndicator();
                    });
          };

          $scope.send = function () {
            Utils.showIndicator();
            $http.post(AppConfig.endpoint + $scope.dataUrl + $scope.isID + '/mail', $scope.mailTemp)
                    .then(function (response) {
                      if ($scope.dataUrl == 'invoices/') {
                        $rootScope.$broadcast("invoiceDataChanged");
                      } else {
                        $rootScope.$broadcast("estimateDataChanged");
                      }
                      Utils.hideIndicator();
                    });
          };

          if ($scope.isID)
            $scope.loadMailTemp();
        });