angular.module('cleverbaby.controllers')
.controller('DropdownCtrl', ['$scope', '$ionicModal', 'BabyModal', '$rootScope', '$localStorage',
        function ($scope, $ionicModal, BabyModal, $rootScope, $localStorage) {

        $scope.storage = $localStorage;

        $scope.newBaby = function(baby){
            BabyModal.showModal(baby);
			$scope.modal.hide();
        };
        $scope.select = function(baby){
            $rootScope.setBaby(baby);
            $scope.modal.hide();
        };
        $scope.cancel = function(){
            $scope.modal.hide();
        };
}]);
