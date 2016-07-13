angular.module('cleverbaby.controllers')
    .controller('MoreRateusFeedbackCtrl', ['$scope', '$timeout', '$state', '$cordovaSocialSharing', '$cordovaFacebook',
        function($scope, $timeout, $state, $cordovaSocialSharing, $cordovaFacebook) {

        	$scope.submit = function () {
        		// submit feedback
        		$scope.modalRateusFeedback.hide();
        	};

        	$scope.cancel = function () {
        		$scope.modalRateusFeedback.hide()
        	};
        }
    ]);
