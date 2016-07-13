organizate.controller('SelectTeamMemberCtrl', function ($scope, $state, $rootScope, $ionicPopup, $timeout, HelperService) {
    $rootScope.messagestate = false;
    $rootScope.gamestate = true;
    $rootScope.tabStatus = "create-game";
    $scope.isselectAll = false;
    $scope.isMembers = {};
    HelperService.getRosterUser($rootScope.selectedIndex).then(function (result) {
        $scope.teamMemberData = result;
    });

    $scope.selectMember = function (user) {
        if (!$scope.isMembers[user.rostername]) {
            $scope.isMembers[user.rostername] = true;
        } else {
            $scope.isMembers[user.rostername] = false;
        }
    };

    $scope.isSelected = function () {
      $scope.isselectAll = !$scope.isselectAll;
      if($scope.isselectAll)
        for(var i=0; i < $scope.teamMemberData.length; i++)
          $scope.isMembers[$scope.teamMemberData[i].rostername] = true;        
      else
        $scope.isMembers = {};
    }
    
    $scope.addUser = function(id) {
        $state.go('app.user-profile', {'id': 'selectteam'});
    };
    
    $scope.createGame = function () {
        for (var i = 0; i < $scope.teamMemberData.length; i++) {
            var tempname = $scope.teamMemberData[i].rostername;
            if ($scope.isMembers[tempname]) {
                var sendData = {gameid: $rootScope.selectedGameIndex, rosterid: $scope.teamMemberData[i].rosterid};
                HelperService.createGameRoster(sendData).then(function (result) {
                });
            }
        }
        $timeout(function() {
            $rootScope.loadingStatus = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Success!',
                template: 'Great, you have created a new game for your team, now you just have to await the teams feedback!'
            });
            alertPopup.then(function (res) {
                $rootScope.goToPage('app.manage-game-macro');
            });
        }, 3000);
        
    };

});