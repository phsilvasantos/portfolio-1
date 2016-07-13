angular
    .module('cleverbaby.helpers')
    .directive('timelineItem', function($interval) {
        return {
            compile: function compile(temaplateElement, templateAttrs) {
                return {
                    pre: function (scope, element, attrs) {
                    },
                    post: function(scope, element, attrs) {
                    }
                }
            },
            priority: 0,
            terminal:false,
            templateUrl: 'templates/timelineItem.html',
            replace: false,
            transclude: false,
            restrict: 'E',
            scope: {
                activity: '='
            },
            controller: function ($scope, $element, $attrs, $transclude, activityModals) {
                $scope.openModal = function(data){
                    activityModals.showModal(data.type, data);
                }
            }

        }
    })

    .directive('timelineDate', function($interval) {
        return {
            scope: {
                'timelineDate': '=',
            },
            link: function($scope, element, attrs) {
                function setDate(x) {
                    var value =  new Date(x).getTime() / 1000;
                    element.text(moment(value, 'X').fromNow());
                }

                // refresher
                var intervalId = $interval(function(){
                    setDate($scope.timelineDate);
                }, 10000);

                // outside changes
                $scope.$watch('timelineDate', function (x) {
                    setDate(x);
                });

                $scope.$on('$destroy', function () {
                    if(intervalId)
                        $interval.cancel(intervalId);
                });
            },
        }
    });
