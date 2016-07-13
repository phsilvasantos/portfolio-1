angular.module('cleverbaby.controllers')
    .controller('MoreInviteOthers2Ctrl', ['$scope', '$localStorage', '$state', '$stateParams', '$rootScope', 'shareData',
        function($scope, $localStorage, $state, $stateParams, $rootScope, shareData){
            $scope.baby = {
                name: shareData.name,
                birthday: shareData.birthday?moment(shareData.birthday).format("Do MMMM YYYY"):'',
                pin: shareData[$stateParams.type]
            };
        }]);