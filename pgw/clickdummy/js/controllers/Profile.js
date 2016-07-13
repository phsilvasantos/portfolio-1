angular.module('myApp.controllers').controller('ProfileCtrl', function ($scope, $stateParams, FullPictureModalService, $window) {
  $scope.profile = {
    id: 1,
    name: 'John Doe',
    yaays: 115,
    followers: 120,
    avatar: 'img/avatars/1.jpg'
  };

  $scope.pictures = [
    {
      id: 1,
      image: 'img/examples/1.jpg',
      color: 'pink',
      comment: 'Most Beautiful Pic of the week'
    },
    {
      id: 2,
      image: 'img/examples/2.jpg',
      color: 'blue',
      comment: 'Hello Dolley?'
    },
    {
      id: 3,
      image: 'img/examples/3.jpg',
      color: 'blue',
      comment: 'Stylish Pic?'
    },
    {
      id: 4,
      image: 'img/examples/4.jpg',
      color: 'grey',
      comment: 'Most Beautiful Pic of the week'
    },
    {
      id: 5,
      image: 'img/examples/5.jpg',
      color: 'blue',
      comment: 'Most Beautiful Pic of the week'
    },
    {
      id: 6,
      image: 'img/examples/6.jpg',
      color: 'grey',
      comment: 'Stylish Pic?'
    }
  ];
  
  $scope.toggleFollow = function () {
    $scope.profile.followed = !$scope.profile.followed;
  };
  
  $scope.showFullPicture = function(picture){
    FullPictureModalService.open($scope.profile, picture);
  };
});
