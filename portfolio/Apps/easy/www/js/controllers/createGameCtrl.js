organizate.controller('CreateGameCtrl', function ($scope, $rootScope, $stateParams, FunctionService, HelperService, gpsService, LocalStorageService) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = true;
  $rootScope.tabStatus = "create-game";

  $scope.isEdit = $stateParams.id;
  $scope.date = {};
  $scope.date.now = new Date();
  $scope.currentDate = new Date();

  $scope.buttonTitle = "Proceed to game details";
  $scope.gamedetail = {
    "teamid": $rootScope.selectedIndex,
    "gamedate": $scope.date.now.getTime(),
    "location_latitude": $rootScope.positiondata.latitude,
    "location_longitude": $rootScope.positiondata.longitude,
    "location_name": $rootScope.positiondata.locationname,
    "maxnumber": 11,
    save_venue: false,
    "opponentname": "",
    "trigger_in": 0,
    "trigger_out": "",
    "instruction": ""
  };

  navigator.geolocation.getCurrentPosition(function (pos) {
//        $rootScope.positiondata = {'latitude': pos.coords.latitude, 'longitude': pos.coords.longitude};
    $rootScope.myLatlng = new google.maps.LatLng($rootScope.positiondata.latitude, $rootScope.positiondata.longitude);
    console.log('myLatlng', $rootScope.myLatlng);
  }, function (error) {
//        alert(error);
//                alert('Unable to get location: ' + error.message);
  });

  if (google) {
    $rootScope.geocoder = new google.maps.Geocoder();
    $rootScope.map = new google.maps.Map(document.getElementById("map"), $rootScope.mapOptions);
    $rootScope.myLatlng = new google.maps.LatLng($rootScope.positiondata.latitude, $rootScope.positiondata.longitude);
    $rootScope.map.setCenter($rootScope.myLatlng);
  }
  if ($scope.isEdit) {
    $scope.buttonTitle = "Edit Game Details and Resend Invitation";
    $rootScope.selectedGameIndex = $scope.isEdit;
    HelperService.getGameFromID($rootScope.selectedGameIndex).then(function (result) {
      if (result)
        $scope.gamedetail = result;
      $scope.date.now = new Date(result.gamedate * 1);
      if (google) {
        if ($scope.gamedetail.location_latitude) {
          $rootScope.myLatlng = new google.maps.LatLng($scope.gamedetail.location_latitude, $scope.gamedetail.location_longitude);
          $scope.saveVenue = true;
        }
        $rootScope.map.setCenter($rootScope.myLatlng);
      }
    });
  }

  if ($scope.gamedetail.location_name)
    $scope.saveVenue = false;

  $scope.setPositionFromAddress = function () {
    if ($scope.gamedetail.location_name) {
      $rootScope.geocoder = new google.maps.Geocoder();
      $rootScope.geocoder.geocode({'address': $scope.gamedetail.location_name}, function (results, status)
      {
        if (status === google.maps.GeocoderStatus.OK)
        {
          $rootScope.map.setCenter(results[0].geometry.location);
          var latLong = $rootScope.map.getCenter();
          $scope.gamedetail.location_latitude = latLong.lat();
          $scope.gamedetail.location_longitude = latLong.lng();
        }
        else
        {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    } else {
      var latLong = $rootScope.map.getCenter();
      $scope.gamedetail.location_latitude = latLong.lat();
      $scope.gamedetail.location_longitude = latLong.lng();
      gpsService.getAddressFromLatLong(latLong.lat(), latLong.lng()).then(function (response) {
        $scope.gamedetail.location_name = response;
      });
    }
  }
  
  $scope.createGame = function () {
    if ($scope.saveVenue)
      $rootScope.positiondata = {latitude: $scope.gamedetail.location_latitude,
        longitude: $scope.gamedetail.location_longitude,
        locationname: $scope.gamedetail.location_name};
    $scope.gamedetail.gamedate = $scope.date.now.getTime();
    $scope.gamedetail.save_venue = $scope.saveVenue;
    if (!$scope.isEdit) {
      $scope.gamedetail.changeflag = 0;
      HelperService.createNewGame($scope.gamedetail).then(function (result) {
        if (result)
          $rootScope.selectedGameIndex = result;
        LocalStorageService.setGameInfo($rootScope.selectedGameIndex);
        $rootScope.goToPage('app.detail-game');
      });
    } else {
      $scope.gamedetail.changeflag = 1;
      HelperService.updateGameInfo($scope.gamedetail).then(function (result) {
        if (result)
          $rootScope.selectedGameIndex = result;
        LocalStorageService.setGameInfo($rootScope.selectedGameIndex);
        $rootScope.goToPage('app.game-feedback');
      });
    }
  };
  
  $scope.changVenue = function () {
    if ($scope.saveVenue) {
      $scope.saveVenue = false;
      $scope.gamedetail.save_venue = false;
    } else {
      $scope.saveVenue = true;
      $scope.gamedetail.save_venue = true;
    }
  };
  $scope.getDateTimeString = function () {
    var curDate = new Date();
    if ($scope.date.now.getTime() < curDate.getTime()) {
      alert("Selected data and time is already past.");
      return;
    }
    $scope.dateval = {
      "year": $scope.date.now.getFullYear(),
      "day": FunctionService.AddZero($scope.date.now.getDate()),
      "month": FunctionService.AddZeroMonth($scope.date.now.getMonth()),
      "hours": FunctionService.AddZeroHour($scope.date.now.getHours()),
      "minute": FunctionService.AddZero($scope.date.now.getMinutes()),
      "timepart": FunctionService.getAfterPastTime($scope.date.now.getHours())
    };
  }
});