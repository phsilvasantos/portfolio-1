angular.module('myApp.controllers').controller('MyResultsCtrl', function ($scope, $location, $ionicModal) {
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
    }
  ];
});
