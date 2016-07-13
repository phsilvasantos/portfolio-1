organizate.controller('SpecificMessageCtrl', function($scope, $rootScope, HelperService) {
    $rootScope.messagestate = false;
    $rootScope.gamestate = true;  
    $rootScope.tabStatus = "game-home";
    
    $scope.message = {content : ""};
    $scope.messageFlagData = {};
    $scope.setflag = function(key){
        if($scope.messageFlagData[key]){
            $scope.messageFlagData[key] = false;
        }else{
            if(key == 'all') $scope.messageFlagData = {};
            else $scope.messageFlagData['all'] = false;
            $scope.messageFlagData[key] = true;
        }
    }
    $scope.sendSpecMessage = function(key){
        if($scope.message.content == "") {
            alert('Enter your message.');
            return;
        }
        var sendData = {teamid: $rootScope.selectedIndex, posts: $scope.messageFlagData, content : $scope.message.content};
        HelperService.sendSpecificMessage(sendData).then(function(result) {
            alert('Success to send your email.');
            $scope.message = {content : ""};
            $scope.messageFlagData = {};
            $rootScope.rosterinfo = result;
        });
    }
});