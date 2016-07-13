angular.module('cleverbaby.controllers')
    .controller('MoreRateusRateCtrl', ['$scope', '$timeout', '$state', '$cordovaSocialSharing', '$cordovaFacebook',
        function($scope, $timeout, $state, $cordovaSocialSharing, $cordovaFacebook) {

        	$scope.yes = function () {
        		$scope.modalRateusRate.hide();
        	};

        	$scope.no = function () {
        		$scope.modalRateusRate.hide();
        	};
        }
    ]);
