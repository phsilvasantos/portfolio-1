angular.module('myApp.controllers').controller('UploadCategoriesCtrl', function ($scope, $rootScope, CaptureModalService) {
  $scope.categories = [
    {
      id: 1,
      image: 'img/examples/1.jpg',
      cup: 'gold',
      color: 'pink',
      name: 'Most Beautiful Pic of the week'
    },
    {
      id: 2,
      image: 'img/examples/2.jpg',
      cup: 'silver',
      color: 'blue',
      name: 'Hello Dolley?'
    },
    {
      id: 3,
      image: 'img/examples/3.jpg',
      cup: 'bronze',
      color: 'blue',
      name: 'Stylish Pic?'
    },
    {
      id: 4,
      image: 'img/examples/4.jpg',
      cup: 'gold',
      color: 'grey',
      name: 'Most Beautiful Pic of the week'
    },
    {
      id: 5,
      image: 'img/examples/5.jpg',
      cup: 'gold',
      color: 'blue',
      name: 'Most Beautiful Pic of the week'
    },
    {
      id: 6,
      image: 'img/examples/6.jpg',
      cup: 'bronze',
      color: 'grey',
      name: 'Stylish Pic?'
    }
  ];
  
  $scope.selectCategory = function(category){
    CaptureModalService.open(category, $rootScope.takenCardPhoto, function(){
      $scope.goBack();
    });
  };
  

});
