angular.module('cleverbaby.controllers')
.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout',  'AuthService', '$location', '$rootScope',
    function ($scope, $ionicModal, $timeout, AuthService, $location, $rootScope) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/modals/menu.html', function(menu){
        $scope.menuModal = menu;
    });

    /**
     * Show the addActivity Modal
     */
    $scope.showAddActivityModal = function(){
		// make the floating-plus-button in index.html visible
        $rootScope.showPlusButton = true;
		// add the animatePlus class to ion-plus-round in floating-plus-button to animate + to x
		$rootScope.animatePlusButton = true;
        $scope.menuModal.show();
    };

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    $scope.logout = function () {
        AuthService.logout();
        $location.path('/auth/signin');
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
        /*
    $ionicModal.fromTemplateUrl('templates/modals/baby.html',function(baby){
        $scope.babyModal = baby;
    });

    $scope.newbaby = function(){
        $scope.babyModal.show();
    }; */
}]);
