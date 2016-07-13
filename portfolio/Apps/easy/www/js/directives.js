organizate.directive('efDate', function () {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      console.log(attrs.efDate);
      attrs.efDate = moment(new Date(attrs.efDate*1)).calendar();
      el.text(attrs.efDate);
    }
  }
}).directive('backgroundImage', function () {
  return function (scope, element, attrs) {
    attrs.$observe('backgroundImage', function (value) {

      function applyBackground(src) {
        element.css({
          'background-image': 'url(' + (src || 'img/default_image.svg') + ')',
          'background-size': 'cover',
          'background-position': 'center center'
        });
      }

      applyBackground(value);
      return;

      var elImage = angular.element('<img src="' + value + '">');
      //document.body.appendChild(elImage[0]);
      ImgCache.isCached(value, function (path, success) {
        if (success) {
          ImgCache.useCachedFile(elImage, function () {
            applyBackground(elImage[0].src);
          }, function () {
            applyBackground(elImage[0].src);
          });
        } else {
          ImgCache.cacheFile(value, function () {
            ImgCache.useCachedFile(elImage, function () {
              applyBackground(elImage[0].src);
            }, function () {
              applyBackground(elImage[0].src);
            });
          }, function () {
            applyBackground(elImage[0].src);
          });
        }
      });
    });
  };
}).directive('ngCache', function () {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      attrs.$observe('ngSrc', function (src) {
        if (src === undefined) {
          return;
        }
        ImgCache.isCached(src, function (path, success) {
          if (success) {
            ImgCache.useCachedFile(el);
          } else {
            ImgCache.cacheFile(src, function () {
              ImgCache.useCachedFile(el);
            });
          }
        });
      });
    }
  }
}).directive('autoGrowHeight', function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
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
        $.each(properties, function (i, p) {
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
        var sizeTextarea = function () {
          clearTimeout(timer);
          timer = setTimeout(function () {
            var value = convert(textarea.val()) + '<br>';
            expander.html(value);
            expander.css('width', textarea.innerWidth() + 2 + 'px');
            textarea.css('height', Math.max(expander.innerHeight(), initialHeight) + 2 + 'px');
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
});
