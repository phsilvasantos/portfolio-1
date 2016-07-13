angular.module('gnApp.directives')
        .directive('imageUploader', function ($rootScope, Utils) {
          return {
            restrict: 'A',
            scope: {
              options: '=imageUploader'
            },
            controller: function ($scope) {
              var defaultOptions = {
              };

              for (var k in defaultOptions) {
                if (typeof ($scope.options[k]) === 'undefined') {
                  $scope.options[k] = defaultOptions[k];
                }
              }

              $scope.select = function () {
                return true;
              };
              if ($rootScope.shared.devicePlatform === 'android') {
                $('input:file').hide();
                $scope.select = function () {
                  appStateManager.switchContext(function(context) {
                    var option = {
                      destinationType: Camera.DestinationType.FILE_URI,
                      sourceType:Camera.PictureSourceType.PHOTOLIBRARY
                    };
                    navigator.camera.getPicture(function(uri){
                      context.switchBack();
                      convertImgToBase64(uri, function (base64Img) {
                        var tempNameArr = uri.split('/');
                        var fileName = correctFileName(tempNameArr[tempNameArr.length - 1]);
                        var parseFile = new Parse.File(fileName, {base64: base64Img});
                        $scope.options.success(parseFile);
                        $('#new_post_image').val('');
                      });
                    },function(){
                      console.log('Camera Plugin is Failed');
                    },
                    option);
                  });
                };
              } else {
                $('input:file').show();
                $(document).off('change', "input:file").on('change', "input:file", function () {
                  var file = this.files[0];
                  if (file) {
                    Utils.showIndicator();

                    var shouldResize = true;
                    if (file.name.indexOf('.gif') > -1) {
                      shouldResize = false;
                    }
                    if (shouldResize) {
                      $.canvasResize(file, {
                        width: 640,
                        quality: 100,
                        callback: function (content, width, height) {
                          var fileName = correctFileName(file.name);
                          var parseFile = new Parse.File(fileName, {base64: content});
                          $scope.options.success(parseFile);
                          $('input:file').val('');
                        }
                      });
                    } else {
                      var fileName = correctFileName(file.name);
                      var parseFile = new Parse.File(fileName, file);
                      $scope.options.success(parseFile);
                      $('input:file').val('');
                    }
                  } else {
                    Utils.alert('No new image to save.', 'Gen-Next');
                  }
                });
              }
            },
            link: function ($scope, ele, attrs, c) {
              var clickHandler = function () {
                $scope.select();
              };
              ele.unbind('click', clickHandler)
                      .bind('click', clickHandler);
            }
//            templateUrl: 'templates/partials/image-uploader.html'
          };
        })
