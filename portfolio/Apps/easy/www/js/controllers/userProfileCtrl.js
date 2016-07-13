organizate.controller('UserProfileCtrl', function ($scope, $rootScope, HelperService, $cordovaCamera, $http, $stateParams) {
  $scope.id = $stateParams.id;
  $rootScope.messagestate = false;
  $rootScope.gamestate = true;
  $rootScope.tabStatus = "roster-member";

  $rootScope.rosterData = {'teamid': $rootScope.selectedIndex, 'rostername': '', 'gender': 1, 'photourl': '', 'shirtnumber': '', 'position': 1, 'speciality': 1, 'favoredfoot': 1, 'phonenumber': '', 'email': '', 'birthday': ''};
  if ($scope.id)
    if ($scope.id != 'selectteam')
      HelperService.getRosterInfo($scope.id).then(function (result) {
        $rootScope.rosterData = result;
      });

  $scope.saveRoster = function () {
    if (!$rootScope.rosterData.rostername) {
      alert("Please enter your name.");
      return;
    }
    if (!$rootScope.rosterData.gender) {
      alert("Please select gender.");
      return;
    }
    if (!$rootScope.rosterData.email) {
      alert("Please enter your email.");
      return;
    }

    if ($scope.id && $scope.id != 'selectteam') {
      HelperService.updateRoster($rootScope.rosterData).then(function (result) {
        $rootScope.goToPage('app.roster-member');
      });
    }

    else {
      if ($scope.id != 'selectteam')
        $rootScope.rosterData.gameid = $rootScope.selectedGameIndex;
      HelperService.createScratchRoster($rootScope.rosterData).then(function (result) {
        if ($scope.id == 'selectteam'){
          $rootScope.goToPage('app.select-team-member');
        } else {
          $rootScope.goToPage('app.roster-member');
          $rootScope.$broadcast("rosterDataChanged");
        }
      });
    }

  };
  $scope.takePicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };
    $rootScope.myImage = '';

    // udpate camera image directive
    $cordovaCamera.getPicture(options).then(function (imageData) {
      if (imageData) {
        $rootScope.myImage = "data:image/jpeg;base64," + imageData;
        $rootScope.showCropModal('templates/image-crop-modal.html');
      }
    }, function (err) {
      console.log('Failed because: ' + err);
    });
    $scope.$watch('myCroppedImage', function () {
      $rootScope.rosterData.photourl = $rootScope.myCroppedImage;
    });
    $rootScope.hideCropmodal = function (url) {
      $rootScope.cropmodal.hide();
      $rootScope.rosterData.photourl = url;
    };
  };
}).controller('NewProfileCtrl', function ($scope, $rootScope, $cordovaCamera) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = false;

  $rootScope.rosterData = {'teamid': $rootScope.selectedIndex, 'rostername': '', 'gender': 1, 'photourl': '', 'shirtnumber': '', 'position': 1, 'speciality': 1, 'favoredfoot': 1, 'phonenumber': '', 'email': '', 'birthday': ''};

  $scope.saveRoster = function () {
    if ($rootScope.rosterData.rostername) {
      var temp = {
        'teamid': $rootScope.selectedIndex,
        'rostername': $rootScope.rosterData.rostername,
        'phonenumber': ($rootScope.rosterData.phonenumber) ? $rootScope.rosterData.phonenumber : '',
        'email': ($rootScope.rosterData.email) ? $rootScope.rosterData.email : '',
        'photourl': ($rootScope.rosterData.photourl) ? $rootScope.rosterData.photourl : '',
        'position': 100
      };
      $rootScope.contactuser.push($rootScope.rosterData);
      console.log('contactuser1', $rootScope.contactuser);
      $rootScope.goToPage('app.create-player');
    }
  };
  $scope.takePicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };

    $rootScope.showCropModal('templates/image-crop-modal.html');
    // udpate camera image directive
    $cordovaCamera.getPicture(options).then(function (imageData) {
      $rootScope.myImage = "data:image/jpeg;base64," + imageData;
    }, function (err) {
      console.log('Failed because: ' + err);
    });
    $scope.$watch('myCroppedImage', function () {
      $rootScope.rosterData.photourl = $rootScope.myCroppedImage;
    });
    $rootScope.hideCropmodal = function (url) {
      $rootScope.cropmodal.hide();
      $rootScope.rosterData.photourl = url;
    };
  };
}).controller('PersonalProfileCtrl', function ($scope, $rootScope, $cordovaCamera, $ionicPopup, HelperService, $stateParams) {
  $scope.id = $stateParams.id;
  $rootScope.messagestate = true;
  $rootScope.gamestate = false;
  $rootScope.tabStatus = "personal-profile";

  var senddata = {teamid: $rootScope.selectedIndex, userid: $rootScope.loginUserId};

  $rootScope.rosterData = {'teamid': $rootScope.selectedIndex, 'rostername': '', 'gender': 1, 'photourl': '', 'shirtnumber': '', 'position': 1, 'speciality': 1, 'favoredfoot': 1, 'phonenumber': '', 'email': '', 'birthday': ''};
  HelperService.getRosterInfoFromUserId(senddata).then(function (result) {
    $rootScope.rosterData = result;
  });

  $scope.changeData = function () {
    if ($rootScope.rosterData.user_name) {
      HelperService.updateUserInfo($rootScope.rosterData).then(function (result) {

      });
    }

  };

  $scope.saveRoster = function () {
    if (!$rootScope.rosterData.rostername) {
      alert("Please enter your name.");
      return;
    }
    if (!$rootScope.rosterData.gender) {
      alert("Please select gender.");
      return;
    }
    if (!$rootScope.rosterData.email) {
      alert("Please enter your email.");
      return;
    }

    HelperService.updateRoster($rootScope.rosterData).then(function (result) {
      var alertPopup = $ionicPopup.alert({
        title: 'Success!',
        template: 'Your roster data has been changed successful!'
      });
      alertPopup.then(function (res) {
//                    $rootScope.goToPage('app.manage-game-macro');
      });
    });
  };
  $scope.takePicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };

    $rootScope.showCropModal('templates/image-crop-modal.html');
    // udpate camera image directive
    $cordovaCamera.getPicture(options).then(function (imageData) {
      $rootScope.myImage = "data:image/jpeg;base64," + imageData;
    }, function (err) {
      console.log('Failed because: ' + err);
    });
    $scope.$watch('myCroppedImage', function () {
      $rootScope.rosterData.photourl = $rootScope.myCroppedImage;
    });
    $rootScope.hideCropmodal = function (url) {
      $rootScope.cropmodal.hide();
      $rootScope.rosterData.photourl = url;
    };
  };
});