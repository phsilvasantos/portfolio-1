organizate.controller('CreatePlayerCtrl', function ($scope, $timeout, $rootScope, $ionicPopup, HelperService, Utils, AppConfig) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = false;
  $scope.memberData = [];
  HelperService.getLoginUserId();

  $scope.isMembers = {};
  console.log('contactuser2', $rootScope.contactuser);
  if ($rootScope.contactuser.length)
    for (var i = 0; i < $rootScope.contactuser.length; i++) {
      $scope.isMembers[$rootScope.contactuser[i].rostername] = true;
    }
  $scope.selectUser = function (user) {
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

  $scope.createRoster = function () {
    var sendTemp = [];
    for (var i = 0; i < $rootScope.contactuser.length; i++) {
      var tempname = $rootScope.contactuser[i].rostername;

      if ($scope.isMembers[tempname]) {
        if ($rootScope.contactuser[i]['$$hashKey'])
          delete $rootScope.contactuser[i]['$$hashKey'];
        sendTemp.push($rootScope.contactuser[i]);
      }
    }
//    sendTemp =  [{"teamid":"nothing","rostername":"Alfonso Pablov","phonenumber":"","email":"alfonsopablov@gmail.com","photourl":"content://com.android.contacts/contacts/1/photo","position":100},{"teamid":"nothing","rostername":"Cristian Ronaldo","phonenumber":"","email":"ronaldo@gmail.com","photourl":"content://com.android.contacts/contacts/2/photo","position":100},{"teamid":"nothing","rostername":"Lionel Messi","phonenumber":"","email":"messi@gmail.com","photourl":"content://com.android.contacts/contacts/3/photo","position":100},{"teamid":"nothing","rostername":"Kaka","phonenumber":"","email":"kaka@kaka.com","photourl":"content://com.android.contacts/contacts/4/photo","position":100},{"teamid":"nothing","rostername":"Iker Casillas","phonenumber":"","email":"casillas@gmail.com","photourl":"content://com.android.contacts/contacts/5/photo","position":100},{"teamid":"nothing","rostername":"Guytina","phonenumber":"1 324-433-5523","email":"guitinas@gmail.com","photourl":"content://com.android.contacts/contacts/6/photo","position":100},{"teamid":"nothing","rostername":"Messialli","phonenumber":"1 456-322-8964","email":"foutbaoll@bol.com","photourl":"content://com.android.contacts/contacts/7/photo","position":100},{"teamid":"nothing","rostername":"Guopisrre","phonenumber":"1 324-433-2578","email":"gghjikg.zf@gmail.com","photourl":"content://com.android.contacts/contacts/8/photo","position":100},{"teamid":"nothing","rostername":"Marta","phonenumber":"1 325-569-87","email":"marta9121@gmail.com","photourl":"content://com.android.contacts/contacts/9/photo","position":100},{"teamid":"nothing","rostername":"Marsellino","phonenumber":"1 556-988-8563","email":"marsellino@hotmail.com","photourl":"content://com.android.contacts/contacts/10/photo","position":100},{"teamid":"nothing","rostername":"Evantinus","phonenumber":"1 333-459-9332","email":"enag@timal.com","photourl":"content://com.android.contacts/contacts/11/photo","position":100},{"teamid":"nothing","rostername":"Coktail","phonenumber":"1 112-223-3333","email":"jinzhengge@hotmail.com","photourl":"content://com.android.contacts/contacts/12/photo","position":100},{"teamid":"nothing","rostername":"Minami","phonenumber":"(235) 559-841","email":"minami@gmail.com","photourl":"content://com.android.contacts/contacts/13/photo","position":100}]
    var sendData = {postData: sendTemp, teamid: $rootScope.selectedIndex};
    console.log(JSON.stringify(sendTemp));
    HelperService.addTeamMemberInvite(sendData).then(function(result){});
    $timeout(function () {
      Utils.hideIndicator();
      Utils.alert('Great, you have invited players for your team.', AppConfig.organizationName, function(){
        $rootScope.goToPage('app.manage-game-macro');
      });
    }, 5000);
  };

  $scope.selectContact = function () {
    var contactuser = Utils.getPhoneContacts();
    $rootScope.contactuser = $rootScope.contactuser.concat(contactuser);
    if (!contactuser.length) {
      Utils.alert("There is no any users is having the email address on your contact list.");
    }
  };

  $scope.selectStratch = function () {
    $rootScope.goToPage('app.new-profile');
  };

  $scope.selectEmail = function () {
    $scope.emailUsers = [];
    $scope.emailImport = {teamid: $rootScope.selectedIndex, rostername: '', email: ''};
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
            if (!Utils.isValidEmail($scope.emailUsers[i].text))
              continue;

            for (var j = 0; j < $scope.contactuser.length; j++) {
              if ($scope.emailUsers[i].text == $scope.contactuser[j].email) {
                breakFlag = $scope.contactuser[j].email;
                break;
              }
            }
            if (breakFlag) {
              Utils.alert(breakFlag + " is already added.");
              continue;
            }
            ;
            $scope.emailImport = {teamid: $rootScope.selectedIndex, rostername: $scope.emailUsers[i].text, email: $scope.emailUsers[i].text};
            $rootScope.contactuser.push($scope.emailImport);
            $scope.isMembers[$scope.emailImport.rostername] = true;
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
});