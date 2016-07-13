angular.module('cleverbaby.directives')
    .directive('cbBabyDropDown', ['$timeout', '$ionicModal', function ($timeout, $ionicModal) {
        return {
            restrict: 'A',
            template: '<span>{{$root.baby.name}}</span>',
            link: function (scope, element) {
                $ionicModal.fromTemplateUrl('templates/modals/dropdown.html',function(dropdown){
                    scope.dropdownModal = dropdown;
                });

                angular.element(element).click(function(){
                    scope.dropdown();
                })

                scope.dropdown = function(){
                    scope.modal.hide();
                    scope.dropdownModal.show();
                };
            }
        }
    }]);