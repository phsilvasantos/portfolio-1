angular.module('gnApp.directives')
        .directive('thumbnailsList', [
          function ($scope) {
            return {
              restrict: 'AE',
              replace: true,
              controller: function ($scope) {
                $scope.visibleCount = $scope.visibleCount || 5;

                var padding = 30;

                $scope.onItemClick = function(item, other, index){
                  if($scope.itemCallback){
                    $scope.itemCallback(item, other, index);
                  }
                };

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
                other: '=',
                title: '=',
                moreLabel: '=',
                moreCallback: '&',
                customCallback: '&',
                itemCallback: '=',
                visibleCount: '@'
              },
              templateUrl: 'templates/partials/thumbnails-list.html',
              link: function (scope, elem, attr, ctrl) {
                scope.elem = $(elem);
                //scope.caculateVisibleCount();
              }
            };
          }
        ]);
