/**
 * UI Utility functions
 */

var UiUtil = null;

(function() {'use strict';

	// Get the WebBrowser Vendor for Cross-Browser Feature
	var sampleTemporaryStyle = document.createElement('div').style;
	var vendor = (function() {
		var vendors = 't,webkitT,MozT,msT,OT'.split(',');
		for (var i = 0; i < vendors.length; i++) {
			var t = vendors[i] + 'ransform';
			if ( t in sampleTemporaryStyle) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}
		return false;
	})();
	// Vendor specific style name
	function prefixStyle(style) {
		if (vendor == '') {
			return style;
		}
		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	}

	// Transform Style Name
	var transform = prefixStyle('transform');
	var transformOrigin = prefixStyle('transformOrigin');
	var transitionProperty = prefixStyle('transitionProperty');
	var transitionDuration = prefixStyle('transitionDuration');
	var transitionTimingFunction = prefixStyle('transitionTimingFunction');
	var transitionDelay = prefixStyle('transitionDelay');

	var EVENT_TRANSITION_END = (function() {
		if (vendor === false)
			return false;
		var transitionEnd = {
			'' : 'transitionend',
			'webkit' : 'webkitTransitionEnd',
			'Moz' : 'transitionend',
			'O' : 'otransitionend',
			'ms' : 'MSTransitionEnd'
		};
		return transitionEnd[vendor];
	})();

	UiUtil = {

		// apply cross-browser transition
		applyTransformTransition : function(obj, value, duration, func, callbackEnd) {
			UiUtil.applyTransition(obj, transform, value, duration, func, callbackEnd);
		},
		applyTransition : function(obj, property, value, duration, func, callbackEnd) {
			obj.style[transitionProperty] = property;
			if ( typeof (duration) == "number") {
				duration = duration + "ms";
			}
			obj.style[transitionDuration] = duration;
			if (func == null) {
				func = "linear";
			}
			obj.style[transitionTimingFunction] = func;
			obj.style[transitionDelay] = 0;
			if (callbackEnd != null) {
				$(obj).bind(EVENT_TRANSITION_END, callbackEnd);
			}
			obj.style[property] = value;
		},
		applyTransform : function(obj, value, origin) {
			obj.style[transform] = value;
			if (origin != null) {
				obj.style[transformOrigin] = origin;
			}
		},
		setTransformOrigin : function(obj, origin) {
			obj.style[transformOrigin] = origin;
		},

		// one-position tap
		addTapListener : function(jobj, func, size) {
			if (size == null) {
				size = $(window).width() * 0.03;
			}
			jobj.on("vmousedown", function(event) {
				var data = this;
				data.down_app_rel_x = event.pageX;
				data.down_app_rel_y = event.pageY;
				data.down_app_rel_max = 0;
			});
			// collects touch informations
			jobj.on("vmousemove", function(event) {
				var data = this;
				if (data.down_app_rel_x != null && data.down_app_rel_y != null) {
					var dx = event.pageX - data.down_app_rel_x;
					var dy = event.pageY - data.down_app_rel_y;
					var abs = Math.sqrt(dx * dx + dy * dy);
					if (abs > data.down_app_rel_max) {
						data.down_app_rel_max = abs;
					}
				}
			});
			// allow only tap on one-position tap
			jobj.on("vmouseup", function(event) {
				var data = this;
				if (data.down_app_rel_x != null && data.down_app_rel_y != null) {
					data.down_app_rel_x = null;
					data.down_app_rel_y = null;
					if (data.down_app_rel_max < size) {
						func.call(this, event);
					}
				}
			});

		}
	};

})();
