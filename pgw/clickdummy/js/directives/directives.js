angular.module('myApp.directives', [])
        .directive('cup', [
          function ($scope) {
            return {
              restrict: 'AE',
              replace: true,
              scope: {
                fill: '=', //0-1
                type: '='
              },
              template: '<div class="cup {{type}}"><div class="cup-val"></div></div>',
              link: function (scope, elem, attr, ctrl) {
                scope.elem = $(elem);
                scope.$watch('fill', function () {
                  var f = (scope.fill || 0) * 1;
                  f = Math.min(1, Math.max(0, f));
                  if (f === 1) {
                    $(elem).addClass('full-filled');
                  } else {
                    $(elem).removeClass('full-filled');
                    $(elem).find('.cup-val').css('height', (25 + f * 75) + '%');
                  }
                });
              }
            };
          }
        ]);
