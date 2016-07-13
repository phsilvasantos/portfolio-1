organizate.controller('SelectMemberCtrl', function($scope, $rootScope, $state, HelperService) {
    $rootScope.messagestate = false;
    $rootScope.gamestate = false;
    $scope.isMembers = {};

//    HelperService.getRosterUser($rootScope.selectedIndex).then(function(result) {
//        $scope.rosterteaminfo = result;
//        for (var i = 0; i < $scope.rosterteaminfo.length; i++) {
//            $scope.isMembers[$scope.rosterteaminfo[i].rostername] = true;
//        }
//    });

    for (var i = 0; i < $rootScope.contactuser.length; i++) {
        $scope.isMembers[$rootScope.contactuser[i].rostername] = true;
    }
    $scope.selectUser = function(user) {
        if (!$scope.isMembers[user.rostername]) {
            $scope.isMembers[user.rostername] = true;
        } else {
            for (var i = 0; i < $rootScope.contactuser.length; i++) {
                if ($rootScope.contactuser[i].rostername == user.rostername) {
                    $scope.isMembers[user.rostername] = false;
                }
            }
        }
    };

    $scope.createRoster = function() {
        for (var i = 0; i < $rootScope.contactuser.length; i++) {
            var tempname = $rootScope.contactuser[i].rostername;

            if ($scope.isMembers[tempname]) {
                var senddata = {
                    'teamid': $rootScope.selectedIndex,
                    'rosterid': $rootScope.contactuser[i].id
                };
                HelperService.addTeamMember(senddata).then(function(result) {
                    $scope.rosterteaminfo = result;
                    for (var i = 0; i < $scope.rosterteaminfo.length; i++) {
                        $scope.isMembers[$scope.rosterteaminfo[i].rosterid] = true;
                    }
                });
            }
        }
        $rootScope.goToPage('app.manage-team');
    };
});