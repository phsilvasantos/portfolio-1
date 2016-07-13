organizate.controller('HomePageCtrl', function ($scope, $cordovaFacebook, $state, $http, $rootScope, HelperService, LocalStorageService, Utils, AppConfig) {
  $rootScope.messagestate = false;
  $rootScope.gamestate = false;
  $rootScope.selectedIndex = 'nothing';
  HelperService.getLoginUserId();
  Utils.initializeService();
  $scope.logout = function () {
//        OpenFB.logout();
    LocalStorageService.DeleteAll();
//    $http.get(AppConfig.backendurl + 'deleteAll');
    var cookies = document.cookie.split(";");
    
    $cordovaFacebook.logout().then(function (success) {});
    $state.go('first-page');

  };
});