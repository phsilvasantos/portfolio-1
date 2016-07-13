organizate.controller('RosterMemberCtrl', function ($scope, $state, $rootScope, LocalStorageService, $ionicScrollDelegate,
        HelperService, Utils, $ionicPopup) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = true;
  $rootScope.tabStatus = "roster-member";

  $scope.teamdetail = {};

  HelperService.getTeamById($rootScope.selectedIndex).then(function (result) {
    console.log('formationinfo', result);
    $scope.teamdetail = result;
  });

  $scope.updateTeam = function () {
    if ($scope.teamdetail.name) {
      HelperService.updateTeamInfo($scope.teamdetail).then(function (result) {
        if (result)
          $rootScope.selectedIndex = result;
        LocalStorageService.setTeamInfo($rootScope.selectedIndex);
      });
    } else {
      alert("Enter Team Name.");
    }
  };
  $scope.loadRosters = function () {
    HelperService.getRosterUser($rootScope.selectedIndex).then(function (result) {
      $scope.rosterinfo = result;
      $ionicScrollDelegate.scrollBottom();
    });
  };
  $scope.loadRosters();
//    HelperService.getRosterAdmin().then(function(result) {
//        $scope.rosterinfo = result;
//    });
  $scope.editUser = function (id) {
    $state.go('app.user-profile', {'id': id});
  };
  $scope.deleteUser = function (id) {
    var sendData = {id: id, teamid: $rootScope.selectedIndex};
    HelperService.deleteRoster(sendData).then(function (result) {
      $scope.rosterinfo = result;
    });
  };
  $rootScope.$on("rosterDataChanged", function (event, args) {
    $scope.loadRosters();
  });

  $scope.selectEmail = function () {
    $scope.emailUsers = [];
    $scope.emailImport = {teamid: $rootScope.selectedIndex, gameid: $rootScope.selectedGameIndex, rostername: '', email: ''};
    var myPopup = $ionicPopup.show({
      template: '<ion-item class="item item-input popup-input custom-add-email-popup"><tags-input ng-model="emailUsers"></tags-input></ion-item>',
      title: 'Import From Email',
      subTitle: 'Please use valid email address.',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>Add</b>',
          type: 'button-balanced',
          onTap: function (e) {
            if (!$scope.emailUsers.length) {
//              if ($scope.emailImport.email == '')
//                alert("Please enter email.");
//              else
//                alert("Please enter valid email.");
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.emailUsers;
            }
          }
        },
      ]
    });
    myPopup.then(function (res) {
      if (typeof res !== 'undefined') {
        if ($scope.emailUsers.length) {
          console.log('email users', $scope.emailUsers);
          for (var i = 0; i < $scope.emailUsers.length; i++) {
            var breakFlag = false;
            for (var j = 0; j < $scope.rosterinfo.length; j++) {
              if ($scope.emailUsers[i].text == $scope.rosterinfo[j].email) {
                breakFlag = $scope.rosterinfo[j].email;
                break;
              }
            }
            if (breakFlag) {
              Utils.alert(breakFlag + " is already added.");
              continue;
            }
            ;

            if (!Utils.isValidEmail($scope.emailUsers[i].text)) {
              alert("\"" + $scope.emailUsers[i].text + "\"" + " is invalid email address.");
              continue;
            }

            $scope.emailImport = {
              teamid: $rootScope.selectedIndex,
              gameid: $rootScope.selectedGameIndex,
              rostername: $scope.emailUsers[i].text,
              email: $scope.emailUsers[i].text
            };
            HelperService.createScratchRoster($scope.emailImport).then(function (result) {
              $scope.loadRosters();
            });
          }
        } else {

        }
      } else {
        $scope.emailImport = {teamid: $rootScope.selectedIndex, gameid: $rootScope.selectedGameIndex, rostername: '', email: ''};
      }
    });

    $scope.$watch('emailImport.email', function (newValue, oldValue, scope) {
      $scope.emailImport.rostername = $scope.emailImport.email;
    });
  };


}).controller('RosterGameMemberCtrl', function ($scope, $state, $rootScope, $http, HelperService) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = true;
  $rootScope.tabStatus = "manage-game-macro";
  $scope.isMembers = {};
  HelperService.getRosterUser($rootScope.selectedIndex).then(function (result) {
    $scope.rosterinfo = result;
  });
  HelperService.getRosterUserFromGameID($rootScope.selectedGameIndex).then(function (result) {
    $scope.rostergameinfo = result;
    for (var i = 0; i < $scope.rostergameinfo.length; i++) {
      $scope.isMembers[$scope.rostergameinfo[i].rostername] = true;
    }
  });

  $scope.selectUser = function (user) {
    if ($scope.isMembers[user.rostername]) {
      $scope.isMembers[user.rostername] = false;
    } else {
      $scope.isMembers[user.rostername] = true;
    }
  };

  $scope.saveUser = function () {
    var postData = [];
    for (var i = 0; i < $scope.rosterinfo.length; i++) {
      if ($scope.isMembers[$scope.rosterinfo[i].rostername]) {
        var sendData = {gameid: $rootScope.selectedGameIndex, rosterid: $scope.rosterinfo[i].rosterid};
        postData.push(sendData);
      }
    }
    HelperService.updateGameMemvbers({data: postData}).then(function (result) {
      $scope.rosterinfo = result;
      $rootScope.goToPage('app.game-feedback');
    });
  };
}).controller('RosterMemberViewCtrl', function ($scope, $state, $rootScope, HelperService, LocalStorageService) {
  $rootScope.messagestate = true;
  $rootScope.gamestate = false;
  $rootScope.tabStatus = "roster-member-view";

  HelperService.getRosterUser($rootScope.selectedIndex).then(function (result) {
    $scope.rosterinfo = result;
    console.log(result);
  });
}).controller('RosterMemberMessageCtrl', function ($scope, $stateParams, $rootScope, HelperService, LocalStorageService) {

  $scope.id = $stateParams.id;
  if ($scope.id) {
    var data = {gameid: $rootScope.selectedGameIndex, flag: $scope.id}
    HelperService.getRosterMessageUser(data).then(function (result) {
      $scope.rosterinfo = result;
      console.log(result);
    });
  }

});