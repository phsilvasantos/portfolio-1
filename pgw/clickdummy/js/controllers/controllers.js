angular.module('myApp.controllers').controller('StartCtrl', function ($scope, $location) {
  $scope.loginWithEmail = function () {
    $location.path('/login');
  };
  
}).controller('CompleteProfileCtrl', function ($scope, $window, $ionicPopover) {
  $scope.data = {};
  
  /** == filters menu == */
  $scope.genderPopover = null;
  $ionicPopover.fromTemplateUrl('gender-popover', {
    scope: $scope
  }).then(function (popover) {
    $scope.genderPopover = popover;
  });

  $scope.$on('$destroy', function () {
    $scope.genderPopover.remove();
  });

  $scope.onSelectGender = function (gender, e) {
    $scope.data.gender = gender;
    $scope.genderPopover.hide();
  };

  $window.onProfilePhotoSelected = function (fileElem) {
    var FR = new FileReader();
    FR.onload = function (e) {
      $(fileElem).closest('.photobox')
              .css('background-image', 'url(' + e.target.result + ')')
              .addClass('photo-selected');

    };
    FR.readAsDataURL(fileElem.files[0]);
  };
}).controller('IntroductionCtrl', function ($scope, $stateParams, $location) {
  $scope.fromSettings = $location.search().from_settings;
  $scope.introductions = [
    {text: 'Browse different categories to vote for other and upload own pics!'},
    {text: 'All categories run for one week (Monday to Sunday)!'},
    {text: 'Find new pics of friends, followers, locals and other interesting users!'},
    {text: 'Vote YAAY by swiping left! Follow friends and interesting users!'},
    {text: 'Upload yourself to collect YAAYs and get more popular!'}
  ];

  $scope.slideHasChanged = function (index) {
    if (index === $scope.introductions.length - 1) {
      $('.page-introduction .slider-pager').hide(100);
      $('.page-introduction .btn-start').show(150);
    } else {
      $('.page-introduction .slider-pager').show(100);
      $('.page-introduction .btn-start').hide(100);
    }
  };
});
