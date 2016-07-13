/**
 * Page - Home
 */

(function() {'use strict';

	var ADMOB_KEY = "ca-app-pub-0846142691248784/2514832459";
	var GA_CODE = "UA-53405409-3";
	var HOME_PAGE_INIT = false;

	var page = app.registerPage('page-home', {

		// initialize page
		onPageInit: function() {
			var self = this;
			updateDateTimeOnHeader(null);
			setTimeout(function() {
				updateArticles();

				app.data.get("trending");
				
				// Twiticker
				//handleTwiticker();

				
			}, 100);

			/*
			 * Load last article before to go DISQUS
			 */
			/*
			var disqus_callback = localStorage.getItem('dailynation_callback_disqus');
			var last_article = localStorage.getItem('dailynation_current_article');
			
			if(disqus_callback != null && last_article != null) {
				disqus_callback = parseInt(disqus_callback);
				console.log("disqus_callback " + disqus_callback);
				var lastArticle = JSON.parse(last_article);
				console.log("lastArticle " + lastArticle);
				var expired_seconds = Math.ceil((disqus_callback - lastArticle.lastLoadedTime) / 1000);
				console.log("Expred callback disqus " + expired_seconds);
				if(expired_seconds < 3600 * 24) {
					//app.getPage("page-article").setArticle(lastArticle);
					//$.mobile.changePage( "#page-article", { } );
				}
			}
			
			localStorage.removeItem('dailynation_callback_disqus');
			localStorage.removeItem('dailynation_current_article');
			*/
		},

		onPageBeforeShow: function() {

			if(!HOME_PAGE_INIT) {
				setTimeout(function() {
					getBreakingNews();
					
					// AdMob
					createAdmobBanner();

					// GA
					createGA();
				}, 500);

				HOME_PAGE_INIT = true;
			}
			
		},

		// the page becomes visible
		onPageShow: function() {
			addSections();
			var that = this;
			setTimeout(function(){
				that.onResize();
				
				echo.init({
		            offset: 100,
					throttle: 250,
					unload: false,
					callback: function (element, op) {
						if(op === 'load') {
							$(element).load(function() {
								var article = $(element).parents("article");
								//console.log(article.data("shape"));
								resizeArticle(article);
							});
						}
					}
				});


			}, 500);
			
		},

		// resize all elements according to window
		onResize: function() {
			var heightWindow = $(window).height();
			var heightHeader = find(".ui-header").outerHeight();
			var heightFooter = find(".ui-footer").outerHeight();
			var height = heightWindow - heightHeader;// - heightFooter - 70;
			find(".ui-content").outerHeight(height + 1);
			var heightContent = find(".ui-content").height() - 1;
			find(".articles").height(heightContent);

			/*added by Yun*/
			find("#home_right_side").css("height", (heightContent-30) + "px");
			find(".ui-content").css("font-size", ((heightContent-30) / 100) + "px");
			if (pager != null) {
				var width = find(".articles").width();
				var height = find(".articles").height();
				pager.resize({
					width: width,
					height: height - 80
				});
			}

		},

		// Update Button on Sections Popup
		"$tap:#popup-sections .update": function() {
			updateArticles(true);

			// remove AdMob Ad View
			//window.plugins.AdMob.removeBannerView();
		},

		// called when the user tap an article
		onGoArticle: function(index) {
			if (articles[index] != null) {
				
				// remove AdMob Ad View
				//window.plugins.AdMob.removeBannerView();

				app.getPage("page-article").setArticle(articles[index], articles, index, currentCategory);
				$.mobile.changePage( "#page-article", { transition: "slideup"} );
			}
		},
		
		refreshPage: function() {
			if(currentCategory == "Saved") {
				updateArticles();
			}
		},
		
		// called when the user tap a category on Sections Popup
		onGoCategory: function(name) {
			if (name == "TopNews") {
				if (flagLoading) {
					return;
				}
				currentCategory = '<i class="fa fa-fax"></i> News';
				updateArticles();
				$("#popup-sections").popup("close");
				$.mobile.changePage("#page-home"); 
			}
            else if(name == "TopStories") {
                if (flagLoading) {
                	return;
                }
                currentCategory = '<i class="fa fa-fax"></i> Top Stories';
                updateArticles();
                $("#popup-sections").popup("close");
                $.mobile.changePage("#page-home"); 
            }
            else if (name == "Photos") {
				if (flagLoading) {
					return;
				}
				$.mobile.changePage("#page-photo", { transition: "slideup"});
				$("#popup-sections").popup("close");
			} else if (name == "Videos") {
				if (flagLoading) {
					return;
            	}
                //alert($('#temp').html());
                $('#video_cont').html($('#temp').html());
				$.mobile.changePage("#page-video", { transition: "slideup"});
				$("#popup-sections").popup("close");
			} else if (name == "Saved") {
				if (flagLoading) {
					return;
                
				}
                currentCategory = name;
				updateArticles();
				$("#popup-sections").popup("close");
				$.mobile.changePage("#page-home");
			} else {
				var html = ""
				var sections = app.data.getSectionsInCategory(name);
				for (var i = 0; i < sections.length; i++) {
					var section = sections[i];
					html += "<div id='" + section + "' class='section'>" + app.data.getSectionTitle(section) + "</div>";
				}
				$("#popup-sections .category-title").html(name);
				$("#popup-sections .sub-list > div").html(html);
				$("#popup-sections .sub-list-container").show();
				$("#popup-sections .sub-list-container").css("left", "170px");

				iscrollSections.refresh();
				UiUtil.addTapListener($("#popup-sections .sub-list > div > div"), function() {
					page.onGoSection(this.id);
				}, 3);
			}
		},

		// called when the user tap a section on Sections Popup
		onGoSection: function(name) {
			if (flagLoading) {
				return;
			}
			currentCategory = name;
			updateArticles();
			$("#popup-sections").popup("close");
			$.mobile.changePage("#page-home");
		},

		// get current category
		getCurrentCategory: function() {
			return currentCategory;
		}
	});
	/*
	function handleTwiticker() {
		if(find('#twitcker-marquee').length == 0) {
			setTimeout(handleTwiticker, 500);
		}
		else {
			console.log("twitcker-marquee loaded");
			find("#twitcker-marquee .box").die('click');
			find("#twitcker-marquee .box>a").die('click');
			find("#twitcker-marquee .box>a").live('click', function(e) {
				e.preventDefault();
				console.log($(this).attr('href'));
				var tweeticker = window.open($(this).attr('href'), '_blank', 'location=no');
				return false;
			});
		}
	}
	*/

	var xmlBreakingNews = "http://www.nation.co.ke/breaking.xml";

	function getBreakingNews(){
  	  $('#twitcker-bar a.logo').unbind();
      $('#twitcker-bar a.logo').bind("tap", function(e) {
        e.preventDefault();
        
        var ref = window.open('http://twitter.com/NationBreaking', '_blank', 'location=no');

        return false;
      });
      
  	  $.ajax({
	    url: xmlBreakingNews,
	    dataType:'xml',
	    type:'GET',
	    error:function(res, textStatus, errorThrown) {
	      console.log("Error breaking-news :" + res.responseText);
	    },
	    success:function(data) {
	      //console.log(data);
	      
	      $("#twitcker-marquee").marquee("destroy");
	      /*
	      var breaking_html = '<div class="box"><a href="http://twitter.com/NationBreaking/status/503460839048089601" title="Tweeted 2 hours ago">HEAVY GUNFIRE exchange in Rhamu town, Mandera North constituency since early morning in fresh inter-clan rivalry.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503158637842276353" title="Tweeted 22 hours ago">#OKOAkenya starts search for referendum signatures at Embakasi Girls Sec school in Nairobi </a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503115652685500416" title="Tweeted on 8/23/2014, 5:44">FIVE PEOPLE feared dead after a matatu plunged into Athi River on Mombasa Road.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503089267426353153" title="Tweeted on 8/23/2014, 4:00">WHO WARNS that the current Ebola outbreak is spreading unusually fast and that it would take months to fight it.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503089040527478784" title="Tweeted on 8/23/2014, 3:59">SIERRA LEONE to review relationship with Kenya and several other African countries over isolation following the Ebola outbreak.</a></div><div class="box"><a href="http://twitter.com/NationBreaking/status/503088238962044928" title="Tweeted on 8/23/2014, 3:55">It\'s D-Day for Uhuru, Raila as MCAs meet#referendum #OkoaKenya </a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/501738271202758657" title="Tweeted on 8/19/2014, 10:31">ETHIOPIA OVERTAKES Kenya as the largest refugee hosting country in Africa, sheltering 629,718 refugees due to #SouthSudan conflict.</a></div><div class="box"><a href="http://twitter.com/NationBreaking/status/503158637842276353" title="Tweeted 22 hours ago">#OKOAkenya starts search for referendum signatures at Embakasi Girls Sec school in Nairobi </a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503115652685500416" title="Tweeted on 8/23/2014, 5:44">FIVE PEOPLE feared dead after a matatu plunged into Athi River on Mombasa Road.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503089267426353153" title="Tweeted on 8/23/2014, 4:00">WHO WARNS that the current Ebola outbreak is spreading unusually fast and that it would take months to fight it.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503115652685500416" title="Tweeted on 8/23/2014, 5:44">FIVE PEOPLE feared dead after a matatu plunged into Athi River on Mombasa Road.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503089267426353153" title="Tweeted on 8/23/2014, 4:00">WHO WARNS that the current Ebola outbreak is spreading unusually fast and that it would take months to fight it.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503089040527478784" title="Tweeted on 8/23/2014, 3:59">SIERRA LEONE to review relationship with Kenya and several other African countries over isolation following the Ebola outbreak.</a></div><div class="box"><a href="http://twitter.com/NationBreaking/status/503088238962044928" title="Tweeted on 8/23/2014, 3:55">It\'s D-Day for Uhuru, Raila as MCAs meet#referendum #OkoaKenya </a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/501738271202758657" title="Tweeted on 8/19/2014, 10:31">ETHIOPIA OVERTAKES Kenya as the largest refugee hosting country in Africa, sheltering 629,718 refugees due to #SouthSudan conflict.</a></div><div class="box"><a href="http://twitter.com/NationBreaking/status/503158637842276353" title="Tweeted 22 hours ago">#OKOAkenya starts search for referendum signatures at Embakasi Girls Sec school in Nairobi </a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503115652685500416" title="Tweeted on 8/23/2014, 5:44">FIVE PEOPLE feared dead after a matatu plunged into Athi River on Mombasa Road.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/501738271202758657" title="Tweeted on 8/19/2014, 10:31">ETHIOPIA OVERTAKES Kenya as the largest refugee hosting country in Africa, sheltering 629,718 refugees due to #SouthSudan conflict.</a></div><div class="box"><a href="http://twitter.com/NationBreaking/status/503158637842276353" title="Tweeted 22 hours ago">#OKOAkenya starts search for referendum signatures at Embakasi Girls Sec school in Nairobi </a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503115652685500416" title="Tweeted on 8/23/2014, 5:44">FIVE PEOPLE feared dead after a matatu plunged into Athi River on Mombasa Road.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503089267426353153" title="Tweeted on 8/23/2014, 4:00">WHO WARNS that the current Ebola outbreak is spreading unusually fast and that it would take months to fight it.</a></div>'
	      + '<div class="box"><a href="http://twitter.com/NationBreaking/status/503115652685500416" title="Tweeted on 8/23/2014, 5:44">FIVE PEOPLE feared dead after a matatu plunged into Athi River on Mombasa Road.</a></div>';
	          
	      $("#twitcker-marquee").html(breaking_html);
		  */
	      
	      if($(data).find("item").length > 0) {
			  $(data).find("item").each(function (idx) {
			    var breakingNews = {
			      id: idx,
			      title: $(this).find("title").text(),
			      url: $(this).find("link").text().trim()
			    };
			    
			    var boxHtml = '<div class="box"><a href="javascript:void(0)" title="' + breakingNews.title + '" id="breaking_news_' + idx + '">' + breakingNews.title + '</a></div>';

			    $("#twitcker-marquee").append(boxHtml);

			    $('#breaking_news_' + idx).data("breakingNews", breakingNews);
			  });
			  
			  $("#twitcker-marquee").marquee();
			  
			  $('#twitcker-marquee div.box a').unbind();
			  $('#twitcker-marquee div.box a').bind("tap", function(e) {
			    e.preventDefault();
			    
			    var item = $(this).data("breakingNews");
			    var ref = window.open(item.url, '_blank', 'location=no');

			    //var ref = window.open($(this).attr("href"), '_blank', 'location=no');
			    
			    return false;
			  });

			  $("#twitcker-bar").show();
	      }
	      else {
	      	$("#twitcker-bar").hide();
	      }
	    }
	  });
	}
				
	function createAdmobBanner() {
		if(window.plugins.AdMob) {
			window.plugins.AdMob.createBannerView({
				'publisherId': 'ca-app-pub-0846142691248784/2514832459', //ABMOB_KEY,
				'adSize': 'BANNER'//'IAB_MRECT'
			},
			function(e) {
				window.plugins.AdMob.requestAd({
					'isTesting': false,
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
		}
		else {
			console.log('AdMob plugin not available/ready.');
			
			setTimeout(createAdmobBanner, 500);

			return false;
		}
		
	}

	function createGA() {
	  if( analytics ) {
	    analytics.startTrackerWithId(GA_CODE);
	    analytics.trackView('Tablet View');
	    //analytics.debugMode()
	  }
	  else {
	    alert('GA plugin not available/ready.');

	    setTimeout(createGA, 500);

	    return false;
	  }
	}


	function find(s) {
		return page.find(s);
	}

	var currentCategory = '<i class="fa fa-fax"></i> News';
	var pager = null;
	var flagLoading = false;
	var articles = [];

	function updateDateTimeOnHeader(date) {
		var div = document.createElement("div");
		div.innerHTML = currentCategory;
		var category = div.textContent || div.innerText || "";
		find(".last-update .title1").html(category);
 
		if (date == null) {
			find(".last-update .time .value").html("");
			find(".last-update .date").html("");
			return;
		}
		var strTime = $.format.date(date.getTime(), "h:m a");
		var offset = date.getTimezoneOffset();
		offset = offset / 60 * (-1);
		offset = (offset<0)? offset: "+" + offset;
		strTime = strTime + " (UTC" + offset + ")";
		find(".last-update .time .value").html(strTime);
 
		var strDate = $.format.date(date.getTime(), "ddd, MMMM d, yyyy");
		find(".last-update .date").html(strDate);
	}

	function updateArticles(flagUpdate) {
		flagLoading = true;

		$("#no-saved-articles").hide();
		$.mobile.showPageLoadingMsg();

		if(currentCategory == "Saved") {
			$("#page-home").removeClass("has-rightsidebar");
			$("#home_right_side, #ticker_widget").css("display", "none");
			if($("#tweetstream").is(":hidden")) {
	            setTimeout(function(){
					$("#tweetstream").css("display", "block");
				},1000);
	        }

			var items = app.data.getFavouriteArticles();

			$.mobile.hidePageLoadingMsg();
			flagLoading = false;

			updateDateTimeOnHeader();

			setSavedArticleContent(items);
		}
		else {	
			app.data.get(currentCategory, function(data) {
				//navigator.splashscreen.hide();
				$.mobile.hidePageLoadingMsg();
				flagLoading = false;
				// update the time first
				updateDateTimeOnHeader(new Date(data.updatedTime));
				// make the articles content
				setArticleContent(data);
			}, 
			function(msg) {
				$.mobile.hidePageLoadingMsg();
				flagLoading = false;
				// failed
				console.log("Article Load Fail: " + msg);
			}, flagUpdate);
		}
	}

	function setArticleContent(data) {
		var items = data.items;
		articles = items;
		
		// compute page count
		var pageCount = Math.floor(items.length / 5);
		if (items.length % 5 > 0) {
			pageCount++;
		}
		// make the content
		var html = "<div class='pager'>";
		for (var i = 0; i < pageCount; i++) {
			var type = "main";
			if (i == 0) {
				type = "home";
			}
			html += makeArticlePage(type, [items[i*5], items[i*5+1], items[i*5+2], items[i*5+3], items[i*5+4]], i*5);
		}
		html += "</div>";
		
		find(".articles").html(html);

    	find(".articles article").each(function(i, article) {
			resizeArticle(article);
		});	

		find(".articles > div.pager").on('fotorama:showend', function (e, fotorama) {
        	echo.render();
        	find(".articles article").each(function(i, article) {
				//resizeArticle(article);
			});	

        });
		
		var heightWindow = $(window).height();
		var heightHeader = find(".ui-header").outerHeight();
		var heightFooter = find(".ui-footer").outerHeight();
		var height = heightWindow - heightHeader;// - heightFooter - 70;
		find(".ui-content").outerHeight(height + 1);
		var heightContent = find(".ui-content").height() - 1;
		find(".articles").height(heightContent);

		//var width = find(".articles").width();
		var width = $(window).width();

		if($("#page-home").hasClass("has-rightsidebar")) {
			//width = width * 0.85;
		}
		
		var height = find(".articles").height();
		
        pager = find(".articles > div.pager").fotorama({
            width: width,
            height: height - 80,
            click: false,
            arrows: false
        }).data("fotorama");
	}

	function resizeArticle(article) {
		var shape = $(article).data("shape");
		var h = $(article).innerHeight();
		var ht = $(article).find(".title").outerHeight(true);
		var hp = $(article).find(".article_photo").outerHeight(true);
		
		if(shape == "shape0") {
			$(article).find(".content").height(h-ht-hp-15);
		}
		else if(shape == "shape1") {
			$(article).find(".content").height(h-ht-12);
		}
		else if(shape == "shape2") {
			$(article).find(".content").height(h-ht-hp-15);
		}
		else if(shape == "shape3") {
			$(article).find(".content").height(h-ht-12);
		}
		else if(shape == "shape4") {
			$(article).find(".content").height(h-ht-12);
		}
	}

	function setSavedArticleContent(items) {
		if(!items) {
			find(".articles").html("");
			$("#no-saved-articles").show();
			return;
		}

		articles = items;
		// compute page count
		var pageCount = Math.floor(items.length / 5);
		if (items.length % 5 > 0) {
			pageCount++;
		}
		// make the content
		var width = find(".articles").width();
		var height = find(".articles").height();
		var html = "<div class='pager'>";
		for (var i = 0; i < pageCount; i++) {
			var type = "main";
			if (i == 0) {
				type = "home";
			}

			var page_items = [];
			for(var j=0; j<5; j++) {
				//if(isset(items[i*5+j]))
					page_items.push(items[i*5+j]);
				//else
				//	page_items.push(false);
			}

			html += makeArticlePage(type, page_items, i*5);
		}
		html += "</div>";
		find(".articles").html(html);

		find(".articles article").each(function(i, article) {
			resizeArticle(article);
		});	

		find(".articles > div.pager").on('fotorama:showend', function (e, fotorama) {
        	echo.render();
        	find(".articles article").each(function(i, article) {
				//resizeArticle(article);
			});	

        });
		
        pager = find(".articles > div.pager").fotorama({
            width: width,
            height: height - 80,
            click: false,
            arrows: false
        }).data("fotorama");
	}

	function makeArticlePage(type, items, index) {
		var ret = "";
		if (type == "home") {
			ret = "<div class='page type1'>"
					+ "<article id='article" + (index) + "' class='col0 article preview article0' data-shape='shape0'><div>" + makeArticle("col2_big", items[0]) + "</div></article>"
					+ "<div class='col_split'></div>"
					+ "<div class='col1'>"
						+ "<div class='row row0'>"
							+ "<article id='article" + (index+1) + "' class='article preview article1' data-shape='shape1'><div>" + makeArticle("simple_bottom", items[1]) + "</div></article>"
                            + "<div class='col_split'></div>"
							+ "<article id='article" + (index+2) + "' class='article preview article2' data-shape='shape1'><div>" + makeArticle("simple_bottom", items[2]) + "</div></article>"
						+ "</div>"
						+ "<div class='row_split'></div>"
						+ "<div class='row row1'>"
							+ "<article id='article" + (index+3) + "' class='article preview article3' data-shape='shape1'><div>" + makeArticle("simple_bottom", items[3]) + "</div></article>"
                            + "<div class='col_split'></div>"
							+ "<article id='article" + (index+4) + "' class='article preview article4' data-shape='shape1'><div>" + makeArticle("simple_bottom", items[4]) + "</div></article>"
						+ "</div>"
					+ "</div>"
				+ "</div>";
		} else if (type == "main") {
			ret = "<div class='page type2'>"
					+ "<article id='article" + (index) + "' class='col0 article preview article0' data-shape='shape2'><div>" + makeArticle("simple_top", items[0]) + "</div></article>"
					+ "<div class='col_split'></div>"
					+ "<div class='col1'>"
						+ "<div class='row0'>"
							+ "<article id='article" + (index+1) + "' class='article preview article1' data-shape='shape3'><div>" + makeArticle("simple_bottom", items[1]) + "</div></article>"
							+ "<div class='col_split'></div>"
							+ "<article id='article" + (index+2) + "' class='article preview article2' data-shape='shape3'><div>" + makeArticle("simple_bottom", items[2]) + "</div></article>"
						+ "</div>"
						+ "<div class='row_split'></div>"
						+ "<article id='article" + (index+3) + "' class='row1 article preview article3' data-shape='shape4'><div>" + makeArticle("col2_right", items[3]) + "</div></article>"
					+ "</div>"
					+ "<div class='col_split'></div>"
					+ "<article id='article" + (index+4) + "' class='col2 article preview article4' data-shape='shape2'><div>" + makeArticle("simple_top", items[4]) + "</div></article>"
				+ "</div>";
		}
		ret = ret.replace(/<article /g, "<article onmousedown='onArticleMouseDown.call(this, event)' ontouchstart='onArticleTouchStart.call(this, event)' ");
		return ret;
	}

	function makeArticle(type, item) {
		if (item == null || !item) {
			var ret = "";
			var vStart = "<div class='article_" + type + "'>";
			var vEnd = "</div>";
			var vContent = "<div class='content'></div>";
			
			var vPhoto = "<div class='article_photo'><img src='img/lazy.png' ></div>";
			
			ret = vStart + vPhoto + vContent + vEnd;

			return ret;
		}
		
		var ret = "";
		var vStart = "<div class='article_" + type + "'><div class='title'>" + item.title + "</div>";
		var vEnd = "</div>";
		var vContent = "<div class='content'><div class='desc'>";
		if (item.author != "") {
			vContent += "<span class='author'>By " + item.author.toUpperCase() + ", </span>";
		}
		
		var vPhoto = "";
		if (item.photo != null && item.photo.path != "") {
			vPhoto = "<div class='article_photo'><img src='img/lazy.png' data-echo='" + item.photo.path + "' ></div>";
		}
		else {
			vPhoto = "<div class='article_photo'><img src='img/lazy.png' ></div>";
		}

		var story = Util.removeElements(item.story, "a");
		story = Util.removeElements(story, "table");
		story = Util.removeElements(story, "font");
		
		if (type == "col2_big") {
			var txtlen = 800;
			if(vPhoto == "")
				txtlen = 2500;
			vContent += "<span class='date'>" + item.articleDate + "</span></div>" + story + "</div>";
			ret = vStart + vPhoto + vContent + vEnd;
		} else if (type == "simple_bottom") {
			vContent += "<span class='date'>" + item.articleDate + "</span></div>" + story + "</div>";
			ret = vStart + vContent + vEnd;
		} else if (type == "simple_top") {
			var txtlen = 560;
			if(vPhoto == "")
				txtlen = 1080;
			vContent += "<span class='date'>" + item.articleDate + "</span></div>" + story + "</div>";
			ret = vStart + vPhoto + vContent + vEnd;
		} else if (type == "col2_right") {
			var txtlen = 480;
			if(vPhoto == "")
				txtlen = 700;
			vContent += "<span class='date'>" + item.articleDate + "</span></div>" + story + "</div>";
			ret = vStart + vPhoto + vContent + vEnd;
		}
		return ret;
	}

	var iscrollCategories = new iScroll($("#popup-sections .list")[0], {useTransition: true, hScrollbar:false, vScrollbar: false});
	var iscrollSections = new iScroll($("#popup-sections .sub-list")[0], {useTransition: true, hScrollbar:false, vScrollbar: false});
	function addSections() {
		var list = $("#popup-sections .list > div");
		var html = "<div id='TopStories'><i class='fa fa-rss-square'></i> Top Stories</div><div id='TopNews'><i class='fa fa-rss-square'></i> News</div><div id='Photos'><i class='fa fa-photo (alias)'></i> Pho<span class='hidden'></span>tos</div><div id='Videos'><i class='fa fa-video-camera'></i> Videos</div>";
		var categories = app.data.getSectionCategories();
		for (var i = 0; i < categories.length; i++) {
			var category = categories[i];
			html += '<div id="' + category + '" class="category">' + category
				 + '<div class="popup-indicator"></div>'
				 + '</div>';
		}

		html += "<div id='Saved'><i class='fa fa-folder-open'></i> Saved</div>";

		list.html(html);
		
		$("#popup-sections").on("popupafteropen", function() {
			iscrollCategories.refresh();
		});
		$("#popup-sections").on("popupafterclose", function() {
			$("#popup-sections .sub-list-container").css("left", "15rem");
			$("#popup-sections .sub-list-container").hide();
			$("#popup-sections .popup-indicator").hide();
		});

		UiUtil.addTapListener($("#popup-sections .list > div > div"), function() {
			page.onGoCategory(this.id);

			$("#popup-sections .popup-indicator").hide();
			$(this).find(".popup-indicator").show();
		}, 3);

		$("#popup-sections .sub-list-container").on("tap", function() {
			$("#popup-sections .sub-list-container").css("left", "15rem");
			$("#popup-sections .sub-list-container").hide();
			$("#popup-sections .popup-indicator").hide();
		});
	}

	/*
		Article Touch Controller
	*/
	function processTap(self) {
		if (self.data_tap) {
			var index = parseInt(self.id.substring(7));
			page.onGoArticle(index);
		}
	}

	function processTouch(self, event) {
		var dx = event.clientX - self.data_start_x;
		var dy = event.clientY - self.data_start_y;
		if (dx * dx + dy * dy > 10) {
			self.data_tap = false;
		}
		return;
		var newScrollY = self.data_scroll_y - dy;
		if (newScrollY < 0) {
			newScrollY = 0;
		}
		var max = self.childNodes[0].offsetHeight;
		if (newScrollY > max) {
			newScrollY = max;
		}
		self.scrollTop = newScrollY;
	}

	window.onArticleMouseDown = function(event) {
		var self = this;
		self.data_tap = true;
		self.data_scroll_y = self.scrollTop;
		self.data_start_x = event.clientX;
		self.data_start_y = event.clientY;
        if(self.data_start_y<93)
            return;
		var onMove = function(event) {
			processTouch(self, event);
		}
		var onUp = function(event) {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
			processTap(self);
		}
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
	}

	window.onArticleTouchStart = function(event) {
		var self = this;
		self.data_tap = true;
		self.data_scroll_y = self.scrollTop;
		self.data_start_x = event.changedTouches[0].clientX;
		self.data_start_y = event.changedTouches[0].clientY;
		var onMove = function(event) {
			processTouch(self, event.changedTouches[0]);
		}
		var onUp = function(event) {
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onUp);
			window.removeEventListener("touchcancel", onUp);
			processTap(self);
		}
		window.addEventListener("touchmove", onMove);
		window.addEventListener("touchend", onUp);
		window.addEventListener("touchcancel", onUp);
	}
})();

// Circular Content Rotator
jQuery(document).ready(function($) {//alert("ready called");
	var circular = $('#page-home .circularContent');
	var circularSingle = $('#page-home .circularContent .article');
	var arrows = $('#page-home .ui-bbar .arrows');
	var leftArrow = $('#page-home .ui-bbar .arrows .left-arrow');
	var rightArrow = $('#page-home .ui-bbar .arrows .right-arrow');
	rightArrow.click(function(event) {
		circularSingle.fadeOut();
	});

	/*
    $(function(){
        $(".article_photo img").lazyload({
             threshold: 200
        });
        $(".photo img").lazyload({
           threshold: 200
        });
      $(".ui-bbar").hide();
      $(".ui-bbar").delay(1000).show(0);
    });
	*/
	/*
    // AdMob
	window.plugins.AdMob.createBannerView({
		'publisherId': 'ca-app-pub-0846142691248784/2514832459',
		'adSize': 'SMART_BANNER'//'IAB_MRECT'
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
    */                
});
