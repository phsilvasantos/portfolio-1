angular
    .module('cleverbaby.helpers')
    .filter('babyImage', function(){
        return function(x){
            if(typeof cordova == 'undefined'){
                return 'img/baby.png'
            }
            return x || 'img/baby.png';
        }
    })
    .directive('background', ['$filter', function($filter){
        return {
            scope: {
              background: '=background'
            },
            link: function (scope, element, attrs) {
                scope.$watch('background', function(url){
                    element.css({
                        'background-image': 'url(' + $filter('babyImage')(url) +')'
                    }); 
                });
            }
        };
    }]);