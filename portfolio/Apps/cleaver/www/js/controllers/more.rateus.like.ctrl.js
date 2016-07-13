angular.module('cleverbaby.controllers')
    .controller('MoreRateusLikeCtrl', ['$scope', '$timeout', '$state', '$cordovaSocialSharing', '$cordovaFacebook',
        function($scope, $timeout, $state, $cordovaSocialSharing, $cordovaFacebook) {

            $scope.yes = function () {
            	// user likes this app
            	$scope.modalRateusLike.hide();
            	$scope.modalRateusRate.show();
        	};

        	$scope.no = function () {
        		$scope.modalRateusLike.hide();
            	$scope.modalRateusFeedback.show();
        	};
        }
    ]);
