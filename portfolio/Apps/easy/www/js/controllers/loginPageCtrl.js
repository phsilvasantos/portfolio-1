organizate.controller('LoginPageCtrl', function ($scope, $rootScope, $state, LocalStorageService, $http, HelperService, Utils, AppConfig, $cordovaFacebook) {
  $scope.userinfo = {
    login: LocalStorageService.getUserEmail(),
    password: LocalStorageService.getUserPass()
  };
  LocalStorageService.getUserinfo().then(function (userinfo) {
    if (userinfo) {
      $rootScope.loginUserId = userinfo;
      $rootScope.loadingStatus = false;
      $http.get(AppConfig.backendurl + 'userIdCheck?userid=' + $rootScope.loginUserId)
              .then(function (response) {
                if (response.data.isReg) {                  
                  $state.go('app.home-page');
                } else {
                  LocalStorageService.DeleteAll();
                }
              });
//      $state.go('app.home-page');
    }
  });

  $scope.facebookLogin = function () {
    $scope.userinfo = {login: '', password: ''};
    $cordovaFacebook.login(["public_profile", "email", "user_friends"]).then(function (success) {
      $cordovaFacebook.api("me", ["public_profile"]).then(function (success) {
        $scope.userinfo = {
          user_name: success.name,
          user_email: success.email,
          user_pic: 'http://graph.facebook.com/' + success.id + '/picture?width=200&height=200'
        };
        Utils.showIndicator();
        $http({
          url: AppConfig.backendurl + "signup",
          method: 'POST',
          data: $.param($scope.userinfo),
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          $scope.user = response.data.result;
          if (response.data.result) {
            LocalStorageService.setUserinfo($scope.user);
            HelperService.getLoginUserId();
            Utils.hideIndicator();
            $state.go("app.home-page");
          }
        });
      });
    }, function (error) {
      Utils.alert('FaceBook login failed');
    });
  };

  $scope.login = function () {
    if ($scope.userinfo.login) {
      Utils.showIndicator();
      $http({
        url: AppConfig.backendurl + "signin",
        method: 'POST',
        data: $.param($scope.userinfo),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function (response) {
        Utils.hideIndicator();
        if (response.data.isReg) {
          $scope.user = response.data.result;
          LocalStorageService.setUserEmail($scope.userinfo.login);
          LocalStorageService.setUserPass($scope.userinfo.password);
          if (response.data.result) {
            LocalStorageService.setUserinfo(response.data.result);
            HelperService.getLoginUserId();
            $state.go('app.home-page');
          }
        } else {
          $scope.userinfo.password = "";
          Utils.alert(response.data.result);
        }
      });
    }
    ;
  };



  $scope.user = {user_name: '', password: '', gender: 1};
  $scope.register = function () {
    Utils.showIndicator();

    if ($scope.user.user_birthday)
      $scope.user.birthday = Utils.changeDateTimeToDate($scope.user.user_birthday);
    $http({
      url: AppConfig.backendurl + "signup",
      method: 'POST',
      data: $.param($scope.user),
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(function (response) {
      console.log(response);
      if (response.data.isReg) {
        LocalStorageService.setUserEmail($scope.user.user_email);
        LocalStorageService.setUserPass('');
        $scope.userinfo = {login: $scope.user.user_email, password: $scope.user.password};
        $scope.login();
      } else {
        Utils.hideIndicator();
        Utils.alert('Register Failed!');
      }
    });
  };
  $scope.signInModal = false;
  $scope.signUpModal = false;

  $scope.closeSignWindow = function () {
    $scope.signInModal = false;
    $scope.signUpModal = false;
  }
})