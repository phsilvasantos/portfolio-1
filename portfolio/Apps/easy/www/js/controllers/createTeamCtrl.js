organizate.controller('CreateTeamCtrl', function($scope, $rootScope, LocalStorageService, HelperService, Utils) {

    $rootScope.messagestate = false;
    $rootScope.gamestate = false;
    $scope.type = "eleven";
    
    $rootScope.contactuser = [];
    $rootScope.colorinfo = {'red': '#c71717', 'green': '#18cf00', 'pink': '#cf0061', 'blue': '#0005cf', 'purple': '#681fbb'};
    $scope.teamdetail = {
        "id": "",
        "name": "",
        "type": "eleven",
        "formation": $rootScope.formationinfo[$scope.type][0].type,
        "position": '',
        "kitcolor": $rootScope.colorinfo.red,
        "secondcolor": $rootScope.colorinfo.red,
        "shortcolor": $rootScope.colorinfo.red,
        "sockcolor": $rootScope.colorinfo.red,
        "member": [1, 2, 3, 4]
    };

    $scope.buttontitle = "Done creating, Import team members";
   
    $scope.createTeam = function() {
        if ($scope.teamdetail.name) {
            HelperService.createNewTeam($scope.teamdetail).then(function(result) {
                if(result)$rootScope.selectedIndex = result;
                LocalStorageService.setTeamInfo($rootScope.selectedIndex);
                $rootScope.goToPage('app.create-player');
                $rootScope.contactuser = [];
            });
        } else {
            Utils.alert("Enter Team Name.");
        }
    };
}).controller('EditTeamCtrl', function($scope, $rootScope, HelperService, LocalStorageService) {

    $rootScope.messagestate = false;
    $rootScope.gamestate = true;
    $rootScope.tabStatus = "game-home";
    $scope.type = "eleven";
    
    $rootScope.colorinfo = {'red': '#c71717', 'green': '#18cf00', 'pink': '#cf0061', 'blue': '#0005cf', 'purple': '#681fbb'};
    $scope.teamdetail = {
        "id": "",
        "name": "",
        "type": "eleven",
        "formation": $rootScope.formationinfo[$scope.type][0].type,
        "kitcolor": $rootScope.colorinfo.red,
        "secondcolor": $rootScope.colorinfo.red,
        "shortcolor": $rootScope.colorinfo.red,
        "sockcolor": $rootScope.colorinfo.red,
        "member": [1, 2, 3, 4]
    };
    
    HelperService.getTeamById($rootScope.selectedIndex).then(function(result) {
        console.log('formationinfo', result);
        $scope.teamdetail = result;
    });

    $scope.updateTeam = function() {
        if ($scope.teamdetail.name) {
            HelperService.updateTeamInfo($scope.teamdetail).then(function(result) {
                if(result)$rootScope.selectedIndex = result;
                LocalStorageService.setTeamInfo($rootScope.selectedIndex);
                $rootScope.goToPage('app.manage-game-macro');
            });
        } else {
            alert("Enter Team Name.");
        }
    };
    $scope.changeKitColor = function(val) {
        $scope.teamdetail.kitcolor = val;
    };
    $scope.changeSecondaryColor = function(val) {
        $scope.teamdetail.secondcolor = val;
    };
    $scope.changeShortsColor = function(val) {
        $scope.teamdetail.shortcolor = val;
    };
    $scope.changeSocksColor = function(val) {
        $scope.teamdetail.sockcolor = val;
    };
    $scope.$watch('teamdetail.formation', function(newValue, oldValue) {
        var tempFormation = $rootScope.formationinfo[$scope.teamdetail.type];
        for (var i = 0; i < tempFormation.length; i++) {
            if (tempFormation[i].type == $scope.teamdetail.formation) {
                $scope.teamdetail.position = tempFormation[i].positions;
                break;
            }
        }
    });
});