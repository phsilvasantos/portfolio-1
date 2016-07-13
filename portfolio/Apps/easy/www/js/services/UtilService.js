'use strict';

organizate.factory('Utils', function ($ionicLoading, $ionicPopup, AppConfig, $rootScope) {
  var UtilsSrv = {
    config: null,
    phonecontacts: [],
    showIndicator: function () {
      window.iL = $ionicLoading;
      $ionicLoading.show({
        template: '<span class="preloader preloader-white"></span>'
      });
    },
    hideIndicator: function () {
      $ionicLoading.hide();
    },
    alert: function (msg, title, callback) {
      title = title || AppConfig.organizationName;
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });
      if (callback) {
        alertPopup.then(function (res) {
          callback();
        });
      }
    },
    confirm: function (msg, title, success, cancel) {
      var confirmPopup = $ionicPopup.confirm({
        title: title || AppConfig.organizationName,
        template: msg
      });
      confirmPopup.then(function (res) {
        if (res) {
          if (success)
            success();
        } else {
          if (cancel)
            cancel();
        }
      });
    },
    correctImageDataURI: function (dataURI) {
      //if mime type is not defined(specifically on samsung galaxy)
      if (/data:;?base64,/.test(dataURI)) {
        dataURI = dataURI.replace(/data:;?base64,/, 'data:image/jpeg;base64,');
      }
      return dataURI;
    },
    detectDevice: function (deviceType) {
      //Return boolean value according to deviceType
      var deviceInfo = window.navigator.userAgent;
      if (deviceInfo.toLowerCase().indexOf(deviceType) >= 0)
        return true
      else
        return false;
    },
    isValidEmail: function (email) {
      //Return boolean value according to deviceType
      var strArr = email.split('@');
      if (strArr.length == 2)
        return true
      else
        return false;
    },
    loadPhoneContacts: function () {
      UtilsSrv.phonecontacts = [];
      for (var i = 0; i < $rootScope.phonecontactuser.length; i++) {
        if (!$rootScope.phonecontactuser[i].emails)
          continue;
        var temp = {
          'teamid': $rootScope.selectedIndex,
          'rostername': $rootScope.phonecontactuser[i].displayName,
          'phonenumber': ($rootScope.phonecontactuser[i].phoneNumbers) ? $rootScope.phonecontactuser[i].phoneNumbers[0].value : '',
          'email': ($rootScope.phonecontactuser[i].emails) ? $rootScope.phonecontactuser[i].emails[0].value : '',
          'photourl': ($rootScope.phonecontactuser[i].photos) ? $rootScope.phonecontactuser[i].photos[0].value : '',
          'position': 100
        };
        UtilsSrv.phonecontacts.push(temp);
      }
    },
    getPhoneContacts: function () {
      return UtilsSrv.phonecontacts;
    },
    changeDateTimeToDate: function (datetime) {
      return datetime = moment(new Date(datetime)).format(AppConfig.dateFormatString);
    },
    initializeService: function () {
//      UtilsSrv.loadPhoneContacts();
    }
  };

  return UtilsSrv;
});
