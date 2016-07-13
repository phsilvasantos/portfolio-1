angular.module('gnApp.directives')
        .directive('photoFullView', [
          function ($scope) {
            return {
              restrict: 'AE',
              replace: true,
              controller: function ($scope, $rootScope, $ionicSlideBoxDelegate, $timeout, Utils) {
                
                $scope.viewPhoto = function (index) {
                  if($scope.isDisabled){
                    return;
                  }
                  $rootScope.photoModalService.photos = $scope.photos;
                  $rootScope.photoModalService.category = $scope.category;
                  $rootScope.photoModal.show();

                  var photoIndex = parseInt(index) || 0;
                  Utils.showIndicator();
                  $('.modal-photoview .slider-slides').css('opacity', 0);
                  $timeout(function(){
                    $ionicSlideBoxDelegate.slide(photoIndex);
                    Utils.hideIndicator();
                  }, 500);
                  $timeout(function(){
                    $('.modal-photoview .slider-slides').css('opacity', 1);
                  }, 800);
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
                  if(isNaN(index)){
                    index = $(elem.parent().children()).index($(elem));
                  }
                  scope.viewPhoto(index);
                });
              }
            };
          }
        ]);

$(document).off('click', '.modal-photoview .modal-content');
$(document).on('click', '.modal-photoview .modal-content', function (e) {
  if(!$(e.target).hasClass('.actions') && $(e.target).closest('.actions').length === 0){
    $(this).toggleClass('hide-caption');
  }
});