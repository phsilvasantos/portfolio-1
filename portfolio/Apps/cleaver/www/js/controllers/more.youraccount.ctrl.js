angular.module('cleverbaby.controllers')
    .controller('MoreYourAccountCtrl', ['$scope', '$timeout',
        function($scope, $timeout) {
            //todo temporary data
            $scope.data = {name: "Roger"};

            var originalData = angular.toJson($scope.data, true);

            $scope.inputDisabled = true;
            /**
             * enables the editing of form
             */
            $scope.activateEdit = function() {
                $scope.inputDisabled = false;
                originalData = angular.toJson($scope.data, true);
            };

            $scope.cancelEdit = function() {
                $scope.inputDisabled = true;
                $scope.data = angular.fromJson(originalData);
            };

            $scope.saveEdit = function() {
                $scope.inputDisabled = true;
            };


            $scope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    $scope.inputDisabled = true;
                })
        }
    ]);
