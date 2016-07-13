organizate.controller('GameFeedBackCtrl', function ($scope, $rootScope, $state, $ionicPopup, FunctionService, HelperService) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = true;
  $rootScope.tabStatus = "manage-game-macro";

  HelperService.getGameFromID($rootScope.selectedGameIndex).then(function (result) {
    $scope.tempArr = result;
    $scope.now = new Date(result.gamedate * 1);
    $scope.year = $scope.now.getFullYear();
    $scope.day = FunctionService.AddZero($scope.now.getDate());
    $scope.month = FunctionService.AddZero($scope.now.getMonth() + 1);
    $scope.hours = FunctionService.AddZero($scope.now.getHours());
    $scope.minute = FunctionService.AddZero($scope.now.getMinutes());
    $scope.timepart = FunctionService.getAfterPastTime($scope.now.getHours());
    $scope.saveVenue = false;
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

  $scope.cancelGame = function (param) {
    $scope.data = {reason: 'player'};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: ' <div><input type="radio" name="radiog_lite" id="radiorain" class="css-checkbox" ng-model="data.reason" value = "rain"/><label for="radiorain" class="css-label radGroup1">Rain</label></div>\n\
                        <div style="margin-top:25px;"><input type="radio" name="radiog_lite" id="radioplayer" class="css-checkbox" ng-model="data.reason" value = "player"/><label for="radioplayer" class="css-label radGroup1">We don\'t have enough players</label></div>\n\
                        <div style="margin-top:25px;"><input type="radio" name="radiog_lite" id="radioopp" class="css-checkbox" ng-model="data.reason" value = "opp"/><label for="radioopp" class="css-label radGroup1">Opponent does not have enough players</label></div>\n\
                        <div style="margin-top:25px;"><input type="radio" name="radiog_lite" id="radiomajeure" class="css-checkbox" ng-model="data.reason" value = "majeure"/><label for="radiomajeure" class="css-label radGroup1">Force majeure</label></div>',
      title: 'Select reason',
      subTitle: 'Please select the reason to cancel',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>OK</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.data.reason) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.reason;
            }
          }
        },
      ]
    });
    myPopup.then(function (res) {
      if (typeof res != 'undefined') {
        var senddata = {gameid: $rootScope.selectedGameIndex, reason: res};
        HelperService.cancelGame(senddata).then(function (messagelist) {
          $state.go('app.manage-game-macro');
        });
      }
    });
  };

  $scope.seeList = function (param) {
    $state.go('app.roster-member-message', {'id': param});
  };
  $scope.editOpponent = function () {
    $state.go('app.detail-game', {'id': $rootScope.selectedGameIndex});
  };
  $scope.editDatetime = function () {
    $state.go('app.create-game', {'id': $rootScope.selectedGameIndex});
  };
  $scope.changeDate = function (timestamp) {
    var date = new Date(timestamp * 1);
    return  FunctionService.AddZero(date.getMonth() + 1) + "-" +
            FunctionService.AddZero(date.getDate()) + "-" +
            FunctionService.AddZero(date.getFullYear()) + " " +
            FunctionService.AddZero(date.getHours()) + ":" +
            FunctionService.AddZero(date.getMinutes());
  };
}).controller('MessageDetailCtrl', function ($scope, $state, $rootScope, gpsService, HelperService, FunctionService) {
  $rootScope.messagestate = true;
  $rootScope.gamestate = false;
  $rootScope.tabStatus = "personal-team";
  if (google) {
    $rootScope.map = new google.maps.Map(document.getElementById("map"), $rootScope.mapOptions);
    gpsService.getGPSPosition();
  }
  $scope.messageStatus = {pending: 0, in: 0, out: 0};
  $scope.message_content = '';
  HelperService.getAllMessageStatus($rootScope.selectedGameIndex).then(function (messagelist) {
    $scope.messagelist = messagelist;
    for (var i = 0; i < messagelist.length; i++) {
      if (messagelist[i].message_content)
        $scope.message_content = messagelist[i].message_content;
      if (messagelist[i].accept_flag == 0)
        $scope.messageStatus.pending++;
      else if (messagelist[i].accept_flag == 1)
        $scope.messageStatus.in++;
      else
        $scope.messageStatus.out++;

    }
  });

  HelperService.checkGameLineUp($rootScope.selectedGameIndex).then(function (messagelist) {
    $scope.lineupStatus = messagelist;
  });

  HelperService.getGameFromID($rootScope.selectedGameIndex).then(function (result) {
    $scope.tempArr = result;
    console.log($scope.tempArr);
    $scope.now = new Date(result.gamedate * 1);
    $scope.year = $scope.now.getFullYear();
    $scope.day = FunctionService.AddZero($scope.now.getDate());
    $scope.month = FunctionService.AddZero($scope.now.getMonth() + 1);
    $scope.hours = FunctionService.AddZero($scope.now.getHours());
    $scope.minute = FunctionService.AddZero($scope.now.getMinutes());
    $scope.timepart = FunctionService.getAfterPastTime($scope.now.getHours());
    $scope.saveVenue = false;
    if (google) {
      if ($scope.tempArr.location_latitude) {
        $rootScope.myLatlng = new google.maps.LatLng($scope.tempArr.location_latitude, $scope.tempArr.location_longitude);
        $scope.saveVenue = true;
      }
      $rootScope.map.setCenter($rootScope.myLatlng);
    }
  });
  $scope.seeList = function (param) {
    $state.go('app.roster-member-message', {'id': param});
  };

});