angular.module('gnApp.directives', [])
  .directive('messagesSettingsMembers', [
    function($scope) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/messages-partials/messages-settings-members.html'
      }
    }
  ])
  .directive('messagesNewMembers', [
    function($scope) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/messages-partials/messages-new-members.html'
      }
    }
  ])
  .directive('messagesContactList', [
    function($scope) {
      return {
        restrict: 'E',
        templateUrl: 'templates/messages-partials/messages-contactlist-item.html'
      }
    }
  ])
  .directive('messagesRoomConversation', [
    function($scope) {
      return {
        restrict: 'E',
        templateUrl: 'templates/messages-partials/messages-room-conversation.html'
      }
    }
  ])
  .directive('appNotificationsCounter', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'templates/app-notifications-counter.html',
        link: function(scope, element, attrs) {

          var appNotificationsCounter = scope.appNotificationsCounter;
          var self = this;

          scope.$watch(function() {
            return appNotificationsCounter.getCounter()
          }, function(counter) {
            console.log('COUNTER WAS CHANGED', counter, appNotificationsCounter.getCounter());

            $(element).find('span').html(counter);
            if (counter > 0) {
              $(element).show();
            } else {
              $(element).hide();
            }
          });
        }
      }
    }
  ])
  .directive('chatMessagesCounter', [
    function(chatService) {
      return {
        restrict: 'E',
        templateUrl: 'templates/messages-partials/messages-counter.html',
        link: function(scope, element, attrs) {

          var chatService = scope.chatService;
          var self = this;

          scope.$watch(function() {
            return chatService.getNotReadMessages()
          }, function(counter) {
            console.log('COUNTER WAS CHANGED 1111', counter, chatService.getNotReadMessages());

            $(element).find('span').html(counter);
            if (counter > 0) {
              $(element).show();
            } else {
              $(element).hide();
            }
          });
        }
      }
    }
  ])
  .directive('groupMessagesCounter', [
    function(chatService) {
      return {
        restrict: 'E',
        templateUrl: 'templates/partials/groups-counter.html',
        link: function(scope, element, attrs) {
          var self = this;

          scope.$watch(function() {
            return scope.shared.groupBadges.total;
          }, function(counter) {
            $(element).find('span').html(counter);
            if (counter > 0) {
              $(element).show();
            } else {
              $(element).hide();
            }
          });
        }
      }
    }
  ])
  .directive('activeGroupMessagesCounter', [
    function(chatService) {
      return {
        restrict: 'E',
        scope: {
          group: '@group'
        },
        templateUrl: 'templates/partials/groups-counter.html',
        link: function(scope, element, attrs) {
          var self = this;

          scope.$watch(function() {
            var sharedData = scope.$root.shared;
            var groupId = JSON.parse(scope.group).objectId;
            if (sharedData && sharedData.groupBadges && sharedData.groupBadges.groups && sharedData.groupBadges.groups[groupId])
              return sharedData.groupBadges.groups[groupId];
            else
              return 0;
          }, function(counter) {
            $(element).find('span').html(counter);
            if (counter > 0) {
              $(element).show();
            } else {
              $(element).hide();
            }
          });
        }
      }
    }
  ])
  .directive('gnTel', [
    function() {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
          elem.bind('keydown', function(event) {
            var valid = true;
            if(this.value==='' && (event.keyCode===187 || event.keyCode===107)){ //if + is pressed

            }else{
              if ((event.keyCode > 47 && event.keyCode < 58) || (event.keyCode > 95 && event.keyCode < 106) || [8, 9, 46, 37, 39, 110].indexOf(event.keyCode) !== -1) {} else {
                event.preventDefault();
                valid = false;
              }
            }
            return valid;
          });
        }
      };
    }
  ])
  .directive('backgroundImage', function() {
    return function(scope, element, attrs) {
      attrs.$observe('backgroundImage', function(value) {

        function applyBackground(src) {
          element.css({
            'background-image': 'url(' + (src||'img/default_image.svg') + ')',
            'background-size': 'cover',
            'background-position': 'center center'
          });
        }

        applyBackground(value);
        return;

        var elImage = angular.element('<img src="' + value + '">');
        //document.body.appendChild(elImage[0]);
        ImgCache.isCached(value, function(path, success) {
          if (success) {
            ImgCache.useCachedFile(elImage, function() {
              applyBackground(elImage[0].src);
            }, function() {
              applyBackground(elImage[0].src);
            });
          } else {
            ImgCache.cacheFile(value, function() {
              ImgCache.useCachedFile(elImage, function() {
                applyBackground(elImage[0].src);
              }, function() {
                applyBackground(elImage[0].src);
              });
            }, function() {
              applyBackground(elImage[0].src);
            });
          }
        });
      });
    };
  })
  .directive('gnPasscode', [
    function($filter) {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
          elem.bind('keydown', function(event) {
            var valid = true;
            if ((event.keyCode > 47 && event.keyCode < 58) || (event.keyCode > 95 && event.keyCode < 106) || [8, 9, 46, 37, 39, 110].indexOf(event.keyCode) !== -1) {} else {
              event.preventDefault();
              valid = false;
            }
            ctrl.$setValidity('passcode', valid);
            return valid;
          });
          elem.bind('keyup', function(event) {
            if (this.value.length != 4) {
              ctrl.$setValidity('passcode', false);
            }
          });
        }
      };
    }
  ])
  .directive('cropimage', function() {
    return {
      replace: true,
      scope: {
        img: '=',
        onload: '&',
        imageError: '&',
        boxWidth: '=',
        boxHeight: '='
      },
      restrict: 'A',
      link: function postLink(scope, element, attr) {
        var targetImage;
        var aspectRatio = attr.aspectRatio;
        var minWidth = attr.minWidth;
        var minHeight = attr.minHeight;
        var maxWidth = attr.maxWidth || 0;
        var maxHeight = attr.maxHeight || 0;

        scope.clear = function() {
          if (targetImage) {
            targetImage.find('img').remove();
            targetImage.remove();
            targetImage = undefined;
            element.removeData('crop-data');
          }
        };

        scope.setupJCrop = function(targetImage, selection, imgWidth, imgHeight, cropCallback) {
          jQuery(targetImage).Jcrop({
            aspectRatio: aspectRatio,
            minSize: [minWidth, minHeight],
            maxSize: [maxWidth, maxHeight],
            trackDocument: true,
            onSelect: function(coords) {
              element.data('crop-data', coords);
              jQuery('.jcrop-viewport').css({
                opacity: 1.0,
                backgroundColor: ''
              });

              // Check to see if caller is sending in an additional callback
              if (typeof(cropCallback) === 'function') {
                cropCallback(coords);
              }
            },
            boxWidth: scope.boxWidth || 400,
            boxHeight: scope.boxHeight || 400
            //setSelect: selection,
            //trueSize: [imgWidth, imgHeight],
            //allowSelect: false
          });

        };

        scope.setup = function(sourceUrl, cropCallback) {
          var temp = new Image();
          temp.src = sourceUrl;
          temp.onload = function() {
            var imgWidth = this.width;
            var imgHeight = this.height;
            var incoming = jQuery(element).data('crop-data');
            var selection = [0, 0, (imgHeight / imgWidth < 0.75) ? 0.75 * imgWidth : imgWidth, (imgHeight / imgWidth > 0.75) ? 0.75 * imgHeight : imgHeight];
            if (typeof(incoming) !== 'undefined') {
              selection = [
                incoming.x,
                incoming.y,
                incoming.x + incoming.w,
                incoming.y + incoming.h
              ];
            }

            // Setup jCrop onto the target
            scope.setupJCrop(targetImage, selection, imgWidth, imgHeight, cropCallback);

            setTimeout(function() {
              scope.$apply('onload()');
            }, 800);
          };

          temp.onerror = function() {
            jQuery('#imageUnavailable').show();
            jQuery('#change-photo-modal').modal('show');
          };
        };

        scope.$watch('img', function(encodedImage) {
          if (!encodedImage) {
            // Call the handler setup to handle no images found
            scope.imageError();
            return;
          }
          element.html('');
          scope.clear();

          element.append('<img />');
          targetImage = element.find('img');
          targetImage.attr('src', encodedImage);

          var img = document.createElement('img');
          img.id = 'pic';
          img.src = encodedImage;
          img.onload = function() {
            var sourceCanvas = document.createElement('canvas');
            sourceCanvas.width = img.width;
            sourceCanvas.height = img.height;
            sourceCanvas.style.display = 'none';
            sourceCanvas.id = 'sourceCanvas';

            var exportCanvas = document.createElement('canvas');
            exportCanvas.id = 'exportCanvas';
            exportCanvas.style.display = 'none';
            var _w = 400;
            var _h = _w / aspectRatio;
            exportCanvas.width = _w;
            exportCanvas.height = _h;
            element.append(exportCanvas);

            var ctx = sourceCanvas.getContext('2d');
            ctx.clearRect(0, 0, _w, _h);
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Initialize the crop only when the source image is ready
            scope.setup(encodedImage, function(c) {
              var exportCanvas = document.getElementById('exportCanvas').getContext('2d');
              exportCanvas.fillStyle = 'rgb(255,255,255)';
              exportCanvas.fillRect(0, 0, _w, _h);
              var w = c.x2 - c.x;
              var h = c.y2 - c.y;
              exportCanvas.drawImage(sourceCanvas, c.x, c.y, w, h, 0, 0, _w, _h);
            });
          };
        });

      }
    };
  })
  .directive('ngCache', function() {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {

        attrs.$observe('ngSrc', function(src) {
          if (src === undefined) {
            return;
          }
          ImgCache.isCached(src, function(path, success) {
            if (success) {
              ImgCache.useCachedFile(el);
            } else {
              ImgCache.cacheFile(src, function() {
                ImgCache.useCachedFile(el);
              });
            }
          });
        });
      }
    }
  })
  .directive('autoGrowHeight', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var properties = [
            '-webkit-appearance',
            '-moz-appearance',
            '-o-appearance',
            'appearance',
            'font-family',
            'font-size',
            'font-weight',
            'font-style',
            'border',
            'border-top',
            'border-right',
            'border-bottom',
            'border-left',
            'box-sizing',
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'min-height',
            'max-height',
            'line-height'
          ],
          escaper = $('<span />');

        function convert(string) {
          return escaper.text(string).text()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
        }
        if (!elem.data('autogrow-applied')) {
          var textarea = jQuery(elem),
            initialHeight = textarea.innerHeight(),
            expander = $('<div />'),
            timer = null;
          // Setup expander
          expander.css({
            'position': 'absolute',
            'visibility': 'hidden',
            'top': '-99999px'
          });
          $.each(properties, function(i, p) {
            expander.css(p, textarea.css(p));
          });
          textarea.after(expander);
          // Setup textarea
          textarea.css({
            'overflow-y': 'hidden',
            'resize': 'none',
            'box-sizing': 'border-box'
          });
          // Sizer function
          var sizeTextarea = function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
              var value = convert(textarea.val()) + '<br>';
              expander.html(value);
              expander.css('width', textarea.innerWidth() + 2 + 'px');
              textarea.css('height', Math.max(expander.innerHeight(), initialHeight) + 'px');
            }); // throttle by 100ms
          };
          // Bind sizer to IE 9+'s input event and Safari's propertychange event
          textarea.on('input.autogrow propertychange.autogrow', sizeTextarea);
          // Set the initial size
          sizeTextarea();
          // Record autogrow applied
          textarea.data('autogrow-applied', true);
        }
      }
    };
  })
  .directive('openInappBrowser', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        $(elem).on('click', 'a', function(e){
          e.preventDefault();
          appStateManager.openUrl($(this).attr('href'));
        });
      }
    };
  })
  .directive('ellipsisText', function() {
    return {
      restrict: 'A',
      scope: {
        value: '=ellipsisText'
      },
      template: '<span ng-bind-html="processed | linkConvert"></span> '+
              '<a href="" class="toggle-collapse" ng-click="toggleCollapse()" ng-show="isShowLink">{{isCollapsed?"See More":"See Less"}}</a>',
      link: function(scope, elem, attrs) {
        var maxlen = 120;
        scope.processed = '';
        scope.isShowLink = false;
        scope.isCollapsed = true;
        scope.toggleCollapse = function(){
          scope.isCollapsed = !scope.isCollapsed;
          scope.process();
        };
        scope.process = function(){
          scope.value = scope.value || '';
          scope.isShowLink = scope.value.length > maxlen;
          if(scope.isShowLink && scope.isCollapsed){
            scope.processed = scope.value.substr(0, maxlen) + '...';
          }else{
            scope.processed = scope.value;
          }
        };
        scope.$watch('value', function(nVal){
          nVal = nVal || '';
          scope.process();
        });
      }
    };
  })
  .directive('ellipsisTextMention', function(Mentions) {
    return {
      restrict: 'A',
      scope: {
        value: '=ellipsisTextMention'
      },
      template: '<span ng-bind-html="processed | linkConvert"></span> '+
              '<a href="" class="toggle-collapse" ng-click="toggleCollapse()" ng-show="isShowLink">{{isCollapsed?"See More":"See Less"}}</a>',
      link: function(scope, elem, attrs) {
        var maxlen = 120;
        scope.processed = '';
        scope.isShowLink = false;
        scope.isCollapsed = true;
        scope.toggleCollapse = function(){
          scope.isCollapsed = !scope.isCollapsed;
          scope.process();
        };
        scope.process = function(){
          var object = scope.value;
          var body = '';
          var mentions = [];
          if(typeof object != 'object'){
            body = scope.value||'';
          }else{
            body = object.get('body')||'';
            mentions = object.get('mentions')||[];
          }
          
          scope.isShowLink = body.length > maxlen;
          if(scope.isShowLink && scope.isCollapsed){
            scope.processed = body.substr(0, maxlen) + '...';
          }else{
            scope.processed = body;
          }
          scope.processed = Mentions.parseMentionsInText(scope.processed, mentions);
        };
        scope.$watch('value', function(nVal){
          nVal = nVal || '';
          scope.process();
        });
      }
    };
  })
  .directive('footerKeyboard', function () {
    return function (scope, element, attrs) {
      ionic.on('native.keyboardshow', onShow, window);
      ionic.on('native.keyboardhide', onHide, window);

      //deprecated
      ionic.on('native.showkeyboard', onShow, window);
      ionic.on('native.hidekeyboard', onHide, window);


      var scrollCtrl;

      function onShow(e) {
        if (ionic.Platform.isAndroid()) {
          return;
        }

        //for testing
        var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
        element.css('bottom', keyboardHeight + "px");
        scrollCtrl = element.controller('$ionicScroll');
        if (scrollCtrl) {
          scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
        }
      }

      function onHide() {
        if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
          return;
        }

        element.css('bottom', '');
        if (scrollCtrl) {
          scrollCtrl.scrollView.__container.style.bottom = '';
        }
      }

      scope.$on('$destroy', function () {
        ionic.off('native.keyboardshow', onShow, window);
        ionic.off('native.keyboardhide', onHide, window);

        //deprecated
        ionic.off('native.showkeyboard', onShow, window);
        ionic.off('native.hidekeyboard', onHide, window);
      });
    };
  });
