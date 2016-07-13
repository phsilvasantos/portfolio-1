organizate.controller('MessageViewCtrl', function ($scope, $rootScope, $state, HelperService, LocalStorageService, FunctionService, AppConfig) {
  $rootScope.messagestate = true;
  $rootScope.gamestate = false;
  $rootScope.tabStatus = "message-detail";
  
  $scope.gameplyStatus = ['PENDING', 'IN', 'OUT']
  HelperService.getAllTeamsIN($rootScope.loginUserId).then(function (messagelist) {
    $scope.messagelist = messagelist;
    console.log('messagelist', messagelist);
  });
  
  $scope.changeDateTimeToDate = function (datetime) {
    return datetime = moment(new Date(datetime)).format(AppConfig.dateFormatString);
  }
  
  $scope.changeDate = function (timestamp) {
        var date = new Date(timestamp * 1);
        return  FunctionService.AddZero(date.getDate()) + "-" +
                FunctionService.AddZero(date.getMonth()+1) + "-" +
                FunctionService.AddZero(date.getFullYear()) + " " +
                FunctionService.AddZero(date.getHours()) + ":" +
                FunctionService.AddZero(date.getMinutes());
      }
  
  $scope.selectMessage = function (message) {
    $rootScope.selectedIndex = message.teamid;
    $rootScope.selectedGameIndex = message.gameid;
    $rootScope.selectedTeamName = message.name;
    console.log('message', message);
    $rootScope.selectedMessage = message;
    LocalStorageService.setGameInfo($rootScope.selectedGameIndex);
    LocalStorageService.setTeamInfo($rootScope.selectedIndex);

    var sendData = {messageid: message.id, acceptflag: 1, flag : 0};
    
    HelperService.changeMessageStatus(sendData).then(function (result) {
      $scope.teaminfo = result;
      $rootScope.unreadMessage = 0;
      for (var i = 0; i < result.length; i++) {
        if (result[i].read_flag == 0) {
          $rootScope.unreadMessage = $rootScope.unreadMessage + 1;
        }
      }
    });
    
    if (message.flag == 3) {
      $state.go('app.message-detail');
    } else if (message.flag == 4 || message.flag == 6 || message.flag == 1) {
      $state.go('app.special-message-pick', {'id': message});
    } else if (message.flag == 5) {
      $state.go('app.message-game-formation');
    } else {
      $state.go('app.message-pick', {'id': message.id});
    }

  };
});