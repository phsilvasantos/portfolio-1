angular.module('myApp.controllers').controller('CaptureModalCtrl', function ($scope, $timeout, CaptureModalService) {
  $scope.service = CaptureModalService;
  $scope.data = CaptureModalService.getOptions();
  $scope.areaShown = 'edit';
  
  $scope.addComment = function(){
    $scope.data.comment = $scope.data.commentVal;
    $scope.areaShown = 'completed';
  };
  
  $scope.apply = function(){
    $scope.service.close();
    $timeout(function(){
      $scope.areaShown = 'edit';
    }, 1000);
    if($scope.service.getOptions().callback){
      $scope.service.getOptions().callback($scope.data);
    }
  };
});
