/**
 * Page - Settings / Text Size
 */

(function() {'use strict';

	var page = app.registerPage('page-settings-textsize', {

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
		"$pagebeforecreate:#page-settings-textsize": function() {
			loadSetting();
		},

		// change option
		"$change:#page-settings-textsize input": function(event, src) {
			if (src.value == "choice-1") {
				app.data.setFontSize("small");
			} else if (src.value == "choice-2") {
				app.data.setFontSize("medium");
			} else if (src.value == "choice-3") {
				app.data.setFontSize("big");
			} else if (src.value == "choice-4") {
				app.data.setFontSize("huge");
			}
		}
	});

	function loadSetting() {
		var size = app.data.getFontSize();
		var index = 0;
		if (size == "small") {
			index = 1;
		} else if (size == "medium") {
			index = 2;
		} else if (size == "big") {
			index = 3;
		} else if (size == "huge") {
			index = 4;
		}
		$('#page-settings-textsize input[value="choice-' + index + '"]').attr("checked", "checked");
	}

})();

