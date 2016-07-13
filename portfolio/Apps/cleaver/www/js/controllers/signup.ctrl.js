angular.module('cleverbaby.controllers')

    .controller('SignUpCtrl', [
        '$scope', '$rootScope', '$location', 'NotificationService', 'AuthService',
        function ($scope, $rootScope, $location, NotificationService, AuthService) {
            $scope.user = {
                email: "",
                password: ""
            };

            $scope.createWithOAuth = function(type){
                AuthService.signInViaOAuth(type).then(function(data){
                    $location.path('app/diary');
                });
            };
            $scope.createUser = function () {

                var email = this.user.email;
                var password = this.user.password;
                var name = this.user.name;

                if (!email || !password || !name) {
                    NotificationService.notify("Please enter valid credentials");
                    return false;
                }

                NotificationService.show('Please wait.. Registering');
                return AuthService.createUser(name, email, password)
                    .then(function (data) {
                        NotificationService.hide();
                        $location.path('/app/diary');
                    }).catch(function(error){
                        NotificationService.hide();
                        NotificationService.notify(error.message);
                    });
            };
        }
    ]);
