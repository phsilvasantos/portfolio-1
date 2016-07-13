angular.module('myApp.controllers')

        .controller('EditItemCtrl', function ($scope, $http, $stateParams, Utils, $ionicNavBarDelegate, AppConfig, $rootScope) {

          $scope.isCreatePage = ($stateParams.id)?$stateParams.id:'';
          
          $scope.selectedProduct = {};
          $scope.data = {};
          
          $scope.currency = AppConfig.currencySimbolString;
          
          Utils.hideIndicator();
          $scope.isValidForm = function(){
            return $scope.productForm.$valid;
          };

          $scope.save = function () {
            Utils.showIndicator();
            
            var callback = function (response) {
              if (response.status === 200) {
                $rootScope.$broadcast("productDataChanged");
                if($scope.isCreatePage){
                  //Utils.alert("Changed Success!");
//                  $state.go('app.clients', {cache: false}, {reload: true});                  
                }else{
                  //Utils.alert("Create Success!");
                  $scope.isCreatePage = response.data.Id;
                  $scope.selectedProduct = response.data;
                }
              } else {
                
              }
              Utils.hideIndicator();
            };
            
            if (!$scope.isCreatePage) {
              $http.post(AppConfig.endpoint + 'products/', $scope.selectedProduct).then(callback);
            } else {
              $http.put(AppConfig.endpoint + 'products/' + $scope.isCreatePage, $scope.selectedProduct).then(callback);
            }
            
          };
          
          $scope.goBack = function () {
            $ionicNavBarDelegate.back();
          };

          $scope.loadSelectedProduct = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + 'products/' + $scope.isCreatePage)
                    .then(function (response) {
                      var clientInfo = response.data;
                      $scope.selectedProduct = clientInfo;
                      
                      Utils.hideIndicator();
                    });
          };
          
          $scope.clearSearch = function () {
            $scope.data.searchQuery = '';
          };
          
          if ($scope.isCreatePage)
            $scope.loadSelectedProduct();
        });