/**
 * Page - Settings / Push Tweet
 */

(function() {'use strict';

	var page = app.registerPage('page-settings-pushtweet', {

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
		"$pagebeforecreate:#page-settings-pushtweet": function() {
			loadSetting();
		},

		// change option
		"$change:#page-settings-pushtweet input": function(event, src) {
			if (src.value == "choice-1") {
				app.data.setPushTweet(true);
			} else if (src.value == "choice-2") {
				app.data.setPushTweet(false);
			} 
		}
	});

	function loadSetting() {
		var val = app.data.getPushTweet();
		
		if (val) {
			$('#page-settings-pushtweet input[value="choice-1"]').attr("checked", "checked");
		} else {
			$('#page-settings-pushtweet input[value="choice-2"]').attr("checked", "checked");
		} 
	}

})();

