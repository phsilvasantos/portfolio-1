/**
 * Page - Article
 */

var DISQUS_TIMER = null;

(function() {
	'use strict';

	var currentCategory = "";
	var articles = [];
	var currentIndex = null;
	var currentItem = null;
	var currentContent = "";
	var scrollBody = null;
	var scrollTrending = null;
	var pager = null;
	var flagLoading = false;
	var disqus_ids = [];
	
	var page = app.registerPage('page-article', { 
		// show an article
		setArticle: function(item, items, index, category) {
			find(".page-to-top").hide();

			if(scrollBody) {
				scrollBody.scrollTo(0,0,200);
			}
			if(scrollTrending) {
				//scrollTrending.scrollTo(0,0);
			}

			currentItem = item;

			if(items) articles = items;
			if(index !== false) currentIndex = index;
			if(category) currentCategory = category;

			if(items) {
				if(pager) 
					pager.destroy();
				
				updateArticles(articles);
			}

			//console.log("setArticle" + currentIndex + " length" + articles.length);

			currentItem.lastLoadedTime = Date.now();
			localStorage['dailynation_current_article'] = JSON.stringify(currentItem);
		},

		// initialize the page
		onPageInit: function() {

			find(".button.back").unbind().click(function() {
				page.gotoHome();
			});

			// Font size
			find(".button.fontsize").unbind().click(function() {
				$("#popup-fontsize").popup('open', {
					positionTo: find(".button.fontsize")
				});
			});

			// Binding bookmark save/remove
			find(".button.bookmark").unbind().click(function() {
				if($(this).hasClass("saved")) {
					$(this).removeClass("saved");
					app.data.removeFavouriteArticle(currentItem.title);
				}
				else {
					$(this).addClass("saved");
					app.data.saveFavouriteArticle(currentItem);
				}

				app.getPage("page-home").refreshPage();
			});

			//Load trending articles
			app.data.get('trending', function(data) { applyTrendingArticles(data.items); });
			
			find(".page-to-top .nav-top").unbind().click(function() {
				if(scrollBody) {
					scrollBody.scrollTo(0,0,200);
				}

				scrollTo(0, 0);

				find(".page-to-top").hide();
			});
		},

		// the page becomes visible
		onPageShow: function() {
			find(".page-to-top").hide();

			this.onResize();
			setTextSizeFromSetting();

			//console.log("onPageShow" + currentIndex + " length" + articles.length);

			if(pager) {
				pager.destroy();
			}

			//Swipe left/right
			
			var dragendObj =  find("#articles").dragend({
				pageClass : "article",
				minDragDistance : "400",
				page: currentIndex,
				afterInitialize: function() {
		        	//console.log("afterInitialize");
		        	applyArticle();
		        },
		        onSwipeStart : function() {
		        	console.log("onSwipeStart");
		        },
		        onSwipeEnd : function(a, b) {
		        	var page = pager.getPage();
		        	if(currentIndex != page) {
		        		currentIndex = page;
		        		//console.log("onSwipeEnd" + currentIndex);
		        		currentItem = articles[currentIndex];
		        		applyArticle();
		        	}
		        }
			});

			pager = $(dragendObj).data("dragend");
			
		},

		// resize all elements according to the screen
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = find(".ui-header").outerHeight();
			var heightFooter = find(".ui-footer").outerHeight();
			find(".ui-content").outerHeight(heightWindow - heightHeader - heightFooter - 90);
			
			refreshBodySize();

			//echo.render();
		},

		// get current category
		getCurrentCategory: function() {
			return currentCategory;
		},

		// go to home page
		//"$tap:$ .button.back": function() {
		gotoHome: function() { 
			//$.mobile.changePage("#page-home", {transition: "slideup", reverse: true});
            
			clearInterval(DISQUS_TIMER);

			parent.history.back();
			
			return false;
		},
		
		/*
		// show Font-size menu
		"$tap:$ .button.fontsize": function() {
			$("#popup-fontsize").popup('open', {
				positionTo: find(".button.fontsize")
			});
		},
		*/
		
		// show Share menu
		"$tap:$ .button.share": function() {
			
			if(!currentItem)
				return false;

			window.plugins.socialsharing.iPadPopupCoordinates = function() {
				var rect = $(".button.share").get(0).getBoundingClientRect();
				//alert(rect.left + "," + rect.top + "," + rect.width + "," + rect.height);
				return rect.left + "," + rect.top  + "," + rect.width + "," + rect.height;
			};

			// Social sharing
			var photo = (currentItem.photo && currentItem.photo.path)? currentItem.photo.path: null;
            window.plugins.socialsharing.share( currentItem.story, currentItem.title, photo, currentItem.link);
                                
		},

		// called on font-size select on Font-size menu
		"$tap:#popup-fontsize li a": function(event, src) {
			var id = src.id;
			setTextSize(id);

			refreshBodySize();
		},
		// called when the share menu becomes visible
		"$popupafteropen:#popup-share": function() {
			if (currentItem == null) {
				return;
			}
		}
	});
	function find(s) {
		return page.find(s);
	}
	
	function updateDateTimeOnHeader(date) {
		if (date == null) {
			find(".ui-header .time .value").html("");
			find(".ui-header .date").html("");
			return;
		}
		var strTime = date.toTimeString();
		find(".ui-header .time .value").html(strTime);
		var strDate = date.toDateString();
		find(".ui-header .date").html(strDate);
	}
	var iscrollCategories = new iScroll($("#popup-sections .list")[0], {
		useTransition: true,
		hScrollbar: false,
		vScrollbar: false
	});
	var iscrollSections = new iScroll($("#popup-sections .sub-list")[0], {
		useTransition: true,
		hScrollbar: false,
		vScrollbar: false
	});

	function addSections() {
		var list = $("#popup-sections .list > div");
		var html = "<div id='TopNews'>Top News</div><div id='Photos'>Photos</div><div id='Videos'>Videos</div>"
		var categories = app.data.getSectionCategories();
		for (var i = 0; i < categories.length; i++) {
			var category = categories[i];
			html += "<div id='" + category + "' class='category'>" + category + "</div>";
		}
		list.html(html);
		$("#popup-sections").on("popupafteropen",
		function() {
			iscrollCategories.refresh();
		});
		$("#popup-sections").on("popupafterclose",
		function() {
			$("#popup-sections .sub-list-container").css("left", "23rem");
		});
		UiUtil.addTapListener($("#popup-sections .list > div > div"),
		function() {
			page.onGoCategory(this.id);
		}, 3);

		$("#popup-sections .sub-list-container").on("tap", function() {
			$("#popup-sections .sub-list-container").css("left", "23rem");
		});
	}

	function preventDefault(e) {
	  e = e || window.event;
	  if (e.preventDefault)
	      e.preventDefault();
	  e.returnValue = false;  
	}

	function disable_scroll(el) {
		$(el).unbind("scroll");
		$(el).bind("scroll", function(e) { 
			preventDefault(e); 
		});
	}

	function refreshBodySize() {
		
		var heightWindow = $(window).height();
		var heightHeader = find(".ui-header").outerHeight(true);
		var heightFooter = find(".ui-footer").outerHeight(true);
		var heightContent = find(".ui-content").height();
		var heightTrending = find(".trending-articles").outerHeight(true);
		
		find(".contents").css("height", heightContent);
        
        find(".scroll-wrapper").css("height", find(".contents").height() - 180);
		
        var articleId = "#article_" + currentIndex;
        $(articleId).css("height", "auto");

        //console.log($(articleId).outerHeight(true));
		//console.log($(articleId).find(".disqus-thread").outerHeight(true));

		var articleHeight = $(articleId).outerHeight(true);
		
		find("#articles").height(articleHeight + 10);	

		if(pager) {
			pager.updateInstance();
		}
		
		if(scrollBody) {
			setTimeout(function () {
				scrollBody.refresh();
			}, 0);
		}
		else {
			scrollBody = new iScroll(find(".scroll-wrapper")[0], {
				useTransition: true,
				vScrollbar: false,
	            hScrollbar: false,
	            scrollX: false,
	            scrollY: true,
	            onScrollStart: function() {
	            	//console.log("onScrollStart");
	            },
	            onScrollEnd: function() {
	            	echo.render();

	            	if(scrollBody.y < -200) {
	            		find(".page-to-top").fadeIn(200);
	            	}
	            	else {
	            		find(".page-to-top").hide();
	            	}
	            }
	        });
		}
		
		if(scrollTrending != null) {
			scrollTrending.refresh();
		}
	}

	function updateArticles(items) {
		find(".swipe-wrapper").html('<div class="articles" id="articles"></div>');

		for(var i=0; i<items.length; i++) {
			find("#articles.articles").append('<div class="article full" id="article_' + i + '">'
				+ '<div class="article-content">'
					+ '<div class="subcategory"></div>'
					+ '<div class="titlee"></div>'
					+ '<div class="split"></div>'
					+ '<div class="desc">'
						+ '<font class="author"></font>'
						+ '<font class="datee"></font>'
					+ '</div>'
					+ '<div class="story">'
	                    + '<div class="photo">'
	                        + '<img /><br />'
	                        + '<div class="caption"></div>'
	                    + '</div>'
					+ '</div>'
					+ '<div class="disqus-thread"></div>'
				+ '</div>'
			+ '</div>');

	        setArticleContent(items[i], i);
		}

	}
	
	function setArticleContent(item, i) {
		if(i === false)
			i = currentIndex;
		var id = "#article_" + i;
		
		find(id + " .subcategory").html(item.subCategory.toUpperCase());
		find(id + " .titlee").html(item.title);
		if (item.photo != null && item.photo.path != "") {
            find(id + " .photo").show();
			var img = find(id + " .photo img")[0];
            $(img).attr("src", "img/lazy.png");
            $(img).attr("data-echo", item.photo.path);
 			img.onload = function() {

			};
			find(id + " .photo .caption").html(item.photo.caption);
 
		} else {
            find(id + " .photo").hide();
			var img = find(id + " .photo img")[0];
			img.src = "";
			find(id + " .photo .caption").html("");
		}
 
		var datePrefix = " ";
		if (item.author != null && item.author != "") {
			find(id + " .author").html("By " + item.author.toUpperCase());
			datePrefix = " | ";
		} else {
			find(id + " .author").html("");
		}
		find(id + " .datee").html(datePrefix + item.articleDate);

		var content = item.story.replace(/(?:\r\n|\r|\n)/g, '<br />');
        find(id + " .photo").after(content);
 
 		if(i == currentIndex)
        	currentContent = content;
    }

	function applyArticle() {
		find(".page-to-top").hide();

		if(scrollBody)
			scrollBody.scrollTo(0,0,200);

		var articleId = "#article_" + currentIndex;
		var item = currentItem;

		//Favourite
		if(app.data.checkFavouriteArticle(item.title)) {
			$(".button.bookmark").addClass("saved");
		}
		else {
			$(".button.bookmark").removeClass("saved");
		}
		
		console.log(item.link);
		
		echo.render();

		/*
		$(articleId).find('.disqus-thread').html("<p><a href='javascript:void(0)'>Go to website to DISQUS</a></p>");

		$(articleId).find('.disqus-thread a').unbind();
		$(articleId).find('.disqus-thread a').bind('click', function() {
			var disqus_ref = window.open(item.link + "#disqus_thread", '_blank', 'location=no');
			return false;
		});

		setTimeout(function() {
			refreshBodySize();
		}, 500);
		*/

		$('.disqus-thread').html("");
		$(articleId).find('.disqus-thread').html('<div id="disqus_thread"></div>');
		
		// DISQUS.reset
		DISQUS.reset({
			reload: true,
			config: function() {
				this.page.identifier = "disqus_identifier" + articleId;
				this.page.title = item.title;
				this.page.url = item.link;
				
				this.callbacks.onReady.push(function() { 
					console.log("onReady");

					// add dummy wrapper to fix scroll issue.
					//if(find('#disqus_thread').length > 0)
					//	$(articleId).find('#disqus_thread').find('#dummy-wrapper').remove().end().prepend('<div id="dummy-wrapper" style="position: absolute;height: 100%;top: 0;width: 100%;left: 0;"></div>');

					clearInterval(DISQUS_TIMER);
					var disqus_count = 0;

					DISQUS_TIMER = setInterval(function() {
						disqus_count ++;
						refreshBodySize();
						if(disqus_count > 10)
							clearInterval(DISQUS_TIMER);
					}, 1000);
				});
			},
		});

		//clearInterval(DISQUS_TIMER);

		// add dummy wrapper to fix scroll issue.
		/*
		DISQUS_TIMER = setInterval(function(){
			if(find('#disqus_thread').length > 0)
				find('#disqus_thread').find('#dummy-wrapper').remove().end().prepend('<div id="dummy-wrapper" style="position: absolute;height: 100%;top: 0;width: 100%;left: 0;"></div>');
		}, 1000);
		*/
	}

	function setTextSizeFromSetting() {
		var size = 14;
		var textSize = app.data.getFontSize();
		setTextSize(textSize);
	}

	function setTextSize(size) {
		var articleId = "#article_" + currentIndex;
		var ja = $(articleId).find(".story");
		ja.removeClass("small");
		ja.removeClass("medium");
		ja.removeClass("big");
		ja.removeClass("huge");
		ja.addClass(size);
	}

	function applyTrendingArticles(trending_articles) {
		var trending_width = 0;
		$(".trending-scroller").html("");

		for(var i=0; i<trending_articles.length; i++) {
			var item = trending_articles[i];
			var trending_html = "<div class='trending-article' id='trending_article_" + i + "'>";

			if(item.photo && item.photo.path != '') {
				trending_html += "<div class='trending-photo'><img src='img/lazy.png' data-echo='" + item.photo.path + "' /></div>"
					+ "<div class='trending-content'>";
				trending_width += 256;
			}
			else {
				trending_html += "<div class='trending-content no-picture'>";
				trending_width += 205;
			}
			trending_html += "<p>" + item.category + " | " + item.subCategory + "</p>"
				+ item.title + "</div><div class='clearfix'></div></div>";

			$(".trending-scroller").append(trending_html);

			$("#trending_article_" + i).data("articleJSON", item);
			$("#trending_article_" + i).unbind().bind("tap", function(e) {
				e.preventDefault();

				var item = $(this).data("articleJSON");
				page.setArticle(item, null, false, null);
				setArticleContent(item, false);
				applyArticle();

				return false;
			});
		}

		$(".trending-scroller").append("<div class='clearfix'></div>");

		$("#trending_article_" + (trending_articles.length - 1)).addClass("end-item")
		
		find(".trending-scroller").width(trending_width);

		if(!scrollTrending) {
			
			scrollTrending = new iScroll(find(".trending-wrapper")[0], {
				useTransition: true,
				vScrollbar: false,
	            hScrollbar: false,
	            scrollX: true,
	            scrollY: false,
	            onScrollEnd: function() {
	            	echo.render();
	            }
			});
		}
		else {
			scrollTrending.refresh();
		}
		
	}

	
})();