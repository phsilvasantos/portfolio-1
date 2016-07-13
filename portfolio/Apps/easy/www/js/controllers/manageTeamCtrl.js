organizate.controller('ManageTeamCtrl', function ($scope, $rootScope, LocalStorageService, HelperService, $ionicPopup) {
    $rootScope.messagestate = false;
    $rootScope.gamestate = false;

    HelperService.getAllTeams($rootScope.loginUserId).then(function (teaminfo) {
        $scope.teaminfo = teaminfo;
        if (!teaminfo) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'There is no any team',
                template: 'Are you sure you want to create new team?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $rootScope.goToPage('app.create-team');
                } else {
                    $rootScope.goToPage('app.home-page');
                }
            });
        }
    });

    $scope.selectTeam = function (team) {
        $rootScope.selectedIndex = team.id;
        $rootScope.positiondata = {latitude: team.venue_lat, longitude:team.venue_long, locationname:team.venue_locationname};
        LocalStorageService.setTeamInfo($rootScope.selectedIndex);
        $rootScope.goToPage('app.manage-game-macro');
    }
}).controller('PersonalManageTeamCtrl', function ($scope, $rootScope, LocalStorageService, HelperService) {
    $rootScope.messagestate = false;
    $rootScope.gamestate = false;
    $scope.teaminfo = [];
    HelperService.getAllTeamsIN($rootScope.loginUserId).then(function (teaminfo) {
        $rootScope.unreadMessage = 0;
        $scope.teamIdinfo = {};
        for (var i = 0; i < teaminfo.length; i++) {
            if (teaminfo[i].read_flag == 0) {
                $rootScope.unreadMessage = $rootScope.unreadMessage + 1;
            }
            if (!$scope.teamIdinfo[teaminfo[i].teamid]) {
                $scope.teamIdinfo[teaminfo[i].teamid] = true;
                $scope.teaminfo.push(teaminfo[i]);
            }

        }
    });
    $scope.selectPersonalTeam = function (team) {
        $rootScope.selectedIndex = team.teamid;
        $rootScope.selectedTeamName = team.name;
        LocalStorageService.setTeamInfo($rootScope.selectedIndex);
        $rootScope.goToPage('app.personal-game-home');
    }
});