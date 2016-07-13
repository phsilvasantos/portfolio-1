organizate.controller('GameFormationCtrl', function ($scope, $rootScope, $http, LocalStorageService, HelperService) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = true;
  $rootScope.tabStatus = "manage-game-macro";

  $scope.init = function () {
    $scope.userselected = {};
    $scope.postData = {};
    $scope.selectedUser = "";
    $scope.teamformation = "";
    $scope.type = 'eleven';

    $scope.tempUserFlagArr = {};
    $http.get('json/formationinfo.json').success(function (formationinfo) {
      $scope.formationinfo = formationinfo;
      $scope.formations = $scope.formationinfo[$scope.type];
    });
    $http.get('json/positioninfo.json').success(function (positioninfo) {
      $scope.positioninfo = positioninfo;
    });
    HelperService.getGameFromID($rootScope.selectedGameIndex).then(function (result) {
      $scope.templeteArr = result;
    });
  };

  $scope.init();
  HelperService.getInningUserFromGameID($rootScope.selectedGameIndex).then(function (result) {
    if (result) {
      $scope.members = result;
      $scope.teamformation = result[0].formation;
      $scope.type = result[0].type;
      $scope.formations = $scope.formationinfo[$scope.type];
      $scope.positions = $scope.positioninfo[result[0].formation];
      for (var i = 0; i < $scope.members.length; i++) {
        if ($scope.members[i].position < 20) {
          $scope.tempUserFlagArr[$scope.members[i].id] = true;
          $scope.positions[$scope.members[i].position].user = $scope.members[i];
          $scope.postData[$scope.members[i].id] = [$scope.members[i].position, $scope.members[i].flag1];
          console.log('member', $scope.postData);
        } else {
          $scope.tempUserFlagArr[$scope.members[i].id] = false;
        }
      }
    }
  });

  $scope.formationClick = function (type) {
    $scope.init();
    var backupdata = $scope.positions;
    $scope.teamformation = type;
    $scope.positions = $scope.positioninfo[type];
  }

  $scope.typeClick = function (type) {
    $scope.init();
    $scope.type = type;
    $scope.formations = $scope.formationinfo[$scope.type];
    $scope.teamformation = $scope.formations[0].type;
    $scope.positions = $scope.positioninfo[$scope.formations[0].type];
  }

  $scope.userSelect = function (user) {
    $scope.userselected = {};
    $scope.selectedUser = "";
    $scope.userselected[user.rostername] = true;
    $scope.selectedUser = user;
  };
  $scope.positionSelect = function (index) {
    if ($scope.positions[index].user)
      $scope.tempUserFlagArr[$scope.positions[index].user.id] = false;
    var tempUser = {id: $scope.selectedUser.id, photourl: $scope.selectedUser.photourl,
      rostername: $scope.selectedUser.rostername, shirtnumber: $scope.selectedUser.shirtnumber};
    for (var i = 0; i < $scope.positions.length; i++)
      if ($scope.positions[i].user)
        if ($scope.positions[i].user.rostername == tempUser.rostername) {
          $scope.positions[i].user = {};
          $scope.tempUserFlagArr[$scope.selectedUser.id] = false;
          break;
        }
    $scope.postData[tempUser.id] = [index, $scope.positions[index].playertype];
    $scope.positions[index].user = tempUser;
    $scope.userselected[tempUser.rostername] = false;
    $scope.tempUserFlagArr[tempUser.id] = true;
    $scope.selectedUser = "";
  };
  $scope.savePosition = function () {
    var sendData = {gameid: $rootScope.selectedGameIndex, formations: $scope.teamformation, type: $scope.type, position: $scope.postData};
    HelperService.updateRosterPositions(sendData).then(function (result) {
      $rootScope.rosterinfo = result;
    });
    $rootScope.goToPage('app.manage-game-macro');
  }
}).controller('MessageGameFormationCtrl', function ($scope, $rootScope, $http, FunctionService, HelperService) {
  $rootScope.messagestate = true;
  $rootScope.gamestate = false;
  $rootScope.tabStatus = "personal-team";

  $scope.init = function () {
    $scope.userselected = {};
    $scope.postData = {};
    $scope.selectedUser = "";
    $scope.teamformation = "";
    $scope.type = 'eleven';

    $scope.tempUserFlagArr = {};
    $http.get('json/formationinfo.json').success(function (formationinfo) {
      $scope.formationinfo = formationinfo;
      $scope.formations = $scope.formationinfo[$scope.type];
    });
    $http.get('json/positioninfo.json').success(function (positioninfo) {
      $scope.positioninfo = positioninfo;
    });
    HelperService.getGameFromID($rootScope.selectedGameIndex).then(function (result) {
      $scope.templeteArr = result;
    });
  };

  $scope.init();
  HelperService.getInningUserFromGameID($rootScope.selectedGameIndex).then(function (result) {
    if (result) {
      $scope.members = result;
      $scope.teamformation = result[0].formation;
      $scope.type = result[0].type;
      $scope.formations = $scope.formationinfo[$scope.type];
      $scope.positions = $scope.positioninfo[result[0].formation];
      for (var i = 0; i < $scope.members.length; i++) {
        if ($scope.members[i].position < 20) {
          $scope.tempUserFlagArr[$scope.members[i].id] = true;
          $scope.positions[$scope.members[i].position].user = $scope.members[i];
          $scope.postData[$scope.members[i].id] = [$scope.members[i].position, $scope.members[i].flag1];
          console.log('member', $scope.postData);
        } else {
          $scope.tempUserFlagArr[$scope.members[i].id] = false;
        }
      }
    }
  });
});