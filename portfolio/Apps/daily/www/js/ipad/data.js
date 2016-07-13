/**
 * Article downloading management
 */

var DataCenter = null;

(function() {'use strict';

	DataCenter = function() {
		var self = this;
		self.initialize();
	};

	DataCenter.prototype = {
		id: "dataCenter",

		// initialize the data center
		initialize: function() {
			var self = this;
		},
		
		// get data from the cache and server,  return true if data comes from cache\
		// - success(data)
		// - fail(message)
		get: function(name, success, fail, flagUpdate) {
			var self = this;
			if (flagUpdate == true) {
				return self.load(name, success, fail);
			}
			return getData(self, name, success, fail);
		},
		// load data from the server
		// - success(data)
		// - fail(message)
		load: function(name, success, fail) {
			var self = this;
			loadData(self, name, success, fail);
		},
		// photo gallery
		getPhotos: function() {
			return getPhotos();
		},
		// video gallery
		getVideos: function(name) {
			return getVideos(name);
		},
		// get available sections
		getSections: function() {
			var ret = [];
			for (var i = 0; i < sections.length; i++) {
				if (this.isSectionVisible(sections[i])) {
					ret.push(sections[i]);
				}
			}
			return ret;
		},
		// get all sections
		getAllSections: function() {
			return sections;
		},
		// get section categories
		getSectionCategories: function() {
			var ret = [];
			for (var name in xmlFeed.categories) {
				ret.push(name);
			}
			return ret;
		},
		// get sections in category
		getSectionsInCategory: function(category) {
			var ret = [];
			var arr = xmlFeed.categories[category];
			for (var i = 0; i < arr.length; i++) {
				if (this.isSectionVisible(arr[i].name)) {
					ret.push(arr[i].name);
				}
			}
			return ret;
		},

		// section visibility
		isSectionVisible: function(name) {
			if (sources[name] != null && sources[name].visible == true) {
				return true;
			} else {
				return false;
			}
		},
		setSectionVisible: function(name, value) {
			if (sources[name] != null) {
				sources[name].visible = value;
				saveSettings();
			}
		},
		// section title
		getSectionTitle: function(name) {
			if (sources[name] != null) {
				var title = sources[name].title;
				if (title != null) {
					return title;
				}
			}
			return name;
		},
		// section label
		getSectionLabel: function(name) {
			if (sources[name] != null) {
				var label = sources[name].label;
				if (label != null) {
					return label;
				}
			}
			return name;
		},
		// expiry seconds
		getExpirySeconds: function() {
			return xmlFeed.expirySeconds;
		},
		setExpirySeconds: function(seconds) {
			xmlFeed.expirySeconds = seconds;
			saveSettings();
		},
		// tweet stream
		getPushTweet: function() {
			return xmlFeed.pushTweet;
		},
		setPushTweet: function(val) {
			xmlFeed.pushTweet = val;
			saveSettings();

			if(xmlFeed.pushTweet) {
				enablePushTweet();
			}
			else {
				disablePushTweet();
			}
		},
		// font size
		getFontSize: function() {
			return xmlFeed.fontSize;
		},
		setFontSize: function(value) {
			xmlFeed.fontSize = value;
			saveSettings();
		},

		//Favourite
	 	getFavouriteArticles: function () {
			var storage = localStorage.getItem("favourite_articles");
			if (storage == null) {
				return null;
			}
			
			var data = JSON.parse(storage);
			return data;
		},

		saveFavouriteArticle: function (item) {
			var favourites = this.getFavouriteArticles();
			
			if (favourites != null) {
				for(var i=0; i<favourites.length; i++) {
					if(favourites[i].title == item.title) {
						return true;
					}
				}
			}
			else {
				favourites = [];
			}

			favourites.push(item);
			localStorage["favourite_articles"] = JSON.stringify(favourites);

			return true;
		},

		checkFavouriteArticle: function (title) {
			var favourites = this.getFavouriteArticles();
			if (favourites != null) {
				for(var i=0; i<favourites.length; i++) {
					if(favourites[i].title == title) {
						return true;
					}
				}
			}
			
			return false;

		},

		removeFavouriteArticle: function (title) {
			var favourites = this.getFavouriteArticles();
			var new_favourites = [];
			
			if (favourites != null) {
				for(var i=0; i<favourites.length; i++) {
					if(favourites[i].title != title) {
						new_favourites.push(favourites[i]);
					}
				}
			}
			
			localStorage["favourite_articles"] = JSON.stringify(new_favourites);

			return;
		},

		removeAllFavouriteArticles: function () {
			localStorage.removeItem("favourite_articles");

			return;
		},

		stocksTicker: function () {
		    stocks_ticker_loaded = true;
            stocks_ticker_html = $("#stocks-ticker-1").html();
            console.log(stocks_ticker_html);
                
            if(!hTicker) {
                /*   
                hTicker = $("#stocks-ticker-nav-1").webTicker({
                    speed: 50, //pixels per second
                });
				*/
            }
            else {
            	/*
				hTicker = $("#stocks-ticker-nav-1").webTicker("update", {
                    speed: 50, //pixels per second
                });
                */            	
            }
		}
	};

	var xmlFeed = {

		fontSize: "small",
		expirySeconds: 300,

		pushTweet: true,
 
 		categories: {
 			"<i class='fa fa-fax'></i> News" : [{
 				label : "News",
				name : '<i class="fa fa-fax"></i> News',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/news.xml',
				//url : 'news.xml',
				visible : true
				}, {
				label : "Politics",
				name : '<i class="fa fa-gavel"></i> Pol<span></span>i<span></span>ti<span></span>cs',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/politics.xml',
				visible : true
				},{
				label : "TopStories",
				name : '<i class="fa fa-fax"></i> Top Stories',
				url : 'http://www.nation.co.ke/topstories.xml',
				//url : 'news.xml',
				visible : true
				},{
				label : "Africa",
				name : '<i class="fa fa-globe"></i> Afri<span></span>ca',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/africa.xml',
				visible : true
				}, {
				label : "World",
				name : '<i class="fa fa-globe"></i> World',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/world.xml',
				visible : true
            }],
			"<i class='fa fa-bar-chart-o'></i> Business" : [{
				label : "Business",
				name : '<i class="fa fa-bar-chart-o"></i> Business',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/business.xml',
				visible : true
				}, {
				label : "Corporates",
				name : '<i class="fa fa-university"></i> <span></span>Corpor<span></span>ates',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/corporates.xml',
				visible : true
				}, {
				label : "Enterprise",
				name : '<i class="fa fa-share-alt"></i> Enterprise',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/enterprise.xml',
				visible : true
				}, {
				label : "Markets",
				name : '<i class="fa fa-users"></i> Markets',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/markets.xml',
				visible : true
				}, {
				label : "Tech",
				name : '<i class="fa fa-joomla"></i> Tech',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/technology.xml',
				visible : true
			}],
			"<i class='fa fa-globe'></i> Counties" : [{
				label : "Countries",
				name : '<i class="fa fa-globe"></i> Countries',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/counties.xml',
				visible : true
				}, {
				label : "Nairobi",
				name : '<i class="fa fa-globe"></i> Nairobi',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/nairobi.xml',
				visible : true
				}, {
				label : "Mombasa",
				name : '<i class="fa fa-globe"></i> Mombasa',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/mombasa.xml',
				visible : true
				}, {
				label : "Kisumu",
				name : '<i class="fa fa-globe"></i> Kisumu',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/kisumu.xml',
				visible : true
				}, {
				label : "Nakuru",
				name : '<i class="fa fa-globe"></i> Nakuru',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/nakuru.xml',
				visible : true
				}, {
				label : "Eldoret",
				name : '<i class="fa fa-globe"></i> Eldoret',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/eldoret.xml',
				visible : true
				}, {
				label : "Nyeri",
				name : '<i class="fa fa-globe"></i> Nyeri',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/nyeri.xml',
				visible : true
			}],
			"<i class='fa fa-life-ring'></i> Sports" : [{
				label : "Sports",
				name : '<i class="fa fa-trophy"></i> Sports',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/sports.xml',
				visible : true
				}, {
				label : "Football",
				name : '<i class="fa fa-trophy"></i> <span></span>Foo<span></span>tball',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/football.xml',
				visible : true
				}, {
				label : "Athletics",
				name : '<i class="fa fa-trophy"></i> Athleti<span></span>cs',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/athletics.xml',
				visible : true
				}, {
				label : "Rugby",
				name : '<i class="fa fa-trophy"></i> Rugby',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/rugby.xml',
				visible : true
				}, {
				label : "Golf",
				name : '<i class="fa fa-trophy"></i> G<span></span>olf',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/golf.xml',
				visible : true
				}, {
				label : "Others",
				name : '<i class="fa fa-trophy"></i> Others',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/othersports.xml',
				visible : true
				}, {
				label : "TalkUp",
				name : '<i class="fa fa-trophy"></i> Talkup',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/talkup.xml',
				visible : true
			}],
			"<i class='fa fa-bullhorn'></i> Opinion" : [{
				label : "Blogs",
				name : '<i class="fa fa-comments"></i> Blogs',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/blogs.xml',
				visible : true
				}, {
				label : "Commentaries",
				name : '<i class="fa fa-comments"></i> <span></span> Commentaries',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/commentaries.xml',
				visible : true
				}, {
				label : "Editorials",
				name : '<i class="fa fa-file-text"></i> Editorials',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/editorials.xml',
				visible : true
			}],
			"<i class='fa fa-heart'></i> Li<span></span>fe<span></span>&<span></span>Sty<span></span>le" : [{
				label : "ArtCulture",
				name : '<i class="fa fa-empire"></i> Ar<span></span>t<span></span>&<span></span>Cu<span></span>ltu<span></span>re',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/artsculture.xml',
				visible : true
				}, {
				label : "Family",
				name : '<i class="fa fa-group (alias)"></i> Family',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/family.xml',
				visible : true
				}, {
				label : "Health",
				name : '<i class="fa fa-medkit"></i> Health',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/healthscience.xml',
				visible : true
				}, {
				label : "Showbiz",
				name : '<i class="fa  fa-play-circle"></i> Showbiz',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/showbiz.xml',
				visible : true
				}, {
				label : "Travel",
				name : '<i class="fa fa-plane"></i>Tr<span></span>a<span></span>v<span></span>el',
				url : 'http://dfihluw6z4ymo.cloudfront.net/0/xml/travel.xml',
				visible : true
			}]
		}
	};

	var youtubeURL = "http://cdn.marcellus.tv/0/xml/videos.xml"; 
	//var youtubeURL = "http://www.nation.co.ke/videos.xml"; 
	//var youtubeURL = "http://gdata.youtube.com/feeds/users/NTVKenya/uploads?alt=json-in-script&format=5";
	var trendingURL = 'http://dfihluw6z4ymo.cloudfront.net/0/xml/trending.xml';
		

	// load section settings
	{
		var saved = localStorage.getItem("sections");
		if (saved != null) {
			xmlFeed = JSON.parse(saved);
		}
	}

	function saveSettings() {
		localStorage["sections"] = JSON.stringify(xmlFeed);
	}

	var sources = {};
	var sections = [];
	// initialize source mapping
	{
		for (var category in xmlFeed.categories) {
			var arrFeed = xmlFeed.categories[category];
			for (var i = 0; i < arrFeed.length; i++) {
				var feed = arrFeed[i];
				sources[feed.name] = feed;
				
				sections.push(feed.name);
			}
		}
	}
	
	// get data from cache, or from server if the data is not exist in cache
	function getData(self, name, success, fail) {
		var cache = loadCacheArticles(name);
		//console.log("Load from cache "  + " - " + name + " - " + JSON.stringify(cache));
		if (cache != null) {
			var seconds = (new Date().getTime() - new Date(cache.updatedTime).getTime()) / 1000;
						
			if (xmlFeed.expirySeconds == 0 || seconds < xmlFeed.expirySeconds) {
				//console.log("Load only " + " - " + name);
				loadData(self, name, null, fail);

				if (success != null) {
					//console.log("Load from cache "  + " - " + name);
					success(cache);
				}
				
				return true;
			} else {
				console.log("Expired " + seconds + " - " + name);
			}
		}
		
		loadData(self, name, success, fail);
	}
	
    var stocks_ticker_html = null;
    var hTicker = null;
    var stocks_ticker_loaded = false;
 
	// load data from server and cache them
	function loadData(self, name, success, fail) {
		
		if (name == "youtube") {
			loadYoutube(self, success, fail);
			return;
		}

		if(name == "trending") {
			loadTrendingArticles(self, success, fail);
			return;
		}
		var section = sources[name];
		
		if (section == null) {
			if (fail != null) {
				fail("The URL for '" + name + "' does not exist.");
			}
			return;
		}
		console.log("Downloading - " + name);

		/*
			Added by Yun to integrate with forex and movers widgets on business page
		*/
		var chk_business_flag = -1;


		if (chk_business_flag == -1) {
			chk_business_flag = name.indexOf("fa-bar-chart-o");
		}
		if (chk_business_flag == -1) {
			chk_business_flag = name.indexOf("fa-university");
		}
		if (chk_business_flag == -1) {
			chk_business_flag = name.indexOf("fa-share-alt");
		}
		if (chk_business_flag == -1) {
			chk_business_flag = name.indexOf("fa-users");
		}
		if (chk_business_flag == -1) {
			chk_business_flag = name.indexOf("fa-joomla");
		}


		if (chk_business_flag != -1){
 
 			chk_business_flag = -1;
			
			$("#page-home").addClass("has-rightsidebar");
			$("#home_right_side").css("display", "block");
                
			setTimeout(function(){
				$("#tweetstream").css("display", "none");
                $("#ticker_widget").css("display", "block");

                if(!hTicker) {
                    
                    if(stocks_ticker_loaded) {
						stocks_ticker_html = $("#stocks-ticker-1").html();
                    	$("#stocks-ticker-1").show();
                    	
                    	hTicker = $("#stocks-ticker-nav-1").webTicker({
		                    speed: 50, //pixels per second
		                });
					}
					else {
						$("#stocks-ticker-1").hide();
                    	
					}
                    
                }
                else {
                	$("#stocks-ticker-1").html(stocks_ticker_html);
                	hTicker = $("#stocks-ticker-nav-1").webTicker({
	                    speed: 50, //pixels per second
	                });
	                
                }
                
            
			},500);
			
			console.log("business page");
 
		}
		else {
		    if(!hTicker) {
                
            }
            else {
            	try {
            		$("#stocks-ticker-nav-1").webTicker("stop");
            	}
                catch(e) {
                	console.log(e);
                }
            }
        
			$("#page-home").removeClass("has-rightsidebar");
			$("#home_right_side, #ticker_widget").css("display", "none");
            setTimeout(function(){
				$("#tweetstream").css("display", "block");
			},500);
	
			console.log("no business page");
		}
		/***************************************/

		/*
			Added by Yun to integrate with stock ticker widgets on new page
		*/

		var chk_new_topnew_flag = -1;
		var chk_contain_world_flag = -1;

		var $articles_obj = $("#page-home .ui-content .articles");

		if (chk_new_topnew_flag == -1) {
			chk_new_topnew_flag = name.indexOf("fa-fax");
		}
		if (chk_new_topnew_flag == -1) {
			chk_new_topnew_flag = name.indexOf("fa-gavel");
		}
		if (chk_new_topnew_flag == -1) {
			chk_new_topnew_flag = name.indexOf("fa-globe");

			if (chk_new_topnew_flag != -1 ){
				chk_contain_world_flag = name.indexOf("World");
			}
			if (chk_new_topnew_flag != -1 && chk_contain_world_flag == -1){
				chk_new_topnew_flag = name.indexOf("Afri");
			}
			else if (chk_new_topnew_flag != -1 && chk_contain_world_flag != -1){
				chk_new_topnew_flag = chk_contain_world_flag;
			}
		}
		/*if (chk_new_topnew_flag == -1) {
			chk_new_topnew_flag = name.indexOf("fa-joomla");
		}*/

		//console.log("chk_new_topnew_flag is " + chk_new_topnew_flag);

		var heightWindow = $(window).height();
		var heightHeader = $("#page-home .ui-header").outerHeight();
		var heightFooter = $("#page-home .ui-footer").outerHeight();
		var heightTicker = $("#page-home #ticker_widget").outerHeight();


		if (chk_new_topnew_flag != -1){
			//console.log("Ticker widget height is "+ heightTicker);
			//var height = heightWindow - heightHeader - heightFooter - heightTicker - 70;
			var height = heightWindow - heightHeader - heightFooter - 70;
			chk_new_topnew_flag = -1;
			//$("#ticker_widget").css("display", "block");
			console.log("news page");
		}
		else {
			var height = heightWindow - heightHeader - heightFooter - 70;
			//$("#ticker_widget").css("display", "none");
			console.log("no news page");
		}
		
		$("#page-home .ui-content").outerHeight(height + 1);
		var heightContent = $("#page-home .ui-content").height() - 1;
		$articles_obj.css("height", heightContent);
		

		$("#page-home #home_right_side").css("height", (heightContent-30) + "px");
		$("#page-home .ui-content").css("font-size", ((heightContent-30) / 100) + "px");
		/*if (pager != null) {
			var width = $articles_obj.width();
			var height = $articles_obj.height();
			pager.resize({
				width: width,
				height: height - 30
			});
		}*/

		/***************************************/

		Util.ajax({
			url: section.url,
			//responseType: "xml",
			success: function(str) {
				console.log("Loaded Category - " + name);
				str = str.replace(/& /g, "&amp; ");
				var xml = Util.parseXML(str);
				var data = parseData(xml);
				saveCacheArticles(name, data);
				if (success != null) {
					success(data);
				}
			},
			fail: function(req) {
				console.log("Load data failed - " + req.responseText);
				if (fail != null) {
					fail("Loading Data failed");
				}
			}
		});
	}
	
	// parse the server articles xml
	function parseData(xml) {
		var data = {};
		data.updatedTime = (new Date()).toISOString();
		data.items = [];
		var items = $(xml).find("item");
		for (var i = 0; i < items.length; i++) {
			var itemSrc = $(items[i]);
			var itemDst = {};
			itemDst.category = itemSrc.find("parent").text().trim();
			itemDst.subCategory = itemSrc.find("child").text().trim();
			itemDst.title = itemSrc.find("title").text().trim();
			itemDst.language = itemSrc.find("language").text().trim();
			itemDst.description = Util.strip(itemSrc.find("description").text().trim());
			var dateString = itemSrc.find("articleDate").text().trim();
			var articleDate = new Date(Date.parse(dateString));
			itemDst.articleDate = articleDate.toDateString();
			itemDst.story = itemSrc.find("story").text().trim();
			itemDst.author = itemSrc.find("author").text().replace("-1", "").trim();
			itemDst.link = itemSrc.find("link").text().trim();
			itemDst.photo = null;
			var jphoto = itemSrc.find("photo");
			if (jphoto.length > 0) {
				itemDst.photo = {
					path: jphoto.text().replace(/\+/gi, '%2B'),
					caption: itemSrc.find("caption").text().trim()
				};
			}
			itemDst.video = null;
			var jvideo = itemSrc.find("video");
			if (jvideo.length > 0) {
				itemDst.video = {
					path: jvideo.text().replace(/\+/gi, '%2B'),
					caption: itemSrc.find("caption").text().trim()
				};
			}
			data.items.push(itemDst);
		}
		return data;
	}

	// load data from youtube and cache them
	function loadYoutube(self, success, fail) {
		console.log("Downloading from Youtube");
		Util.ajax({
			url: youtubeURL,
			success: function(str) {
				console.log("Loaded from Youtube: ");
				str = str.replace(/& /g, "&amp; ");
				var xml = Util.parseXML(str);
				
				try {
					var data = parseVideo(xml);
					if (success != null) {
						success(data);
					}
				} catch (e) {
					console.log("Exception during loading from youtube - " + e);
					if (fail != null) {
						fail("Exception loading Youtube");
					}
				}
			},
			fail: function(req) {
				console.log("Load youtube failed - status: " + req.status + "(" + req.statusText + ") response:" + req.responseText);
				if (fail != null) {
					fail("Loading Youtube failed");
				}
			}
		});

		/*
		var gdata = {
			io: {
				handleScriptLoaded: function(src) {
					var data = {};
					data.updatedTime = (new Date()).toISOString();
					data.items = [];
					
					var items = src.feed.entry;
					for (var i = 0; i < items.length; i++) {
						var itemSrc = items[i];
						var itemDst = {};
						itemDst.category = itemSrc.category[1].term;
						itemDst.title = itemSrc.title.$t;
						itemDst.language = "";
						itemDst.description = itemSrc.media$group.media$description.$t;
						itemDst.articleDate = itemSrc.published.$t;
						itemDst.story = "";
						itemDst.author = itemSrc.author[0].name.$t;
						itemDst.link = itemSrc.link[0].href;
						itemDst.photo = null;
						var url = itemDst.link;
						if (url.indexOf("feature=") >= 0) {
							url = url.substring(0, url.indexOf("feature=") - 1);
						}
						if (url.indexOf("watch?") >= 0 && url.indexOf("v=") >= 0) {
							url = url.substring(0, url.indexOf("watch?")) + "embed/" + url.substring(url.indexOf("v=") + 2, url.length);
						}
						itemDst.video = {
							path: url,
							caption: itemDst.title,
							thumbnail: itemSrc.media$group.media$thumbnail[1].url.replace(/\+/gi, '%2B')
						};
						data.items.push(itemDst);
					}
					
					saveCacheArticles("youtube", data);
					if (success != null) {
						success(data);
					}
				}
			}
		}*/

	}

	// Parse XML to videos
	function parseVideo(xml) {
		var data = {};
		data.updatedTime = (new Date()).toISOString();
		data.items = [];
		var videocats = $(xml).find("videos");
		for(var j=0; j<videocats.length; j++) {
			var video_category = $(videocats[j]).find("videocategory").text().trim();
			var videos = $(videocats[j]).find("video");
			for (var i = 0; i < videos.length; i++) {
				var itemSrc = $(videos[i]);
				var itemDst = {};
				itemDst.category = video_category;
				itemDst.title = itemSrc.find("title").text().trim();
				itemDst.language = "";
				itemDst.description = Util.strip(itemSrc.find("caption").text().trim());
				itemDst.articleDate = "";
				itemDst.story = "";
				itemDst.author = "";
				itemDst.link = Util.strip(itemSrc.find("link").text().trim());
				itemDst.photo = itemSrc.find("thumbnail").text().trim();
				
				var url = itemDst.link;
				if (url.indexOf("feature=") >= 0) {
					url = url.substring(0, url.indexOf("feature=") - 1);
				}
				if (url.indexOf("watch?") >= 0 && url.indexOf("v=") >= 0) {
					url = url.substring(0, url.indexOf("watch?")) + "embed/" + url.substring(url.indexOf("v=") + 2, url.length);
				}

				itemDst.video = {
					path: url,
					caption: itemDst.title,
					thumbnail: itemDst.photo
				};
				data.items.push(itemDst);

			}
		}
		
		saveCacheArticles("youtube", data);

		return data;
	}

	// local storage cache
	var memCache = {};
	function loadCacheArticles(name) {
		var data = memCache[name];
		if (data != null) {
			return data;
		}
		var str = localStorage.getItem("articles_" + name);
		if (str == null) {
			return null;
		}
		data = JSON.parse(str);
		memCache[name] = data;
		return data;
	}
	function saveCacheArticles(name, data) {
		memCache[name] = data;
		localStorage["articles_" + name] = JSON.stringify(data);
	}

	// photo gallery
	function getPhotos() {
		var map = {};
		var list = [];
		for (var i = 0; i < sections.length; i++) {
			var data = loadCacheArticles(sections[i]);
			if (data != null) {
				var items = data.items;
				for (var j = 0; j < items.length; j++) {
					var item = items[j];
					if (item.photo != null && item.photo.path != '') {
						if (map[item.photo.path] == null) {
							list.push(item);
							map[item.photo.path] = item;
						}
					}
				}
			}
		}
		return list;
	}

	// video gallery
	function getVideos(name) {
		var map = {};
		var list = [];
		var data = loadCacheArticles(name);
		if (data != null) {
			var items = data.items;
			for (var j = 0; j < items.length; j++) {
				var item = items[j];
				if (item.video != null && item.video.path != '') {
					if (map[item.video.path] == null) {
						list.push(item);
						map[item.video.path] = item;
					}
				}
			}
		}
		return list;
	}

	function loadTrendingArticles(self, success, fail) {
		
		Util.ajax({
			url: trendingURL,
			//responseType: "xml",
			success: function(str) {
				console.log("Loaded Trending XML");
				str = str.replace(/& /g, "&amp; ");
				var xml = Util.parseXML(str);
				var data = parseData(xml);
				saveCacheArticles('trending', data);
				if (success != null) {
					success(data);
				}
			},
			fail: function(req) {
				console.log("Load Trending XML failed - status: " + req.status + "(" + req.statusText + ") response:" + req.responseText);
				if (fail != null) {
					fail("Loading Trending XML failed");
				}
			}
		});
	}

	function getTrendingArticles() {
		var map = {};
		var list = [];
		var data = loadCacheArticles('trending');
		if (data != null) {
			var items = data.items;
			for (var j = 0; j < items.length; j++) {
				var item = items[j];
				if (true) {
					list.push(item);
				}
			}
		}
		return list;
	}

	var BOXCAR_OPTIONS = {
        clientKey: '2vRC__qFV7Blw4Dxfh4SCdf7oFEo-P1eZZ6P7B-97AtTach-r6QHYVjkhMCNMIXR',
        secret: 'BshwMSmAh5DTg3C0mxdSysBkBsYwP07MvkhprfR4tJbFANeKNGGzvUNcx2a9p0c0',
        server: 'https://boxcar-api.io',
        richUrlBase: 'https://boxcar-api.io'
    };

	/* Push Tweet */
	function enablePushTweet() {
		Boxcar.init(BOXCAR_OPTIONS);

	    Boxcar.registerDevice({
	        mode: 'development',
	        onsuccess: function(msg) {
	            console.log('registerDevice onsuccess - ' + msg);
	        },
	        onerror: function(err, msg) {
	            console.log('registerDevice onerror - ' + msg);
	        },
	        onalert: function(obj) {
	            console.log('registerDevice onalert - ' + obj);
	        },
	        onnotificationclick: function(obj) {
	            console.log('registerDevice onnotificationclick ' + obj);
	        },
	        //tags: [],
	        //udid: '',
	        //alias: ''
	    });
	}

	function disablePushTweet() {
		Boxcar.init(BOXCAR_OPTIONS);

	    Boxcar.unregisterDevice({
	        onsuccess: function(msg) {
	            console.log('unregisterDevice onsuccess - ' + msg);
	        },
	        onerror: function(err, msg) {
	            console.log('unregisterDevice onerror - ' + msg);
	        },
	    });
	}

	if(xmlFeed.pushTweet) {
		enablePushTweet();
	}
	else {
		disablePushTweet();
	}

})();

function business_ticker(content) {
	$el = $("<div>" + content + "</div>");
	
	var tick_ids = "";
	var tickers = "";
	$el.find("li").each(function(i, li) {
		if(tick_ids.indexOf(li.id) == -1) {
			tick_ids += "," + li.id;
			tickers += li.outerHTML;
		}
	});

	$el.find("li").remove();
	$el.find("ul").html(tickers);

	$("#stocks-ticker-1").html($el.html());
    
    app.data.stocksTicker();
}

