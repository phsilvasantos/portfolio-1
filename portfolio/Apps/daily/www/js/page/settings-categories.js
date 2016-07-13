/**
 * Page - Settings / Categories
 */

(function() {'use strict';

	var page = app.registerPage('page-settings-categories', {

		// initialize page layouts
		onPageInit: function() {
			iscroll = new iScroll($(this.getSelector() + " .wrapper")[0], {vScrollbar: false, useTransition: true});
			
			$("#page-settings-categories .settingsBack").unbind();
			$("#page-settings-categories .settingsBack").bind('tap', function(e) {
				e.preventDefault();
				$.mobile.changePage("#page-settings", { transition: "fade"});
				return false;
			});
		},

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = $(this.getSelector() + " .ui-header").outerHeight();
			$(this.getSelector() + " .ui-content").outerHeight(heightWindow - heightHeader -65);
			var height = $(this.getSelector() + " .ui-content").height();
			$(this.getSelector() + " .wrapper").height(height-300);
			if (iscroll != null) {
				iscroll.refresh();
			}
		},

		// called when the page becomes visible
		onPageShow: function() {
			this.onResize();
		},

		// called when the page becomes invisible
		onPageHide: function() {
		},

		// before creating page
		"$pagebeforecreate:#page-settings-categories": function() {
			loadSetting();
		},

		// change the category visible
		"$change:#page-settings-categories select": function(event, src) {
			event.preventDefault();

			var label = src.name;
			var value = src.value == "on";
			var sections = app.data.getAllSections();

			var exist = false;
			for(var i=0; i<sections.length; i++) {
				if(app.data.getSectionLabel(sections[i]) == label) {
					app.data.setSectionVisible(sections[i], value);
					exist = true;
					return false;
				}
			}
			if(!exist)
				console.log("No exist section - " + label);
			return false;
		}
	});

	var iscroll = null;
	function loadSetting() {
		var sections = app.data.getAllSections();
		for (var i = 0; i < sections.length; i++) {
			var section = sections[i];
			var label = app.data.getSectionLabel(section);
			if (app.data.isSectionVisible(section)) {
				$('#page-settings-categories select[name="' + label + '"] [value="on"]').attr("selected", "selected");
			} else {
				$('#page-settings-categories select[name="' + label + '"] [value="off"]').attr("selected", "selected");
			}
		}
	}

})();

