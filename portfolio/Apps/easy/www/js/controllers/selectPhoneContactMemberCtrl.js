organizate.controller('SelectPhoneContactMemberCtrl', function ($scope, $rootScope, HelperService, Utils) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = true;
  $rootScope.tabStatus = "create-game";
  $scope.isselectAll = false;
  $scope.isMembers = {};
  $scope.contactuser = Utils.getPhoneContacts();
  console.log('PhoneContacts', $scope.contactuser);

  $scope.selectMember = function (user) {
    if (!$scope.isMembers[user.rostername]) {
      $scope.isMembers[user.rostername] = true;
    } else {
      $scope.isMembers[user.rostername] = false;
    }
  };

  $scope.import = function () {
    for (var i = 0; i < $scope.contactuser.length; i++) {
      var tempname = $scope.contactuser[i].rostername;
      if ($scope.isMembers[tempname]) {
        delete $scope.contactuser[i]['$$hashKey'];
        $scope.contactuser[i].gameid = $rootScope.selectedGameIndex;
        HelperService.createScratchRoster($scope.contactuser[i]).then(function (result) {
          $rootScope.$broadcast("rosterDataChanged");
        });
      }
    }
    $rootScope.goToPage('app.roster-member');
  };

});