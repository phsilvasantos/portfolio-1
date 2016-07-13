angular.module('cleverbaby.controllers')
.controller('newCtrl', ['$rootScope', '$scope', '$window', 'NotificationService', '$translate',
    function ($rootScope, $scope, $window, NotificationService, $translate) {
    $scope.data = {
        item: ""
    };

    $scope.close = function () {
        $scope.modal.hide();
    };

    $scope.createNew = function () {
        var item = this.data.item;

        if (!item) return;

        $scope.modal.hide();

        NotificationService.show($translate('cleverbaby.app.activity.add.message'));

        var form = {
            item: item,
            isCompleted: false,
            created: Date.now(),
            updated: Date.now()
        };

        $rootScope.fbData.$add(form);


        NotificationService.hide();
    };
}]);
