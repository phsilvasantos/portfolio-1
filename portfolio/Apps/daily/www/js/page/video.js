/**
 * Page - Video
 */

(function() {'use strict';

	var page = app.registerPage('page-video', {

		onPageInit: function() {
			find(".button.back").unbind();
			find(".button.back").click(function() {
				page.gotoHome();
			});
		},
		
		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = $("#page-video-header").outerHeight();
			var heightFooter = $("#page-video-footer" ).outerHeight();
            find(".contents").css("height", heightWindow - heightHeader - heightFooter - 65);
            find(".scroll-wrapper").css("height", find(".contents").height() - 240 + "px");
                                
            //console.log(find(".scroll-wrapper").height());
            //console.log(find(".scroller").height());
            
            
		},

		// called when the page becomes visible
		onPageShow: function() {
            //addSections();
            //refreshVideoList();
            updateArticles();
            this.onResize();
            
            
			
	        setTimeout(function() {
				echo.render();	
			}, 1000);
        },

		// called when the page becomes invisible
		onPageHide: function() {
			//$("#video_scroll_wrapper").html("");
		},

		// back button
		//"$tap:$ .button.back": function() {
		gotoHome: function() { 
			$.mobile.changePage("#page-home", {transition: "slideup", reverse: true});
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
	var scrollBody = null;
	var flagLoading = false;

	//var currentCategory = app.getPage('page-home').getCurrentCategory();
	var currentCategory = "youtube";
 
    function find(s) {
        return page.find(s);
    }

	function updateArticles(flagUpdate) {
		flagLoading = true;
		$.mobile.showPageLoadingMsg();
		//$("#page-video-body .empty").hide();
		app.data.get(currentCategory, function(data) {
			$.mobile.hidePageLoadingMsg();
			flagLoading = false;
			
			//console.log("Video log successed");

			refreshVideoList(data);
			
		}, function(msg) {
			$.mobile.hidePageLoadingMsg();
			flagLoading = false;
			// failed
			console.log("Video list load Fail: " + msg);
		}, flagUpdate);
	}

	function refreshVideoList(data) {
		videos = data.items;
		
		if (videos.length > 0) {
			$("#page-video-body .empty").hide();
		} else {
			$("#page-video-body .empty").show();
		}
 
 		var html = "";
		for (var i = 0; i < videos.length; i++) {
			var item = videos[i];
			var inner = item.video.caption;
            var start = (i%5 == 0)? "start" : "";
            if (item.video.thumbnail != null) {
				inner = "<img src='img/lazy.png' data-echo='" + item.video.thumbnail + "'>";
			}

			html += '<div class="four columns ng-scope ' + start + '" data-video="true">'
                 + '<a class="video" data-href="' + item.video.path + '">'
                 + '<h3><span class="ng-binding">' + item.video.caption + '</span></h3>'
                 + inner + '</a></div>';
        }
		html += "<div class='clearfix'></div>";
		$("#video-grid").html(html);
 		
		echo.init({
			offset: 100,
			throttle: 250,
			unload: false,
			callback: function (element, op) {
			    $(element).load(function() {
			    	scroller(element);
				});
			}
        });

        scroller();
 
        $("#page-video-contents a.video").bind("click", function() {
            var url = $(this).data("href");
            var ref = window.open( url, '_blank', 'location=no');
        });
 
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

	function scroller(element) {
		var h = find(".video").eq(0).height();
		if(element) {
			h = $(element).parents(".video").height();
		}
		
		if(videos.length>0)
			find(".scroller").height(Math.ceil(videos.length/5) * (h+10));
		//console.log(h);
		//console.log(find(".scroller").height());
         
		if (scrollBody != null) {
                                
            scrollBody.refresh();
        }
        else {
            scrollBody = new iScroll(find(".scroll-wrapper")[0], {
	            snap:true,
	            useTransition: true,
	            vScrollbar: false,
	            hScrollbar: false,
	            onScrollEnd: function() {
	            	echo.render();
	            }
	        });
        }

        
	}

})();