/**
 * Page - Settings / Refresh Interval
 */

(function() {'use strict';

	var page = app.registerPage('page-settings-refreshinterval', {

		// initialize page layouts
		onPageInit: function() {
		},

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = $(this.getSelector() + " .ui-header").outerHeight();
			$(this.getSelector() + " .ui-content").outerHeight(heightWindow - heightHeader + 1);
		},

		// called when the page becomes visible
		onPageShow: function() {
			this.onResize();
		},

		// called when the page becomes invisible
		onPageHide: function() {
		},

		// before creating page
		"$pagebeforecreate:#page-settings-refreshinterval": function() {
			loadSetting();
		},

		// change option
		"$change:#page-settings-refreshinterval input": function(event, src) {
			if (src.value == "choice-1") {
				app.data.setExpirySeconds(3600);
			} else if (src.value == "choice-2") {
				app.data.setExpirySeconds(1800);
			} else if (src.value == "choice-3") {
				app.data.setExpirySeconds(900);
			} else if (src.value == "choice-4") {
				app.data.setExpirySeconds(300);
			} else if (src.value == "choice-5") {
				app.data.setExpirySeconds(0);
			}
		}
	});

	function loadSetting() {
		var time = app.data.getExpirySeconds();
		var index = 0;
		if (time == 3600) {
			index = 1;
		} else if (time == 1800) {
			index = 2;
		} else if (time == 900) {
			index = 3;
		} else if (time == 300) {
			index = 4;
		} else if (time == 0) {
			index = 5;
		}
		$('#page-settings-refreshinterval input[value="choice-' + index + '"]').attr("checked", "checked");
	}

})();

