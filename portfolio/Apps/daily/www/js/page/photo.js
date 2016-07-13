/**
 * Page - Photo
 */

(function(window, $, PhotoSwipe) {'use strict';

	var page = app.registerPage('page-photo', {

		onPageInit: function() {
			find(".button.back").unbind();
			find(".button.back").click(function() {
				page.gotoHome();
			});
		},

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = find(".ui-header").outerHeight();
			var heightFooter = find(".ui-footer").outerHeight();
			find(".contents").css("height", heightWindow - heightHeader - heightFooter - 65);
            find(".scroll-wrapper").css("height", find(".contents").height() - 300 + "px");
                                
			var w = find(".gallery-item").width();
			find(".gallery-item").height(w*0.66);
                                
            if (scrollBody != null) {
                scrollBody.refresh();
            }
            else {
                
                
            }

		},

		// called when the page becomes visible
		onPageShow: function(e) {

			photos = app.data.getPhotos();
			var html = "<div class='gallery-row'>";
			for (var i = 0; i < photos.length; i++) {
				var item = photos[i];
				html += '<div class="gallery-item"><a href="' + item.photo.path + '">'
					  + '<img src="img/lazy.png" data-echo="' + item.photo.path + '" alt="' + item.title + '"/></a>'
					  + '<div class="photo-title">' + item.title + '</div></div>';
			}
			html += "</div>";

			find(".photo-gallery").html(html);

			this.onResize();
                              
            /*
            echo.init({
				offset: 100,
				throttle: 250,
				unload: false,
				callback: function (element, op) {
					console.log("LOG020: ", element.src, 'has been', op + 'ed in Photo');
					
				}
			});
			*/
			setTimeout(function() {
				echo.render();	
			}, 1000);
            
			var currentPage = $(e.target), options = {
                /*getToolbar : function() {
                    return '<div class="ps-toolbar-close" style="padding-top: 11px;">Back</div><div class="ps-toolbar-play" style="padding-top:11px;">Play</div><div class="ps-toolbar-previous" style="padding-top: 11px;">Previous</div><div class="ps-toolbar-next" style="padding-top:11px;">Next</div>';
                }*/
            }, photoSwipeInstance = $("#photo_gallery a", e.target).photoSwipe(options, currentPage.attr('id'));
		},

		// called when the page becomes invisible
		onPageHide: function(e) {
			//find(".contents").html("");
            var currentPage = $(e.target), photoSwipeInstance = PhotoSwipe.getInstance(currentPage.attr('id'));
            if ( typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
                PhotoSwipe.detatch(photoSwipeInstance);
            }
            return true;
		},

		// go to home page
		//"$tap:$ .button.back": function() {
		gotoHome: function() { 
			//$.mobile.changePage("#page-home", {transition: "slideup", reverse: true});
            parent.history.back();
		},
	});


	function find(s) {
		return page.find(s);
	}

	var photos = null;
    var scrollBody = null;
 
 
    document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function() {
        	scrollBody = new iScroll(find(".scroll-wrapper")[0], {
                snap:true,
                useTransition: true,
                vScrollbar: false,
                hScrollbar: false,
                onScrollEnd: function() {
                	echo.render();
                }
            });
			
        }, 200);
    }, false);

})(window, window.jQuery, window.Code.PhotoSwipe);

/*
( function(window, $, PhotoSwipe) {

	$(document).ready(function() {
		$('#page-photo').on('pageshow', document, function(e) {
			var currentPage = $(e.target), options = {
			}, photoSwipeInstance = $("#photo_gallery a", e.target).photoSwipe(options, currentPage.attr('id'));

			return true;
		}).on('pagehide', document, function(e) {
			var currentPage = $(e.target), photoSwipeInstance = PhotoSwipe.getInstance(currentPage.attr('id'));
			if ( typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
				PhotoSwipe.detatch(photoSwipeInstance);
			}
			return true;
		});
	});

}(window, window.jQuery, window.Code.PhotoSwipe));
*/