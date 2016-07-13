organizate.controller('ManageGameMacroCtrl', function ($scope, $rootScope, LocalStorageService, HelperService, FunctionService, Utils) {
    $rootScope.messagestate = false;
    $rootScope.gamestate = true;
    $rootScope.tabStatus = "manage-game-macro";
    $scope.isMembers = {};
    HelperService.getAllGames($rootScope.selectedIndex).then(function (gameinfo) {
        $rootScope.gameinfo = gameinfo;
        console.log(gameinfo);
        if (!gameinfo) {
//            Utils.confirm("Are you sure to make new game?","", function (res) {
//              $rootScope.goToPage('app.create-game');  
//            }, function () {
//              $rootScope.goToPage('app.game-home');
//            });
        }
    });
    $scope.selectGame = function (index) {
        $rootScope.selectedGameIndex = index;
        LocalStorageService.setGameInfo($rootScope.selectedGameIndex);
        $rootScope.goToPage('app.game-feedback');
    };
    $scope.changeDate = function (timestamp) {
        var date = new Date(timestamp * 1);
        return  FunctionService.AddZero(date.getDate()) + "-" +
                FunctionService.AddZero(date.getMonth()+1) + "-" +
                FunctionService.AddZero(date.getFullYear()) + " " +
                FunctionService.AddZero(date.getHours()) + ":" +
                FunctionService.AddZero(date.getMinutes());
    };
}).controller('PersonalGameHomeCtrl', function ($scope, $rootScope, HelperService, LocalStorageService, FunctionService) {
    $rootScope.messagestate = true;
    $rootScope.gamestate = false;
    $rootScope.tabStatus = "personal-team";
    $scope.tempData = [];

    HelperService.getAllYourGames($rootScope.selectedIndex).then(function (gameinfo) {
        $scope.tempData = gameinfo;
        console.log('tempData', $scope.tempData);
    });

    $scope.selectPersonalGame = function (id) {
        $rootScope.selectedGameIndex = id;
        LocalStorageService.setGameInfo($rootScope.selectedGameIndex);
        $rootScope.goToPage('app.message-detail');
    };

    $scope.editGamePaticipation = function (id) {
        $rootScope.selectedGameIndex = id;
        LocalStorageService.setGameInfo($rootScope.selectedGameIndex);
        $rootScope.goToPage('app.message-detail');
    };

    $scope.changeDate = function (timestamp) {
        var date = new Date(timestamp * 1);
        return  FunctionService.AddZero(date.getMonth()) + "-" +
                FunctionService.AddZero(date.getDate()) + "-" +
                FunctionService.AddZero(date.getFullYear()) + " " +
                FunctionService.AddZero(date.getHours()) + ":" +
                FunctionService.AddZero(date.getMinutes()) + " " +
                FunctionService.getAfterPastTime(date.getHours());
    };
});
