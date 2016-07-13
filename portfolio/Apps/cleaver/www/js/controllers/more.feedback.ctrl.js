angular.module('cleverbaby.controllers')
    .controller('MoreFeedbackCtrl', ['$scope', '$ionicHistory', '$state', '$cordovaSocialSharing', '$cordovaFacebook',
        function($scope, $ionicHistory, $state, $cordovaSocialSharing, $cordovaFacebook) {

            $scope.submit = function() {
                $scope.feedbacktext;
                $scope.emailtext;
                //myForm.submit();
            };


            $scope.cancel = function () {
            	$state.go('app.more');
            };

        }
    ]);
