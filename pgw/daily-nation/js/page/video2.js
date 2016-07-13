/**
 * Page - Video
 */

(function() {'use strict';

	var page = app.registerPage('page-video', {

		// initialize page layouts
		onPageInit: function() {
			$("#page-video-header.date").html((new Date()).toDateString());

			// remove AdMob Ad View
			window.plugins.AdMob.removeBannerView();
		},

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = $("#page-video-header").outerHeight();
			var heightFooter = $("#page-video-footer" ).outerHeight();
			$("#page-video-contents").css("height", heightWindow - heightHeader - heightFooter - 45);
		},

		// called when the page becomes visible
		onPageShow: function() {
            this.onResize();
			addSections();
			updateArticles();
		},

		// called when the page becomes invisible
		onPageHide: function() {
			$("#page-video-contents").html("");
		},

		// back button
		"$tap:#page-video-header .back": function() {
			$.mobile.changePage("#page-home", {transition: "slideup", reverse: true});

			// AdMob
			setTimeout(function(){
				window.plugins.AdMob.createBannerView({
				'publisherId': 'ca-app-pub-0846142691248784/2514832459',
				'adSize': 'SMART_BANNER'
			},
			function(e) {
				window.plugins.AdMob.requestAd({
					'isTesting': true,
					'extras': {
						'color_bg': 'ffffff',
						'color_bg_top': 'FFFFFF',
						'color_border': 'eaeaea',
						'color_link': '000080',
						'color_text': '808080',
						'color_url': '008000'
					},
				});
			});
			},1000);
			
		},

		// go to another section
		onGoSection: function(name) {
			currentCategory = name;
			updateArticles();
		},

		// Update Button on Sections Popup
		"$tap:#popup-videosections .update": function() {
			updateArticles(true);
		}
	});

	var videos = null;
	var slider = null;
	var flagLoading = false;

	//var currentCategory = app.getPage('page-home').getCurrentCategory();
	var currentCategory = "youtube";

	function updateArticles(flagUpdate) {
		flagLoading = true;
		$.mobile.showPageLoadingMsg();
		$("#page-video-body .empty").hide();
		app.data.get(currentCategory, function(data) {
			$.mobile.hidePageLoadingMsg();
			flagLoading = false;
			// make the articles content
			refreshVideoList(data);
		}, function(msg) {
			$.mobile.hidePageLoadingMsg();
			flagLoading = false;
			// failed
			console.log("Video list load Fail: " + msg);
		}, flagUpdate);
	}

 function refreshVideoList() {
 videos = app.data.getVideos(currentCategory);
 
 if (videos.length > 0) {
 $("#page-video-body .empty").hide();
 } else {
 $("#page-video-body .empty").show();
 }
 
 var html = "<div>";
 for (var i = 0; i < videos.length; i++) {
 var item = videos[i];
 var inner = item.video.caption;
 if (item.video.thumbnail != null) {
 inner = "<img src='" + item.video.thumbnail + "'>";
 }
 html += "<a href='" + item.video.path + "' data-video='true'>" + inner + "</a>";
 }
 html += "</div>";
 $("#page-video-contents").html(html);
 
 slider = $("#page-video-contents > div");
 if (videos.length > 1) {
 slider.fotorama({
                 width: $("#page-video-contents").width(),
                 height: $("#page-video-contents").height() ,
                 nav: "thumbs",
                 navposition: 'top',
                 thumbwidth: 180,
                 thumbheight: 120,
                 glimpse: 1,
                 thumbborderwidth: 1
                 });
 } else {
 slider.fotorama({
                 width: $("#page-video-contents").width(),
                 height: $("#page-video-contents").height(),
                 nav: false
                 })
 
 }
 
 slider.on("fotorama:show", function(event) {
           updateTitle();
           });
 updateTitle();
 }
 
 function updateTitle() {
 var index = slider.data('fotorama').activeIndex;
 var item = videos[index];
 }

	function addSections() {
		var list = $("#popup-videosections .list > div");
		var html = "<div id='youtube'>Youtube</div>"
		var sections = app.data.getSections();
		for (var i = 0; i < sections.length; i++) {
			var section = sections[i];
			html += "<div id='" + section + "'>" + app.data.getSectionTitle(section) + "</div>";
		}
		list.html(html);
		var iscroll = new iScroll($("#popup-videosections .list")[0], {useTransition: true, hScrollbar:false, vScrollbar: false});
		$("#popup-videosections").on("popupafteropen", function() {
			iscroll.refresh();
		});

		UiUtil.addTapListener($("#popup-videosections .list > div > div"), function() {
			if (flagLoading) {
				return;
			}
			page.onGoSection(this.id);
			$("#popup-videosections").popup("close");
		}, 3);
		
	}

})();


jQuery(document).ready(function($) {
    
});