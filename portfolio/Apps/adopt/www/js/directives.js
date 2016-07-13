angular.module('app.directives', ['ionic'])
.directive('sliderTemplate', function($compile, $parse){

	return {
        link: function(scope, element, sce){
		
        },
        template: "<div ng-bind-html=\"post.slides.dogSlides.thumb[0] | to_trusted\"></div>"
    }

})

.directive('headerShrink', function($document) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style.opacity = 1- fadeAmt;

    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      
      var header = $document[0].body.querySelector('.bar-header');
      var headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        if(scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
})


.directive('photoFullView', [
            function ($scope) {
                return {
                    restrict: 'AE',
                    replace: true,
                    controller: function ($scope, $rootScope) {
                        console.log('photos', $scope.photos);
                        $scope.viewPhoto = function (index) {
                            if ($scope.isDisabled) return;
                            var photo = $scope.photos;
                            if (typeof($scope.photos) == 'string') photo = [$scope.photos];
                            $rootScope.photoModalService.viewPhoto(photo, parseInt(index), $scope.category);
                        };
                    },
                    scope: {
                        photos: '=',
                        category: '=',
                        isDisabled: '='
                    },
                    link: function (scope, elem, attr, ctrl) {
                        elem.bind('click', function () {
                            var index = parseInt($(this).data('photo-index'));
                            if (isNaN(index)) {
                                index = $(elem.parent().children()).index($(elem));
                            }
                            scope.viewPhoto(index);
                        });
                    }
                };
            }
        ]).directive('bindHtmlUnsafe', function ($compile) {
            return function ($scope, $element, $attrs) {

              var compile = function (newHTML) { // Create re-useable compile function
                newHTML = $compile(newHTML)($scope); // Compile html
                $element.html('').append(newHTML); // Clear and append it
              };

              var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable 
              // Where the HTML is stored

              $scope.$watch(htmlName, function (newHTML) { // Watch for changes to 
                // the HTML
                if (!newHTML)
                  return;
                compile(newHTML);   // Compile it
              });

            };
          });
        

