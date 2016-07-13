angular.module('cleverbaby.controllers')
    .controller('MoreActivateBabyAccessPinCtrl', ['$scope', '$state', '$rootScope', 'BabyService', '$ionicHistory', 'NotificationService',
        function($scope, $state, $rootScope, BabyService, $ionicHistory, NotificationService) {
            $scope.data = {};
            $scope.submitBabyAccessPin = function(){
                BabyService.acceptPin($scope.data.pin, $scope.data.name, $scope.data.birthday).then(function(baby){

                    $rootScope.setBaby(baby);

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                    $state.go('app.diary');
                }, function(response){
                    NotificationService.notify(response.data.message);
                });
            }
        }
    ]);
