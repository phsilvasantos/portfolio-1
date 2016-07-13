organizate.controller('DetailGameCtrl', function($scope, $rootScope, $stateParams, HelperService) {
    $scope.index = $stateParams.id;

    $rootScope.messagestate = false;
    $rootScope.gamestate = true;
    $rootScope.tabStatus = "create-game";
    $scope.changeFlag = 0;
    
    $scope.accept_flag = false;
    if (!$scope.index) {
        $scope.buttonTitle = "Pick team members to invite to game";
    } else {
        $rootScope.selectedGameIndex = $scope.index;
        $scope.changeFlag = 1;
        $scope.buttonTitle = "Change";
    }
    HelperService.getGameFromID($rootScope.selectedGameIndex).then(function(result) {
        if(result) $scope.lastGameData = result;
    });
    
    HelperService.getAllMessageStatus($rootScope.selectedGameIndex).then(function (messagelist) {
        $scope.messagelist = messagelist;
        for (var i = 0; i < messagelist.length; i++) {
            if (messagelist[i].accept_flag == 1)
                $scope.accept_flag = true;
        }
    });
//    $scope.lastGameData = $rootScope.gameinfo[$scope.index];
    $scope.saveGameDetail = function() {
        if(!$scope.lastGameData.opponentname){
            alert('Enter Opponent Team.');return;
        }
        if($scope.lastGameData.maxnumber*1 < 1){
            alert('Enter Max of Players.');return;
        }
        $scope.gamedetail = {
            "id": $rootScope.selectedGameIndex,
            "maxnumber": $scope.lastGameData.maxnumber,
            "opponentname": $scope.lastGameData.opponentname,
            "trigger_in": $scope.lastGameData.trigger_in,
            "changeflag": $scope.changeFlag,
            "trigger_out": $scope.lastGameData.trigger_out,
            "instruction": $scope.lastGameData.instruction,
        };
        HelperService.updateGameInfo($scope.gamedetail).then(function(result) {
            $rootScope.selectedGameIndex = result;
            if ($scope.buttonTitle != "Change")
                $rootScope.goToPage('app.select-team-member');
            else
                $rootScope.goToPage('app.game-feedback');
        });
    }
});