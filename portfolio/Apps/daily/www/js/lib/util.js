/**
 * Generic Utility functions
 */

var Util = null;

(function() {'use strict';

	Util = {
		// phone attributes
		isPhone : function() {
			return Util.isAndroid() || Util.isIphone();
		},
		isAndroid : function() {
			var userAgent = Util.getUserAgent();
			userAgent = userAgent.toUpperCase();
			return (userAgent.indexOf("ANDROID") >= 0);
		},
		isIphone : function() {
			var userAgent = Util.getUserAgent();
			userAgent = userAgent.toUpperCase();
			return (userAgent.indexOf("IPHONE") >= 0);
		},

		// check cordova
		isCordova : function() {
			return window.cordova != null;
		}
		// get browser user agent
		,
		getUserAgent : function() {
			return navigator.userAgent;
		},

		// Get Current time in milliseconds
		getCurrentTimeInMilliseconds : function() {
			return new Date().getTime();
		},

		// Generate a random value (0, 1)
		random : function() {
			var time = Util.getCurrentTimeInMilliseconds();
			return (Math.floor(time * 100 + (Math.random() * 10000)) % 10000) / 10000;
		},

		// Copy Javascript object contents
		copyObject : function(dst, src) {
			for (var attr in src) {
				if (src.hasOwnProperty(attr)) {
					dst[attr] = src[attr];
				}
			}
		},

		// load script dynamically
		loadScript : function(url, onReady) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			if (onReady != null) {
				script.onload = onReady;
			}
			document.documentElement.appendChild(script);
		},

		// remove all html tags
		strip : function(html) {
		   var tmp = document.createElement("DIV");
		   tmp.innerHTML = html;
		   return tmp.textContent || tmp.innerText || "";
		},

		cutLen : function(str, len) {
			if(str.length > len) {
				str = str.substring(0, len);
				str = str + " ...";
			}
			return str;
		},

		removeElements : function(text, selector) {
		    var wrapped = $("<div>" + text + "</div>");
		    wrapped.find(selector).remove();
		    return wrapped.html();
		}
	};

})();
