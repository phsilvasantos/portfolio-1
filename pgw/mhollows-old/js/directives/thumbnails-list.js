angular.module('gnApp.directives')
        .directive('thumbnailsList', [
          function ($scope) {
            return {
              restrict: 'AE',
              replace: true,
              controller: function ($scope) {
                $scope.visibleCount = 5;

                var padding = 30;

                $scope.caculateVisibleCount = function () {
                  if (!$scope.elem) {
                    return;
                  }
                  var itemWidth = $scope.elem.find('.viewmore').width();
                  var containerWidth = $('.page').width() - itemWidth - padding;
                  $scope.visibleCount = Math.round(containerWidth / (itemWidth + 1));
                };

                $scope.resize = function () {
                  $scope.$apply(function () {
                    $scope.caculateVisibleCount();
                  });
                };

                /*$(window).unbind('resize', $scope.resize)
                        .bind('resize', $scope.resize);*/

              },
              scope: {
                total: '=',
                items: '=',
                title: '=',
                moreLabel: '=',
                moreCallback: '&'
              },
              templateUrl: 'templates/partials/thumbnails-list.html',
              link: function (scope, elem, attr, ctrl) {
                scope.elem = $(elem);
                //scope.caculateVisibleCount();
              }
            };
          }
        ]);
