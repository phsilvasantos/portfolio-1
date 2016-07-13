organizate.controller('MessagePickCtrl', function($scope, $state, $rootScope, $stateParams, HelperService, gpsService) {
    $rootScope.messagestate = true;
    $rootScope.gamestate = false; 
    $rootScope.tabStatus = "message-detail";
    
    $scope.messageid = $stateParams.id;
    $scope.gamedate = '';
    if (google) {
        $rootScope.map = new google.maps.Map(document.getElementById("map"), $rootScope.mapOptions);
        gpsService.getGPSPosition();
    }
    HelperService.getGameFromID($rootScope.selectedGameIndex).then(function(result) {
        $scope.lastGameData = result;
        var date = new Date(result.gamedate*1);
        $scope.gamedate = date.toGMTString();
        if (google) {
            if ($scope.lastGameData.location_latitude) {
                $rootScope.myLatlng = new google.maps.LatLng($scope.lastGameData.location_latitude, $scope.lastGameData.location_longitude);
            }
            $rootScope.map.setCenter($rootScope.myLatlng);
        }
    });
    $scope.messageStatus = {pending: 0, in: 0, out: 0};
    HelperService.getAllMessageStatus($rootScope.selectedGameIndex).then(function (messagelist) {
        $scope.messagelist = messagelist;
        for (var i = 0; i < messagelist.length; i++) {
            if (messagelist[i].accept_flag == 0)
                $scope.messageStatus.pending++;
            else if (messagelist[i].accept_flag == 1)
                $scope.messageStatus.in++;
            else
                $scope.messageStatus.out++;

        }
    });
    
    $scope.changAcceptFlag = function(flag){
        var sendData = {messageid:$scope.messageid, acceptflag:flag, flag : 1};
        if($scope.messageStatus.in >= $scope.lastGameData.maxnumber){
            alert('Sorry, no more players can sign up to play in this game');
            return;
        }
        
        HelperService.changeMessageStatus(sendData).then(function(result) {
            $scope.teaminfo = result;
            $rootScope.unreadMessage = 0;
            for(var i = 0; i < result.length; i++){
                if(result[i].read_flag == 0){
                    $rootScope.unreadMessage=$rootScope.unreadMessage+1;
                }
            }
            $state.go('app.message-view');
        });
    }
}).controller('SpecialMessagePickCtrl', function($scope, $state, $rootScope, $stateParams, HelperService, gpsService) {
    $rootScope.messagestate = true;
    $rootScope.gamestate = false; 
    $rootScope.tabStatus = "message-detail";
});