organizate.controller('MessageReminderCtrl', function($scope, $rootScope) {
    $rootScope.messagestate = true;
    $rootScope.gamestate = false; 
    $rootScope.tabStatus = "message-detail";
    $scope.now = new Date();
    $scope.year = $scope.now.getFullYear();
    $scope.day = $rootScope.AddZero($scope.now.getDate());
    $scope.month = $rootScope.AddZero($scope.now.getMonth() + 1);
    $scope.hours = $rootScope.AddZero($scope.now.getHours());
    $scope.minute = $rootScope.AddZero($scope.now.getMinutes());
    $scope.timepart = $rootScope.getAfterPastTime($scope.now.getHours());
    $scope.saveVenue = false;
});