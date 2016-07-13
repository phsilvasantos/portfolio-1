var phonecontactuser = [];
var organizate = angular.module('organizate', ['ionic', 'ngCordova', 'ngImgCrop', 'ngTagsInput']);

organizate.run(function ($state, $rootScope, $ionicPlatform, $http, LocalStorageService, HelperService, $ionicModal, gpsService, Utils) {
  $http.get('json/formationinfo.json').success(function (formationinfo) {
    $rootScope.formationinfo = formationinfo;
  });
  $rootScope.setinitialize = function () {
    if ($rootScope.selectedIndex) {
      LocalStorageService.getTeamInfo().then(function (teaminfo) {
        $rootScope.teaminfo = teaminfo;
      });
      $rootScope.selectedIndex = $rootScope.teaminfo.length - 1;
      LocalStorageService.getGameInfo().then(function (gameinfo) {
        $rootScope.gameinfo = gameinfo;
      });
      $rootScope.selectedGameIndex = "nothing";
    }

  };

  $rootScope.cameraimage = '';
  $rootScope.contactuser = [];
  $rootScope.myImage = '';
  $rootScope.myCroppedImage = '';

  $rootScope.goToPage = function (url) {
    $rootScope.loadingStatus = false;
    $state.go(url);
  };

  $rootScope.setGameFlag = function () {
    $rootScope.selectedGameIndex != 'nothing';
  };
  $rootScope.showModal = function (url) {
    $ionicModal.fromTemplateUrl(url, function ($ionicModal) {
      $rootScope.modal = $ionicModal;
      $rootScope.modal.show();
    }, {
      scope: $rootScope,
      animation: 'slide-in-up'
    });

  };

  $rootScope.showCropModal = function (url) {
    $ionicModal.fromTemplateUrl(url, function ($ionicModal) {
      $rootScope.cropmodal = $ionicModal;
      $rootScope.cropmodal.show();
    }, {
      scope: $rootScope,
      animation: 'slide-in-up'
    });

  };

  $rootScope.userModal = function (id) {
    HelperService.getRosterInfo(id).then(function (result) {
      $rootScope.rosterData = result;
      switch ($rootScope.rosterData.position) {
        case 0:
          $rootScope.rosterData.position = "Striker";
          break;
        case 1:
          $rootScope.rosterData.position = "Keeper";
          break;
        case 2:
          $rootScope.rosterData.position = "Midfielder";
          break;
        case 3:
          $rootScope.rosterData.position = "Defender";
          break;
        case 4:
          $rootScope.rosterData.position = "Striker";
          break;
      }
      switch ($rootScope.rosterData.speciality) {
        case 0:
          $rootScope.rosterData.speciality = "Tank Centerforward";
          break;
        case 1:
          $rootScope.rosterData.speciality = "Tank Centerforward";
          break;
        case 2:
          $rootScope.rosterData.speciality = "Sweeper";
          break;
        case 3:
          $rootScope.rosterData.speciality = "Dripler";
          break;
      }
      switch ($rootScope.rosterData.favoredfoot) {
        case 0:
          $rootScope.rosterData.favoredfoot = "Right Foot";
          break;
        case 1:
          $rootScope.rosterData.favoredfoot = "Right Foot";
          break;
        case 2:
          $rootScope.rosterData.favoredfoot = "Left Foot";
          break;
        case 3:
          $rootScope.rosterData.favoredfoot = "Both Foots";
          break;
      }
      $rootScope.showModal('templates/user-profile-modal.html');
    });
  }

  if (google) {
    $rootScope.myLatlng = new google.maps.LatLng(-33.439783, -70.605967);
    $rootScope.positiondata = {'latitude': -33.439783, 'longitude': -70.605967, locationname: ''};

    $rootScope.mapOptions = {
      center: $rootScope.myLatlng,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $rootScope.findMe = function () {
      $rootScope.mapOptions = {
        center: $rootScope.myLatlng,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $rootScope.map = new google.maps.Map(document.getElementById("map"), $rootScope.mapOptions);
      gpsService.displayPositionMap();
      $rootScope.map.setCenter($rootScope.myLatlng);
    };

  }

  $rootScope.phonecontactuser = [];
  $rootScope.$watch('phonecontactuser', function () {
    if ($rootScope.phonecontactuser.length) {
      Utils.loadPhoneContacts();
    }
  });
  document.addEventListener("deviceready", onDeviceReady, false);
// PhoneGap is ready
//
  function onDeviceReady() {
    // create
    try {
      var options = new ContactFindOptions();
      options.filter = "";
      options.multiple = true;
      var fields = ["displayName", "emails", "photos"];
      navigator.contacts.find(fields,
              function onSuccess(contacts) {
                for (var i = 0; i < contacts.length; i++) {
                  if (!contacts[i].emails)
                    continue;
                  phonecontactuser.push(contacts[i]);
                }
                $rootScope.phonecontactuser = phonecontactuser;
              },
              function onError() {
                alert("Some Error Occured");
              },
              options);
    }
    catch (e) {
      alert(e.message);
    }
  }

  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    ionic.Platform.isFullScreen = true;
    var ratio, pixelRatio = window.devicePixelRatio;
    var width = jQuery(window).width();
    var height = jQuery(window).height();
    var widHeiPerRatio = width / height;
    if (widHeiPerRatio > 0.6) {
      ratio = height / 566;
    } else {
      ratio = width / 360;
    }

    jQuery('head').append('<meta name="viewport" content="width=device-width, ' +
            'height=device-height, ' +
            'initial-scale=' + ratio + ', ' +
            'minimum-scale=' + ratio + ', ' +
            'maximum-scale=' + ratio + ', ' +
            'user-scalable=yes">');
  });
//    ionic.Platform.ready(function(){
//        document.addEventListener("backbutton", function(){
//        }, false);
//    });
//    $ionicPlatform.onHardwareBackButton(function () {
//        if ($rootScope.selectedIndex) {
//            LocalStorageService.getTeamInfo().then(function(teaminfo) {
//                $rootScope.teaminfo = teaminfo;
//            });
//            $rootScope.selectedIndex = "nothing";
//            LocalStorageService.getGameInfo().then(function(gameinfo) {
//                $rootScope.gameinfo = gameinfo;
//            });
//            $rootScope.selectedGameIndex = "nothing";
//        }
//        $rootScope.loadingStatus = false;
//        $state.go('home-page');
//    });
});


//if (window.attachEvent) {
//  window.attachEvent('onresize', function () {
////        alert('attachEvent - resize');
//  });
//}
//else if (window.addEventListener) {
//  window.addEventListener('resize', function () {
//    var avail_height = $(window).height();
//    var signin_content_height = $('.signin-content-container').height();
//    var signup_content_height = $('.signup-content-container').height();
//    var signin_margin_top = (avail_height - signin_content_height) / 2;
//    var signup_margin_top = (avail_height - signup_content_height) / 2;
//    $('.signin-content-container').css("margin-top", signin_margin_top + "px");
//    $('.signup-content-container').css("margin-top", signup_margin_top + "px");
////        alert('addEventListener - resize');
//  }, true);
//}
//else {
//  alert('The browser does not support Javascript event binding');
//}

