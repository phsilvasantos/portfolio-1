angular.module('cleverbaby.controllers')
.controller('MenuCtrl', ['$scope', '$rootScope', '$ionicModal', 'activityModals', '$timeout', '$ionicClickBlock', function ($scope, $rootScope, $ionicModal, activityModals, $timeout, $ionicClickBlock) {

	$scope.closeModal=function(){
		// $scope.modal.hide();

		$scope.modal.hide().then(function(){
			// this would be the better way to hide the plus button, but its bit slower, so i prefer the hardcoded way below
			// $rootScope.showPlusButton = false
		});

		if ($scope.addMoreModal.isShown()){
           // dont hide the floating-plus-button because we want to keep showing it on the addMoreModal
        } else {
		// start animation from x to +
           $rootScope.animatePlusButton = false;
		   // and then hide the button after 200 ms, once https://github.com/driftyco/ionic/issues/2342#issuecomment-70394107 is fixed we can get rid of the hardcoded 200ms and listen for animation finish to hide the button
		   // found a better solution to use the promise that is returned after modal.hide() is finished, see above, but its bit slower, so sticking with the below for the moment
		   $timeout(function(){
            $rootScope.showPlusButton = false;
            $ionicClickBlock.hide();
            }, 200);
        }
    };

    $ionicModal.fromTemplateUrl('templates/modals/addMore.html',function(addmore){
        $scope.addMoreModal = addmore;
    });
    $scope.addMore = function(){
        //$rootScope.activatePlus = true;
        //$scope.modal.hide();
        $scope.addMoreModal.show();
    };

    $scope.newBottle = function(){
    	$scope.modal.hide();
        $scope.bottleModal.show();
    };

    $scope.openModal = function(type){
        $rootScope.hidePlusBtn = true;
        //$scope.closeModal();
        console.log('narek');
        activityModals.showModal(type);
    };
}]);
