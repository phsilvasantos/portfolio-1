angular.module('cleverbaby.controllers')
    .controller('MoreInviteOthersCtrl', ['$scope', '$localStorage', '$state', '$stateParams', '$rootScope', 'userList', 'BabyService',
        function($scope, $localStorage, $state, $stateParams, $rootScope, userList, BabyService) {

            $scope.selectedBaby = $localStorage.babies[$rootScope.babyId];
            $scope.removeUser = function(index){
                var id = $scope.userList[index].id;
                $scope.userList.splice(index, 1);
                BabyService.deleteUserFromBaby($scope.selectedBaby.uuid, id).then(function(){
                });
            };

            var babies = [];
            for(var key in $localStorage.babies){
                if($localStorage.babies.hasOwnProperty(key)){
                    if($localStorage.babies[key].permission == '1'){
                        babies.push($localStorage.babies[key]);
                    }
                }
            }

            $scope.babies = babies;

            $scope.invite = function(type){
                $state.go('app.inviteothers2', {
                    uuid: $scope.selectedBaby.uuid,
                    type: type
                });
            };

            $scope.changeSelectedBaby = function (selectedBaby) {
                $scope.userList = [];
                $scope.selectedBaby = selectedBaby;
                return BabyService.getUsersList($rootScope.babyId).then(function(userlist){
                    $scope.userList = userlist.data.filter(function(x){
                        return x.user_id != $localStorage.user.id;
                    });
                });
            };

            //$rootScope.allowInviteOthers = $rootScope.allowInviteOthers ? $rootScope.allowInviteOthers : false;
            var firstIndexAchieved = false;
            angular.forEach($scope.babies, function(baby, index){
                if(!firstIndexAchieved){
                    $scope.selectedBaby = baby;
                    firstIndexAchieved = true;
                }
            });
            /*
            $scope.hasBaby = $stateParams.uuid ? true : false;

            if($scope.hasBaby){
                $scope.selectedBaby = $scope.babies[$stateParams.uuid];
                $scope.selectedBabyBday = moment($scope.selectedBaby.birthday).format("Do MMMM YYYY")
                $scope.selectedBabyPin = Math.floor(Math.random() * moment($scope.selectedBaby.birthday));
            }else{
                //todo workaround to get the first index of the object

            }*/
        }
    ]);
