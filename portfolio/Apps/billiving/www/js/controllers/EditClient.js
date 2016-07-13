angular.module('myApp.controllers')

        .controller('EditClientCtrl', function ($scope, $state, $http, $stateParams, Utils, $ionicNavBarDelegate, AppConfig, $ionicModal, $rootScope) {

          $scope.isCreatePage = ($stateParams.id)?$stateParams.id:'';
          
          $scope.selectedClient = {};
          $scope.data = {};
          $scope.dues = Utils.getDues();
          $scope.taxes = Utils.getTaxes();
//          console.log($scope.taxes);
          $scope.selectedClient.Due = 0;

          $scope.isValidForm = function(){
            return $scope.clientForm.$valid;
          };
          Utils.hideIndicator();
          
          $scope.save = function () {
            Utils.showIndicator();
            
            var callback = function (response) {
              if (response.status === 200) {
                $rootScope.$broadcast("clientDataChanged");
                if($scope.isCreatePage){
                  //Utils.alert("Success!");
//                  $state.go('app.clients', {cache: false}, {reload: true});                  
                }else{
                  //Utils.alert("Success!");
                  $scope.isCreatePage = response.data.Id;
                }
              } else {
                if(response.data.length == 1)Utils.alert(response.data[0].Value);
                else Utils.alert(response.data);
              }
              Utils.hideIndicator();
            };
            
            if (!$scope.isCreatePage) {
              $http.post(AppConfig.endpoint + 'clients/', $scope.selectedClient).then(callback);
            } else {
              $http.put(AppConfig.endpoint + 'clients/' + $scope.isCreatePage, $scope.selectedClient).then(callback);
            }
            
          };
          
          $scope.goBack = function () {
            $ionicNavBarDelegate.back();
          };

          $scope.loadSelectedClient = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + 'clients/' + $scope.isCreatePage)
                    .then(function (response) {
                      var clientInfo = response.data;
                      $scope.selectedClient = clientInfo;
                      
                      //Change valid value for select tag
                      if(!$scope.selectedClient.Due) $scope.selectedClient.Due = 0;
//                      if(!$scope.selectedClient.TaxId) $scope.selectedClient.TaxId = 0;
//                      $scope.selectedClient.TaxId *= 1;
                      //
                      Utils.hideIndicator();
                    });
          };
          
          // Open Client list modal when click Client Name field
          $scope.editCountry = function () {
            $ionicModal.fromTemplateUrl('templates/partials/select-country.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
              $scope.data.searchQuery = $scope.selectedClient.Country;
              $scope.loadCountry();
            });
          }
          
          $scope.clearSearch = function () {
            $scope.data.searchQuery = '';
          };
          
          // Get Client List with search value.
          $scope.loadCountry = function () {            
            $scope.countries = Utils.getCountries();
          };

          $scope.select = function (country) {
            alert(country.Id);
            $scope.selectedClient.Country = country.Name;
            $scope.selectedClient.CountryId = country.Id;
            $scope.modal.hide();
          }

          if ($scope.isCreatePage)
            $scope.loadSelectedClient();
          $scope.loadCountry();
        });
