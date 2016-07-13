angular.module('gnApp.directives')
        .directive('imageCropper', function ($rootScope, $ionicModal) {
          return {
            restrict: 'A',
            scope: {
              options: '=imageCropper'
            },
            controller: function ($scope) {
              var defaultOptions = {
              };

              for (var k in defaultOptions) {
                if (typeof ($scope.options[k]) === 'undefined') {
                  $scope.options[k] = defaultOptions[k];
                }
              }

              $ionicModal.fromTemplateUrl('templates/partials/modal-photocropper.html', {
                scope: $scope,
                animation: 'slide-in-up'
              }).then(function (modal) {
                $scope.photocropperModal = modal;
              });
              $scope.$on('modal.shown', function () {
                $('#image-cropper').cropit();
                if ($rootScope.shared.devicePlatform === 'android') {
                  $('input:file').hide();
                  $('.btn-select-file').off('click').on('click', function (e) {
                    appStateManager.switchContext(function(context) {
                      var option = {
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType:Camera.PictureSourceType.PHOTOLIBRARY
                      };
                      navigator.camera.getPicture(function(uri){
                        console.log('selected file', uri);
                        if($('#image-cropper').cropit('imageSrc') != uri)
                          $('#image-cropper').cropit('imageSrc', uri);
                        
                        context.switchBack();
                      },function(){
                        console.log('Camera Plugin is Failed');
                      },
                      option);
                    });
                  });
                }
              });
              $scope.$on('$destroy', function () {
                $scope.photocropperModal.remove();
              });
              $scope.showModal = function () {
                $scope.photocropperModal.show();
              };
              $scope.finishEditPhoto = function () {
                var imageData = $('#image-cropper').cropit('export');
                if (imageData) {
                  $scope.options.success(imageData);
                }
                $scope.photocropperModal.hide();
              };
            },
            link: function ($scope, ele, attrs, c) {
              var clickHandler = function () {
                $scope.showModal();
              };
              ele.unbind('click', clickHandler)
                      .bind('click', clickHandler);
            }
          };
        });
