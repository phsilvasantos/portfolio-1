angular.module('myApp.controllers').controller('ChangeProfileCtrl', function ($scope, $location, $ionicPopover, $window) {
  $scope.languages = [
    {code: 'en', name: 'English'},
    {code: 'zh', name: 'Chinese'},
    {code: 'he', name: 'Hebrew'},
    {code: 'ko', name: 'Korea'},
    {code: 'ua', name: 'Ukraine'},
    {code: 'ru', name: 'Russian'}
  ];
  
  $scope.genders = [
    {code: 'male', name: 'Male'},
    {code: 'female', name: 'Female'}
  ];
  
  $scope.data = {};
  
  $scope.findVal = function(values, code){
    return values.filter(function(item){
      return item.code === code;
    })[0];
  };
  
  $scope.genderPopover = null;
  $ionicPopover.fromTemplateUrl('gender-popover', {
    scope: $scope
  }).then(function (popover) {
    $scope.genderPopover = popover;
  });
  
  $scope.langPopover = null;
  $ionicPopover.fromTemplateUrl('lang-popover', {
    scope: $scope
  }).then(function (popover) {
    $scope.langPopover = popover;
  });
  
  $scope.$on('$destroy', function () {
    $scope.genderPopover.remove();
  });

  $scope.onSelectGender = function (gender) {
    $scope.data.gender = gender.code;
    $scope.genderPopover.hide();
  };
  
  $scope.onSelectLanguage = function (lang) {
    $scope.data.language = lang.code;
    $scope.langPopover.hide();
  };
  
  $scope.clearPhoto = function(){
    $scope.data.photo = null;
  };

  $window.onSettingsProfilePhotoSelected = function (fileElem) {
    var FR = new FileReader();
    FR.onload = function (e) {
      $scope.$apply(function(){
        $scope.data.photo = e.target.result;
      });
    };
    FR.readAsDataURL(fileElem.files[0]);
  };
});
