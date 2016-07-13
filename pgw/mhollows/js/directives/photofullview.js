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
                  
                  $rootScope.photoModalService.viewPhoto($scope.photos, parseInt(index), $scope.category);
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
  if(!$(e.target).hasClass('.bottom-meta') && $(e.target).closest('.bottom-meta').length === 0){
    $(this).toggleClass('hide-caption');
  }
});