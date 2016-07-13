angular.module('cleverbaby')
.service('NotificationService', ["$ionicLoading", "$timeout",function($ionicLoading, $timeout){

    var Notification = {};
    Notification.show = function (text) {
        Notification.loading = $ionicLoading.show({
            template: text ? text : 'Loading..',
            showBackdrop: true,
            delay: 0
        });
    };

    Notification.hide = function () {
        $ionicLoading.hide();
    };

    Notification.notify = function (text) {
        Notification.show(text);
        $timeout(function () {
            Notification.hide();
        }, 1999);
    };
    return Notification;
}]);