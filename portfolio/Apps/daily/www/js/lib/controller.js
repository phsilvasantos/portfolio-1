/**
 * Application Controller
 */

var Controller = function() {
};
(function() {'use strict';

	Controller.prototype = {
		id : "controller", 
		mobilePages: {},
		
		// register jQuery Mobile Page
		registerPage: function(pageId, page) {
			var self = this;
			self.mobilePages[pageId] = page;
			// register common functions to page
			makePage(self, pageId, page);
			return page;
		},
		// get registered page
		getPage: function(pageId) {
			var self = this;
			return self.mobilePages[pageId];
		}
	};
	
	/**
	 * Page related functions
	 * 
	 * Events for Page objects
	 * - onPageInit(event, ui): called on jQuery mobile event "pageinit"
	 * - onPageShow(event, ui): called on event "pageshow"
	 * - onPageHide(event, ui): called on event "pagehide"
	 * - onResize: called on window resize event
	 * Custom events format
	 * 	"$eventName:selector":function(event, element) {}
	 */ 
	// register common functions to page
	function makePage(self, pageId, page) {
		page.getId = function() {
			return pageId;
		};
		page.getSelector = function() {
			return "#" + pageId;
		}
		page.find = function(selector) {
			return $(this.getSelector() + " " + selector);
		}
		// add event listeners
		$('#' + pageId).on("pageinit", function(event, ui) {
			if (page.onPageInit != null) {
				page.onPageInit(event, ui);
			}
		});
		$('#' + pageId).on("pageshow", function(event, ui) {
			if (page.onPageShow != null) {
				page.onPageShow(event, ui);
			}
		});
		
		$('#' + pageId).on("pagebeforeshow", function(event, ui) {
			if (page.onPageBeforeShow != null) {
				page.onPageBeforeShow(event, ui);
			}
		});
		
		$('#' + pageId).on("pagehide", function(event, ui) {
			if (page.onPageHide != null) {
				page.onPageHide(event, ui);
			}
		});
		// register jquery events
		for (var key in page) {
			var handler = page[key];
			if (typeof(handler) == "function" && key[0] == '$') {
				var index = key.indexOf(":");
				var eventName = key.substring(1, index);
				var selector = key.substring(index+1);
				if (selector[0] == '$') {
					selector = page.getSelector() + " " + selector.substring(1);
				}
				(function(page, eventName, selector, handler) {
					$(selector).on(eventName, function(event) {
						handler.call(page, event, this);
					});
				})(page, eventName, selector, handler);
			}
		}
	}

})();

// initialize application context instance
window.app = new Application();

(function() {'use strict';

	var __app = app;
	var __controller = new Controller();

	// Set Controller
	__app.getController = function() {
		return __controller;
	};
	// register functions to application
	for (var key in __controller) {
		var item = __controller[key];
		if ( typeof (item) == "function") {
			(function(item) {
				__app[key] = function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
					return item.call(__controller, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
				};
			})(item);
		}
	}
})();

