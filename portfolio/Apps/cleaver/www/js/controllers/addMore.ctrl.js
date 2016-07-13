angular.module('cleverbaby.controllers')
.controller('AddMoreCtrl', ['$scope','activityModals', '$rootScope', '$timeout', function ($scope, activityModals, $rootScope, $timeout) {

	$scope.closeModal=function(){
        $scope.modal.hide();
		$rootScope.animatePlusButton = false;
		$timeout(function(){ $rootScope.showPlusButton = false }, 200);
    };
	
    $scope.openModal = function(type){
        $scope.closeModal();
        activityModals.showModal(type);
    };

        /*
    $ionicModal.fromTemplateUrl('templates/modals/baby.html',function(baby){
        $scope.babyModal = baby;
    });
    $scope.newBaby = function(){
        $scope.modal.hide();
        $scope.babyModal.show();
    };
    */
}]);
