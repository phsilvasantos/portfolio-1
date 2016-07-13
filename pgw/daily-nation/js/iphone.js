var ADMOB_KEY = "ca-app-pub-0846142691248784/2514832459";
var GA_CODE = "UA-53405409-5";

var db;
var currentPage=0;
var currentArticle = null;
var twitterUser = 'dailynation';
var admob;
var photoObj;
var itemsData = new Object();
var timerNewsFeed;
var pager=null;

var appSettings = {};
var defaultSettings = {
  textSize : "12px",
  refreshInterval : "300000",
  pushTweet : "1"
};

var xmlFeed = [{
  "News":[
    {name: 'News', url : 'http://cdn.marcellus.tv/0/xml/news.xml', visible: true},
    {name: 'Politics', url : 'http://cdn.marcellus.tv/0/xml/politics.xml', visible: true},
    {name: 'Africa', url : 'http://cdn.marcellus.tv/0/xml/africa.xml', visible: true},
    {name: 'World', url : 'http://cdn.marcellus.tv/0/xml/world.xml', visible: true}
  ],
  "Business":[
    {name: 'Business', url : 'http://cdn.marcellus.tv/0/xml/business.xml', visible: true},
    {name: 'Corporates', url : 'http://cdn.marcellus.tv/0/xml/corporates.xml', visible: true},
    {name: 'Enterprise', url : 'http://cdn.marcellus.tv/0/xml/enterprise.xml', visible: true},
    {name: 'Markets', url : 'http://cdn.marcellus.tv/0/xml/markets.xml', visible: true},
    {name: 'Tech', url : 'http://cdn.marcellus.tv/0/xml/technology.xml', visible: true}
  ],
  "Counties":[
    {name: 'Counties', url : 'http://cdn.marcellus.tv/0/xml/counties.xml', visible: true},
    {name: 'Nairobi', url : 'http://cdn.marcellus.tv/0/xml/nairobi.xml', visible: true},
    {name: 'Mombasa', url : 'http://cdn.marcellus.tv/0/xml/mombasa.xml', visible: true},
    {name: 'Kisumu', url : 'http://cdn.marcellus.tv/0/xml/kisumu.xml', visible: true},
    {name: 'Nakuru', url : 'http://cdn.marcellus.tv/0/xml/nakuru.xml', visible: true},
    {name: 'Eldoret', url : 'http://cdn.marcellus.tv/0/xml/eldoret.xml', visible: true},
    {name: 'Nyeri', url : 'http://cdn.marcellus.tv/0/xml/nyeri.xml', visible: true}
  ],
  "Sports":[
    {name: 'Sports', url : 'http://cdn.marcellus.tv/0/xml/sports.xml', visible: true},
    {name: 'Football', url : 'http://cdn.marcellus.tv/0/xml/football.xml', visible: true},
    {name: 'Athletics', url : 'http://cdn.marcellus.tv/0/xml/athletics.xml', visible: true},
    {name: 'Rugby', url : 'http://cdn.marcellus.tv/0/xml/rugby.xml', visible: true},
    {name: 'Golf', url : 'http://cdn.marcellus.tv/0/xml/golf.xml', visible: true},
    {name: 'Others', url : 'http://cdn.marcellus.tv/0/xml/othersports.xml', visible: true},
    {name: 'Talkup', url : 'http://cdn.marcellus.tv/0/xml/talkup.xml', visible: true}
  ],
  "Blogs&Opinion":[
    {name: 'Blogs', url : 'http://cdn.marcellus.tv/0/xml/blogs.xml', visible: true},
    {name: 'Commentaries', url : 'http://cdn.marcellus.tv/0/xml/commentaries.xml', visible: true},
    {name: 'Editorials', url : 'http://cdn.marcellus.tv/0/xml/editorials.xml', visible: true}
  ],
  "Life&Style":[
    {name: 'Art&Culture', url : 'http://cdn.marcellus.tv/0/xml/artsculture.xml', visible: true},
    {name: 'Family', url : 'http://cdn.marcellus.tv/0/xml/family.xml', visible: true},
    {name: 'Health', url : 'http://cdn.marcellus.tv/0/xml/healthscience.xml', visible: true},
    {name: 'Showbiz', url : 'http://cdn.marcellus.tv/0/xml/showbiz.xml', visible: true},
    {name: 'Travel', url : 'http://cdn.marcellus.tv/0/xml/travel.xml', visible: true}
  ],
}];

var xmlBreakingNews = "http://www.nation.co.ke/breaking.xml";

function onDeviceReady() {
	console.log('device ready');

  if (parseFloat(window.device.version) >= 7.0) {
    document.body.style.marginTop = "20px";
    // OR do whatever layout you need here, to expand a navigation bar etc
  }
  navigator.splashscreen.hide();

  loaded();
	
	var networkState = navigator.network.connection.type;
	if (networkState == Connection.NONE)
	  alert('No network connection');
	db = new DailyNation();
	db.setup(startApp);
}
//document.addEventListener("deviceready", onDeviceReady, false);
//document.addEventListener("deviceready", loaded, false);
// ondeviceready event handler

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

var myScroll;

function loaded() {
  //myScroll = new iScroll('wrapper', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper1', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper2', { checkDOMChanges: true });
  //myScroll = new iScroll('wrapper3', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper33', { checkDOMChanges: true });
  //myScroll = new iScroll('wrapper3-1', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper4', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper5', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper6', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper61', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper7', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper8', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper9', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper10', { checkDOMChanges: true });
  myScroll = new iScroll('wrapper11', { checkDOMChanges: true });
}

//Main controller, at this point db setup is ready
function startApp() {
	console.log('startApp');
	//Load the main view
	//pageLoad("#home-page");
}

//callback method to render the page
function pageLoad(u) {
	console.log("load "+u);
	$(u).trigger('pageload');
	$.mobile.changePage(u, { transition: 'fade', reverse: true });
    
}

$('#home-page').live("pageinit", function (event, ui) {

  var $homePage = $('#home-page');
  $homePage.data('refreshInterval', '300000'); // feed refreshes every 5 minutes..
  $homePage.data('xmlFeed', xmlFeed[0]['News']);
  $homePage.data('textSize', '12px');

  /*
   * Load Settings
   */
  var refreshInterval = getSettings("refreshInterval");
  if(refreshInterval !== undefined)
    $homePage.data('refreshInterval', refreshInterval);

  var textSize = getSettings("textSize");
  if(textSize !== undefined)
    $homePage.data('textSize', textSize);

  updateNewsFeed();
  
  //$('#popupMenu').popup('open');
  getBreakingNews();

  if(timerNewsFeed)
    clearInterval(timerNewsFeed);

  if($homePage.data('refreshInterval') != "0" ) {
    timerNewsFeed = setInterval(function() {
      getBreakingNews();
      updateNewsFeed();

    }, $homePage.data('refreshInterval') );
  }

  setTimeout(function() {
    // AdMob
    createAdmobBanner();

    // GA
    createGA();

    // Push Tweet
    checkPushTweet();
  
  }, 1000);
  
  scrollHomepage();
  
  loaded();
});

$("#home-page").live("pageshow", function() {
  
  /*
   * Load last article before to go DISQUS
   */
  /*
  var disqus_callback = localStorage.getItem('dailynation_callback_disqus');
  var last_article = localStorage.getItem('dailynation_current_article');
  console.log("disqus_callback - " + disqus_callback);
  console.log("last_article - " + last_article);
  
  if(disqus_callback != null && last_article != null) {
    disqus_callback = parseInt(disqus_callback);
    console.log("disqus_callback " + disqus_callback);
    
    var lastArticle = JSON.parse(last_article);
    console.log("lastArticle " + lastArticle);
    
    var expired_seconds = Math.ceil((disqus_callback - lastArticle.lastLoadedTime) / 1000);
    console.log("Expred callback disqus " + expired_seconds);
    
    if(expired_seconds < 3600 * 24) {
      //$("#article-page").data("articleJSON", lastArticle);
      //$("#article-page").data("articleCount", articleCount);
      //$.mobile.changePage('#article-page', {transition: 'fade'});
    }
  }
  
  localStorage.removeItem('dailynation_callback_disqus');
  localStorage.removeItem('dailynation_current_article');
  */
  scrollHomepage();

});

function scrollHomepage() {
  var scrollHeight = $(window).height(),
  headerHeight = $("#home-page .ui-header").outerHeight(true),
  footerHeight = $("#home-page .ui-footer").outerHeight(true),
  admobHeight = 50; //(admob)? 50: 0,
  tickerHeight = $("#home-page #tweetstream").outerHeight(true);
  
  $("#wrapper").height(scrollHeight - headerHeight - footerHeight - admobHeight - tickerHeight);
  myScroll = new iScroll('wrapper', { checkDOMChanges: true });
}

function createAdmobBanner() {
  if( window.plugins.AdMob ) {
    window.plugins.AdMob.createBannerView({
      'publisherId': ADMOB_KEY,
      'adSize': 'BANNER'
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
    analytics.trackView('iPhone View');
    //analytics.debugMode()
  }
  else {
    console.log('GA plugin not available/ready.');

    setTimeout(createGA, 500);

    return false;
  }
}

function checkPushTweet() {
  if(device) {
    var pushTweet = getSettings("pushTweet");
    if(pushTweet == "1") {
      enablePushTweet();
    }
    else {
      disablePushTweet();
    }
  }
  else {
    console.log('device not available/ready.');

    setTimeout(checkPushTweet, 500);

    return false;
  }
}

//click event on left menu [side panel]
var $homePage = $('#home-page');
$leftpanel = $homePage.find("#left-panel").find("ul");
$("#topic").html("News");

$leftpanel.find('a').click(function(){
  var category = $(this).attr('id');
  
  //console.log(category);
  $homePage.data('xmlFeed', xmlFeed[0][category]);
  if( category == 'Favorites' )
    $.mobile.changePage('#favorites-page', {transition: 'slide'});
  else if( category == 'Photos' )
    $.mobile.changePage('#photos-page', {transition: 'slide', reverse: true});
  else if( category == 'Videos' )
    $.mobile.changePage('#videos-page', {transition: 'slide', reverse: true});
  else
    updateNewsFeed();
  $("#topic").html(category.toUpperCase());
  $('#left-panel').panel('close');
});

function updateNewsFeed() {
	//var catData = localStorage.getItem('catData');
	photoObj = [];
	$.each($('#home-page').data('xmlFeed'), function(i, field) {
    if ( field.visible ) {
      //console.log("LOG02: " + field.name);
      getNewsFeed(i, field );
    }
  });
  
  if(myScroll) {
    myScroll.refresh();
  }
}

function getNewsFeed( i, field ) {
	
	var $homePage = $('#home-page');
	$homePage.find("#scroller").empty();
	
	if( isCategoryVisible(field.name) ) {

        itemsData[field.name] = [];
        var items = [];
        
        $.ajax({
            url: field.url,
            dataType:'xml',
            type:'GET',
            beforeSend: function() { $.mobile.showPageLoadingMsg(); },
            complete: function() { $.mobile.hidePageLoadingMsg() },
            success:function(data) {
                var carId = 'carousel-image-and-text-'+i,
                    articleCount = $(data).find("item").length;
                if ($(data).find("item").length > 0) {
                   $homePage.find("#scroller").append('<div class="carousel-ajax-container"><div id="'+carId+'" class="touchcarousel grey-blue carousel-image-and-text"><div class="section-block"><h6></h6><ul id="carousel-'+i+'" class="touchcarousel-container"></ul></div></div></div>');
                }

                $(data).find("item").each(function (idx, val) {
                    $homePage.find("#"+carId).find("h6").text( field.name );
                    $list = $homePage.find("#"+carId).find("ul");

                    var article_idx = "article-" + i + "-" + idx;
                    var strHtml = '<li class="touchcarousel-item"><a data-transition="fade" id="' + article_idx + '" class="item-block" href="#">';// onclick="gotoArticle(this, '+ articleCount +');"

                    var imgSrc = 'images/default.png';

                    if( $(this).find("photo").text() ) {
                        imgSrc = $(this).find("photo").text();
                        imgSrc = imgSrc.replace(/\+/gi,'%2B');

                        var item = {};
                        item["photo"] = $(this).find("photo").text();
                        item["caption"]=  $(this).find("caption").text();
                        photoObj.push(item);
                        localStorage.setItem('photoObj', JSON.stringify(photoObj));

                    }
                  
                    strHtml += '<img src="img/tn_loader.gif" data-frz-src="'+imgSrc+'" onload=lzld(this) onerror=lzld(this)/>';
                    var nTitle = $(this).find("title").text();
                    nTitle = ( nTitle.length > 30 ) ? nTitle.substr(0, 28).concat('...') : nTitle;
                    strHtml += '<p class="article-title">'+nTitle+'</p></a>';

                    var record = $(strHtml);
                    $list.append(record);
                    //console.log(this);
                    var item = parseData(this);
                    $list.find("a.item-block:last").data("articleIndex", idx);
                    $list.find("a.item-block:last").data("articleCategory", field.name);
                    items.push(item);

                    $("#" + article_idx).unbind();
                    $("#" + article_idx).bind("tap", function(e) {
                        e.preventDefault();

                        var $this = $(this);

                        //$("#article-page").data("articleJSON", $this.data("articleJSON"));
                        currentPage = $this.data("articleIndex");
                        $("#article-page").data("category", $this.data("articleCategory"));
                        $("#article-page").data("articleCount", articleCount);
                        updateArticles($this.data("articleCategory"));
                        
                        $.mobile.changePage('#article-page', {transition: 'fade'});
                        $.mobile.hidePageLoadingMsg();
                    });
                });

                initCarousel( carId );

                itemsData[field.name] = items;
                //myScroll.refresh();
                //return;
            },
            error:function(XMLHttpRequest,textStatus, errorThrown) {
                console.log("Error getNewsFeed :" + XMLHttpRequest.responseText);
            }
        });

	}
}
/*
function gotoArticle(that, articleCount) {
  var $this = $(that);
  //currentPage = parseInt($this.attr('id').split('-')[1]);
  console.log('LOG01: ', $this.attr('id'));
  $("#article-page").data("articlesJSON", data);
  $("#article-page").data("articleJSON", $this.data("articleJSON"));
  $("#article-page").data("articleCount", articleCount);
  $.mobile.changePage('#article-page', {transition: 'fade'});
  //$.mobile.showPageLoadingMsg();
  $.mobile.hidePageLoadingMsg();
}
*/
function initCarousel( carId ) {
	jQuery(function($) {
        carouselInstance = $("#"+carId).touchCarousel({
          pagingNav: false,
          snapToItems: false,
          itemsPerMove: 3,
          scrollToLast: true,
          loopItems: false,
          scrollbar: false
        }).data('touchCarousel');
    });
	
}
/*
function handleTwiticker() {
  if($('#twitcker-marquee').length == 0) {
    setTimeout(handleTwiticker, 500);
  }
  else {
    //console.log("twitcker-marquee loaded" + $('#twitcker-marquee').length);
    $("#twitcker-marquee .box").unbind('click');
    $("#twitcker-marquee .box>a").unbind('click');
    $("#twitcker-marquee .box>a").bind('click', function(e) {
      e.preventDefault();
      console.log($(this).attr('href'));
      var tweeticker = window.open($(this).attr('href'), '_blank', 'location=no');
      return false;
    });
  }
}
*/
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
        $("#home-page #wrapper").css("top", "89px");
      }
      else {
        $("#twitcker-bar").hide();
      }
    }
  });
}

function parseData(xml) {
  var item = {};
  
  var itemSrc = $(xml);
  var itemDst = {};
  itemDst.parent = itemSrc.find("parent").text().trim();
  itemDst.child = itemSrc.find("child").text().trim();
  itemDst.title = itemSrc.find("title").text().trim();
  itemDst.language = itemSrc.find("language").text().trim();
  //itemDst.description = Util.strip(itemSrc.find("description").text().trim());
  //var dateString = itemSrc.find("articleDate").text().trim();
  //var articleDate = new Date(Date.parse(dateString));
  itemDst.articleDate = itemSrc.find("articleDate").text().trim();
  itemDst.story = itemSrc.find("story").text().trim();
  itemDst.author = itemSrc.find("author").text().replace("-1", "").trim();
  itemDst.link = itemSrc.find("link").text().trim();
  itemDst.photo = itemSrc.find("photo").text().replace(/\+/gi, '%2B');
  /*
  var jphoto = itemSrc.find("photo");
  if (jphoto.length > 0) {
    itemDst.photo = {
      path: jphoto.text().replace(/\+/gi, '%2B'),
      caption: itemSrc.find("caption").text().trim()
    };
  }
  */
  itemDst.video = itemSrc.find("video").text().replace(/\+/gi, '%2B');
  /*
  var jvideo = itemSrc.find("video");
  if (jvideo.length > 0) {
    itemDst.video = {
      path: jvideo.text().replace(/\+/gi, '%2B'),
      caption: itemSrc.find("caption").text().trim()
    };
  }
  */

  item = itemDst;

  return item;
}

var DISQUS_TIMER = null;

/* Article page */
//$(document).on('pagebeforeshow', '#article-page', function() {
function updateArticles(category) {
    var $page = $('#article-page');
    //var category = $page.data("category");
    var items = itemsData[category];
               
    $page.find(".swipe-wrapper").html('<div class="articles" id="articles"></div>');
    
    for(var i=0; i<items.length; i++) {
        var objArticle = items[i];
        
        var article_html = '<article class="article-single" id="article_single_' + i + '">'
            + '<div class="article-single-content">'
              + '<h4 class="sub-category"></h4>'
              + '<div class="article-img"></div>'
              + '<span class="article-provider"></span>'
              + '<h3 class="article_title"></h3>'
              + '<span class="article-date"></span>'
              + '<div class="articleinfo"></div>'
              + '<div class="disqus-thread"></div>'
            + '</div>'
          + '</article>';
        
        objArticle.lastLoadedTime = Date.now();
        localStorage['dailynation_current_article'] = JSON.stringify(objArticle);

        $page.find(".articles").append(article_html);
        
        var articleId = '#article_single_' + i;
        $(articleId).find('.sub-category').text( objArticle.child);
        $(articleId).find('.article_title').html( objArticle.title);
        $(articleId).find('.article-provider').text( objArticle.author);
        $(articleId).find('.articleinfo').html(objArticle.story);
        $(articleId).find('.article-img').html('');
        if( objArticle.photo != '' ) {
            imgSrc= objArticle.photo;
            imgSrc = imgSrc.replace(/\+/gi,'%2B');
            $(articleId).find('.article-img').html('<img src="'+imgSrc+'" alt="photo" width="auto"/>');
        }
  
        var dateString = objArticle.articleDate;
        if(dateString != '') {
            var articleDate = new Date(Date.parse(dateString));
            var curDate = new Date();
            var seconds = Math.ceil((curDate.getTime() - articleDate.getTime())/1000);

            if(seconds<60) {
                dateString = seconds + " seconds ago";
            }
            else if(seconds<3600) {
                var minutes = Math.ceil(seconds/60);
                dateString = minutes + " minutes ago";
            }
            else if(seconds<3600*24) {
                var hours = Math.ceil(seconds/3600);
                dateString = hours + " hours ago";
            }
            else if(seconds<3600*24*7) {
                var days = Math.ceil(seconds/(3600*24));
                dateString = days + " days ago";
            }
            else if(seconds<3600*24*30) {
                var weeks = Math.ceil(seconds/(3600*24*7));
                dateString = weeks + " weeks ago";
            }
            else if(seconds<3600*24*30*12) {
                var months = Math.ceil(seconds/(3600*24*30));
                dateString = months + " months ago";
            }
            else {
                dateString = objArticle.articleDate;
            }
        }
        $(articleId).find('.article-date').text(dateString);
    }
               
    
    /*
    DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = "article-" + Date.now();
          this.page.url = objArticle.link;
          this.page.title = objArticle.title;
          this.callbacks.onReady.push(function() { 
            console.log("onReady");
            if(myScroll)
              myScroll.refresh();
          });
        }
    }); 
    */

    // add dummy wrapper to fix scroll issue.
    /*
    DISQUS_TIMER = setInterval(function(){
        $('#disqus_thread').find('#dummy-wrapper').remove().end().prepend('<div id="dummy-wrapper" style="position: absolute;height: 100%;top: 0;width: 100%;left: 0;"></div>');
    }, 1000);
    */
               
}

$(document).on('pagebeforehide', '#article-page', function() {
    $('#article-page').find('.custom-footer a:first-child').removeClass('save-article-complete').addClass('save-article');
    
    clearInterval(DISQUS_TIMER);
});

$(document).on('pageshow', '#article-page', function() {
    $("#article-page .page-to-top").hide();
    
    if(pager) {
       pager.destroy();
       console.log("pager" + pager);
    }
               
    //Swipe left/right
    var dragendObj =  $("#articles").dragend({
        pageClass : "article-single",
        minDragDistance : "200",
        page: currentPage,
        afterInitialize: function() {
            applyArticle();
        },
        onSwipeStart : function() {
        },
        onSwipeEnd : function(a, b) {
            var page = pager.getPage();
            if(currentPage != page) {
                currentPage = page;

                applyArticle();
            }
        }
    });

    pager = $(dragendObj).data("dragend");
    
});

function applyArticle() {
    $("#article-page .page-to-top").hide();

    var $page = $('#article-page');
    var category = $page.data("category");
    var items = itemsData[category];
    var objArticle = items[currentPage];
    var articleId = "#article_single_" + currentPage;
    
    if(articleScroll)
        articleScroll.scrollTo(0,0,200);
    
    $page.find('.ui-header h1').html(objArticle.parent);
    
    // show Share menu
    $page.find(".share-article").unbind().bind("click", function() {
       if(!objArticle)
           return false;
       
       // Social sharing
       var photo = (objArticle.photo)? objArticle.photo: null;
       window.plugins.socialsharing.share( objArticle.story, objArticle.title, photo, objArticle.link);
    });
    
    $('.disqus-thread').html("");
    $(articleId).find('.disqus-thread').html('<div id="disqus_thread"></div>');
    
    // DISQUS.reset
    DISQUS.reset({
      reload: true,
      config: function() {
        this.page.identifier = "disqus_identifier" + articleId;
        this.page.title = objArticle.title;
        this.page.url = objArticle.link;
        
        this.callbacks.onReady.push(function() { 
          console.log("onReady");

          // add dummy wrapper to fix scroll issue.
          //if(find('#disqus_thread').length > 0)
          //  $(articleId).find('#disqus_thread').find('#dummy-wrapper').remove().end().prepend('<div id="dummy-wrapper" style="position: absolute;height: 100%;top: 0;width: 100%;left: 0;"></div>');

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
}

var articleScroll;
function refreshBodySize() {
    var scrollHeight = $(window).height(),
    headerHeight = $("#article-page .ui-header").outerHeight(),
    footerHeight = $("#article-page .ui-footer").outerHeight(),
    admobHeight = (admob)? 30: 0;
    
    $("#wrapper3").height(scrollHeight - headerHeight - footerHeight - admobHeight);
    
    var articleId = "#article_single_" + currentPage;
    $(articleId).css("height", "auto");
    var articleHeight = $(articleId).outerHeight(true);
    
    $("#articles").height(articleHeight + 10);
    
    if(pager) {
      pager.updateInstance();
    }
    
    if(articleScroll) {
        articleScroll.refresh();
    }
    else {
        articleScroll = new iScroll("wrapper3", {
            checkDOMChanges: true,
            useTransition: true,
            vScrollbar: false,
            hScrollbar: false,
            scrollX: false,
            scrollY: true,
            onScrollEnd: function() {
              if(articleScroll.y < -200) {
                $("#article-page .page-to-top").fadeIn(200);
              }
              else {
                $("#article-page .page-to-top").hide();
              }
            }
        });
    }
}

$(document).on('pagehide', '#article-page', function() {
    if(pager)
        pager.destroy();
    pager = null;
    
    $("#articles").html("");
});

$(document).on('pageinit', '#article-page', function() {
  $("#article-page .ui-btn-back").live('click', function(e) {
    e.preventDefault();
    //console.log("LOG02 ");
    $.mobile.changePage('#home-page', {transition: 'slide', reverse: true});

    return false;
  });

  $("#article-page .page-to-top .nav-top").unbind().click(function() {
    if(articleScroll) {
      articleScroll.scrollTo(0,0,200);
    }

    scrollTo(0, 0);

    $("#article-page .page-to-top").hide();
  });
});

$p = $('#article-page').find("#popupMenu").find("ul");
$p.find('a').click(function(){
  var id = $(this).attr('id');
  var articleId = "#article_single_" + currentPage;
  
  $(articleId + ' .articleinfo').css('font-size', id+'px');

  refreshBodySize();
});

/*
//swipeleft/swiperight events to change articles in section
$( document ).on( "swipeleft swiperight", "#article-page", function( e ) {
  $('#article-page').find('.custom-footer a:first-child').removeClass('save-article-complete').addClass('save-article');

  currentPage = ( e.type === "swipeleft" ) ? currentPage + 1 : currentPage - 1;
  if ( currentPage<0 )
    currentPage=0;
  else if ( currentPage== $("#article-page").data("articleCount") )
    currentPage=$("#article-page").data("articleCount")-1;
  else
    loadCurrentPage();

});

function loadCurrentPage() {
	var objArticles = $('#article-page').data("articlesJSON");
	var currentArticle = objArticles.getElementsByTagName("item")[currentPage];
	currentArticle = $(currentArticle);
	
	var $page = $('#article-page');
	$page.find('.articleinfo').empty();
	$page.find('.article-img').html('');
	$page.find('.custom_section').find('h3').html( currentArticle.find("title").text()+'<span class="article-provider"> By '+currentArticle.find("author").text()+ '</span>' );
	
	if( currentArticle.find("photo").text() )
		$page.find('.article-img').html('<img src="img/tn_loader.gif" data-frz-src="'+currentArticle.find("photo").text()+'" alt="photo" onload=lzld(this) onerror=lzld(this)/>');
	$page.find('.articleinfo').html(currentArticle.find("story").text());
}
*/

//article favorite or offline storage
$("#article-page").find('.custom-footer a:first-child').live('click', function( e ) {
                                                             
  var objArticles = $('#article-page').data("articlesJSON");
  var currentArticle = objArticles.getElementsByTagName("item")[currentPage];
  currentArticle = $(currentArticle);
  var item = {};

  item['title'] = currentArticle.find("title").text();
  item['story'] = currentArticle.find("story").text();
  item['photo'] = currentArticle.find("photo").text();
  item['author'] = currentArticle.find("author").text();

  //console.log(item);
  db.getEntry(item['title'],function(e) {
    //console.log(e.title);
    if( e.title ) {
      db.deleteEntry(e.title,function(){
        console.log('deleted');
        $('#article-page').find('.custom-footer a:first-child').removeClass('save-article-complete').addClass('save-article');
      });
    } else {
      db.saveEntry(item, function(){
        console.log('saved');
        $('#article-page').find('.custom-footer a:first-child').removeClass('save-article').addClass('save-article-complete');
      });
    }
  });
});


$('#favorites-page').live('pagebeforeshow', function(event, ui) {
  var $page = $('#favorites-page');
  db.getEntries(function(data){
    var results=data.length;
    if( results>0 ) {
      $page.find(".favorite").empty("");
      $list=$page.find(".favorite");
      for(i=0;i<results;i++){
        //console.log(data);
        var n='<li><div><a href="#">';
        n+='<p>'+data[i].title+"</p>";
        var imgSrc = 'images/default.png';
        if( data[i].photo )
          imgSrc = data[i].photo;
        n+='<img  src="'+imgSrc+'" alt="photo" /></a>';
        n+="</div></li>";
        var r=$(n);
        $list.append(r);
      }
      //$list.refresh();
      //myScroll.refresh();
    }
  });
});

$('#favorites-page').live('pageshow', function(event, ui) {
  var $favPageList = $('#favorites-page').find('.favorite');
  $favPageList.find('a').click(function(){
    var title = $(this).find('p').text();
    console.log(title);
    db.getEntry(title, function(o){
      $('#fav-page').data('favJSON', JSON.stringify(o));
      $.mobile.changePage('#fav-page', { transition: 'slide',reverse: true });
    });
  });
});

$('#photos-page').live('pagebeforeshow', function(event, ui) {
  var ob = JSON.parse( localStorage.getItem('photoObj') );
  if( ob ){
    var $page = $('#photos-page');
    $page.find('.grid').empty();
    $list=$page.find(".grid");
    $.each(ob, function(i){

      //pot1
      ob[i].photo = ob[i].photo.replace(/\+/gi,'%2B');

      var nTitle = ob[i].caption;
      nTitle = ( nTitle.length > 28 ) ? nTitle.substr(0, 28).concat('...') : nTitle;
      var caption = ob[i].caption;
      nTitle = ( caption.length > 50 ) ? caption.substr(0, 50).concat('...') : caption;
      var n = '<li class="touchcarousel-item"><div><a class="item-block" href="'+ob[i].photo+'" rel="external">';
      n+='<img src="'+ob[i].photo+'" alt="' + caption + '""/></a>';
      n += ''+nTitle+i+"</div></li>";
      var r=$(n);
      $list.append(r);
    });
  }
});

(function(window, $, PhotoSwipe){
 
  $(document).ready(function(){
    $('#photos-page')
    .live('pageshow', function(e){
      var currentPage = $(e.target),
      options = {getToolbar:function(){
      return '<div class="ps-toolbar-close" style="padding-top: 11px;">Back</div><div class="ps-toolbar-play" style="padding-top:11px;">Play</div><div class="ps-toolbar-previous" style="padding-top: 11px;">Previous</div><div class="ps-toolbar-next" style="padding-top:11px;">Next</div>';}},
      photoSwipeInstance = $("ul#PGallery a", e.target).photoSwipe(options,  currentPage.attr('id'));
      return true;
    })                  
    .live('pagehide', function(e){                      
      var currentPage = $(e.target),
      photoSwipeInstance = PhotoSwipe.getInstance(currentPage.attr('id'));
      if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
        PhotoSwipe.detatch(photoSwipeInstance);
      }                       
      return true;
    });     
  });
 
}(window, window.jQuery, window.Code.PhotoSwipe));

$('#videos-page').live('pageinit', function() {
  $.ajax({
    type: "GET",
    beforeSend: function() { $.mobile.showPageLoadingMsg(); },
    complete: function() { $.mobile.hidePageLoadingMsg() },
    url: "http://gdata.youtube.com/feeds/users/NTVKenya/uploads?alt=json-in-script&format=5",
    cache: true,
    dataType:'jsonp',
    success: function(data) {
      var $page = $('#videos-page');
      $page.find('.grid').empty();
      $list=$page.find(".grid");

      var url;
      $(data.feed.entry).each(function(entry){
        url = this.link[0].href;
        var url_thumbnail = this.media$group.media$thumbnail[3].url;
        url_thumbnail = url_thumbnail.replace(/\+/gi,'%2B');

        var title = this.media$group.media$title.$t;
        title = (title.length > 28) ? title.substr(0, 28).concat('...') : title;
        if (url.indexOf("feature=") >= 0)
        {
          url = url.substring(0, url.indexOf("feature=") - 1);
        }
        if (url.indexOf("watch?") >= 0 && url.indexOf("v=") >= 0)
        {
          url = url.substring(0,url.indexOf("watch?")) + "embed/" + url.substring(url.indexOf("v=") + 2, url.length); 
        }
        
        var n = '<li class="touchcarousel-item"><div><a class="item-block" rel="external" data-url="'+url+'" href="#" id="video-' + entry + '">';
        n+='<img src="img/tn_loader.gif" data-frz-src="'+url_thumbnail+'" onload=lzld(this) onerror=lzld(this) /></a>';
        n+=''+title+"</div></li>";
        var article_row = $(n);
        $list.append(article_row);

        $page.find('a#video-' + entry).live('click', function(){
          //$.mobile.showPageLoadingMsg();
          var ytUrl = $(this).data('url');
          //console.log("LOG20 ONCLICK ", ytUrl);
          setPhotoUrl(ytUrl);
          
        });
      });	

      setPhotoUrl(url);
    }
  });
});

function setPhotoUrl(url) {
  //console.log("LOG21 setPhotoUrl ", url);
	var rect = document.body.getBoundingClientRect();
	document.getElementById("videoframe").style["height"] = (rect.right * 0.6) + "px";
	document.getElementById("video-loading-img").style["height"] = (rect.right * 0.6) + "px";
	document.getElementById("video-loading-img").style["paddingTop"] = (rect.right * 0.24) + "px";
	document.getElementById("videoframe").style["display"] = "none";
	document.getElementById("video-loading-img").style["display"] = "block";
	document.getElementById("videoframe").src = url;
  document.getElementById("videoframe").onload = function() {
    $("#video-loading-img").hide();
    $(this).show();   
  };
}

$('#videos-page').live('pageshow', function(event, ui) {
  var $list = $('#videos-page').find('.grid');
  /*
  $list.find('a').live('click', function(){
    $.mobile.showPageLoadingMsg();
    var ytUrl = $(this).attr('id');
    setPhotoUrl(ytUrl);
    console.log("LOG20 ONCLICK ", ytUrl);
  });
*/
});

$('#fav-page').live('pageshow', function(event, ui) {
  var ob = JSON.parse($('#fav-page').data('favJSON'));
  var $page = $('#fav-page');
  $page.find('.articleinfo').empty();
  $page.find('.article-img').html('');
  $page.find('.custom_section').find('h3').html( ob.title+'<span class="article-provider"> By '+ob.author+ '</span>' );
  if( ob.photo )
    $page.find('.article-img').html('<img src="'+ob.photo+'" alt="photo"/>');
  $page.find('.articleinfo').html( ob.story);
});

$('#settings-page').live("pageshow", function (event, ui) {
  var $clearFav = $('#settings-page').find('#clearfavorites');
  $clearFav.find('a').click(function(){
    console.log('clear');
    db.deleteEntries(function(){
      console.log('deleted');
    });
  });
});

$('#categories-page').live("pagebeforecreate", function (event, ui) {
  //console.log(localStorage.getItem('catData'));
  initializeForm();
  $('#categories-page').off('change', 'select').on('change', 'select', function(){		
    var fields = $('#categories-page').find(":input").serializeArray();
    //console.log(fields);		
    storeFormData(JSON.stringify(fields));
  });
});

/* back buttons */ 
$('#categories-page').live("pageinit", function (event, ui) {
  $("#categories-page .ui-btn-back").unbind();
  $("#categories-page .ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });
});

$('#refreshInterval-page').live("pageinit", function (event, ui) {
  var $page = $('#refreshInterval-page');
  $page.find(".ui-btn-back").unbind();
  $page.find(".ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });

  var val = getSettings("refreshInterval");
  $page.find("input[type='radio']").attr("checked",false).checkboxradio("refresh");
  $page.find("#radio-choice-" + val).attr("checked", true).checkboxradio("refresh");
  
  $page.find("input[type='radio']").bind("change", function() {
    console.log($(this).val());
    saveSettings("refreshInterval", $(this).val());

    if(timerNewsFeed)
      clearInterval(timerNewsFeed);

    $('#home-page').data('refreshInterval', $(this).val());

    if($(this).val() != "0" ) {
      timerNewsFeed = setInterval(function() {
        getBreakingNews();
        updateNewsFeed();

      }, $(this).val());
    }
  });
});

$('#textSize-page').live("pageinit", function (event, ui) {
  var $page = $('#textSize-page');
  $page.find(".ui-btn-back").unbind();
  $page.find(".ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });

  var val = getSettings("textSize");
  $page.find("input[type='radio']").attr("checked",false).checkboxradio("refresh");
  $page.find("#radio-choice-" + val).attr("checked", true).checkboxradio("refresh");
  
  $page.find("input[type='radio']").bind("change", function() {
    console.log($(this).val());
    saveSettings("textSize", $(this).val());
  });
});

$('#tweetpush-page').live("pageinit", function (event, ui) {
  var $page = $('#tweetpush-page');
  $page.find(".ui-btn-back").unbind();
  $page.find(".ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });

  var val = getSettings("pushTweet");
  if(val == "1") {
    $page.find("#tweetpush-chice-1").attr("checked",true).checkboxradio("refresh");
    $page.find("#tweetpush-chice-0").attr("checked", false).checkboxradio("refresh");
  }
  else {
    $page.find("#tweetpush-chice-1").attr("checked", false).checkboxradio("refresh");
    $page.find("#tweetpush-chice-0").attr("checked",true).checkboxradio("refresh");
  }

  $page.find("input[type='radio']").bind("change", function() {
    saveSettings("pushTweet", $(this).val());

    if($(this).val() == "1") {
      enablePushTweet();
    }
    else {
      disablePushTweet();
    }
  });
});

$('#aboutUs-page').live("pageinit", function (event, ui) {
  $("#aboutUs-page .ui-btn-back").unbind();
  $("#aboutUs-page .ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });
});

$('#policy-page').live("pageinit", function (event, ui) {
  $("#policy-page .ui-btn-back").unbind();
  $("#policy-page .ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });
});

$('#terms-page').live("pageinit", function (event, ui) {
  $("#terms-page .ui-btn-back").unbind();
  $("#terms-page .ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });
});

$('#contact-page').live("pageinit", function (event, ui) {
  $("#contact-page .ui-btn-back").unbind();
  $("#contact-page .ui-btn-back").bind('tap', function(e) {
    e.preventDefault();
    $.mobile.changePage("#settings-page", { transition: "fade"});
    return false;
  });
});

function storeFormData(data) {
  localStorage.setItem('catData', data);
}

function initializeForm(section) {
  var formData = localStorage.getItem('catData');
  
  if(formData != null) {
    jQuery.each(jQuery.parseJSON(formData), function(i, field){
      var select = $(document).find('select[name="' + field.name + '"]');			
      select.find('[value="' + field.value + '"]').attr('selected','selected');
    });		
  }
	//console.log( isCategoryVisible('Technology') );
}

// searchVal - ex: 'Politics'
function isCategoryVisible(searchVal) {
	var obj = localStorage.getItem('catData');
	
	if( obj != null) {
		//console.log(obj);
		var visible;
		jQuery.each(jQuery.parseJSON(obj), function(i, field) {			
      if (field.name == searchVal) {
        visible = (field.value == 'on') ? true: false;
      }
    });
		return visible;
	} else {
		return true;
	}
}

/*
 * Settings
 */
function saveSettings(key, value) {
  appSettings = localStorage.getItem("settingData");

  // set default settings
  if(appSettings == null) {
    appSettings = defaultSettings;
  }
  else {
    appSettings = JSON.parse(appSettings);
  }

  appSettings[key] = value;

  localStorage["settingData"] = JSON.stringify(appSettings);
} 

function getSettings(key) {
  //localStorage.removeItem("settingData");
  appSettings = localStorage.getItem("settingData");

  // set default settings
  if(appSettings == null) {
    appSettings = defaultSettings;
    localStorage["settingData"] = JSON.stringify(appSettings);
  }
  else {
    appSettings = JSON.parse(appSettings);
  }

  console.log(appSettings);

  return appSettings[key];
}

/*
 * Boxcar
 */
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

//for swipeup/swipedown events
(function() {
 // initializes touch and scroll events
 var supportTouch = $.support.touch,
 scrollEvent = "touchmove scroll",
 touchStartEvent = supportTouch ? "touchstart" : "mousedown",
 touchStopEvent = supportTouch ? "touchend" : "mouseup",
 touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
 
 // handles swipeup and swipedown
 $.event.special.swipeupdown = {
 setup: function() {
 var thisObject = this;
 var $this = $(thisObject);
 
 $this.bind(touchStartEvent, function(event) {
  $.mobile.touchOverflowEnabled = true;
  var data = event.originalEvent.touches ?
  event.originalEvent.touches[ 0 ] :
  event,
  start = {
  time: (new Date).getTime(),
  coords: [ data.pageX, data.pageY ],
  origin: $(event.target)
  },
  stop;
  
  function moveHandler(event) {
  if (!start) {
  return;
  }
  
  var data = event.originalEvent.touches ?
  event.originalEvent.touches[ 0 ] :
  event;
  stop = {
  time: (new Date).getTime(),
  coords: [ data.pageX, data.pageY ]
  };
  
  // prevent scrolling
  if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
  event.preventDefault();
  }
  }
  
  $this
  .bind(touchMoveEvent, moveHandler)
  .one(touchStopEvent, function(event) {
       $this.unbind(touchMoveEvent, moveHandler);
       if (start && stop) {
       if (stop.time - start.time < 1000 &&
           Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
           Math.abs(start.coords[0] - stop.coords[0]) < 75) {
       start.origin
       .trigger("swipeupdown")
       .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
       }
       }
       start = stop = undefined;
       });
  });
 }
 };
 
 //Adds the events to the jQuery events special collection
 $.each({
    swipedown: "swipeupdown",
    swipeup: "swipeupdown"
  }, function(event, sourceEvent){
    $.event.special[event] = {
      setup: function(){
        $(this).bind(sourceEvent, $.noop);
      }
    };
  });
})();


(function (window) {
 
 // This library re-implements setTimeout, setInterval, clearTimeout, clearInterval for iOS6.
 // iOS6 suffers from a bug that kills timers that are created while a page is scrolling.
 // This library fixes that problem by recreating timers after scrolling finishes (with interval correction).
 // This code is free to use by anyone (MIT, blabla).
 // Author: rkorving@wizcorp.jp
 
 var timeouts = {};
 var intervals = {};
 var orgSetTimeout = window.setTimeout;
 var orgSetInterval = window.setInterval;
 var orgClearTimeout = window.clearTimeout;
 var orgClearInterval = window.clearInterval;
 
 
 function createTimer(set, map, args) {
    var id, cb = args[0], repeat = (set === orgSetInterval);
 
    function callback() {
        if (cb) {
            cb.apply(window, arguments);
 
            if (!repeat) {
                delete map[id];
                cb = null;
            }
        }
    }
 
    args[0] = callback;
 
    id = set.apply(window, args);
 
    map[id] = { args: args, created: Date.now(), cb: cb, id: id };
 
    return id;
 }
 
 
 function resetTimer(set, clear, map, virtualId, correctInterval) {
    var timer = map[virtualId];
 
    if (!timer) {
        return;
    }
 
    var repeat = (set === orgSetInterval);
 
    // cleanup
 
    clear(timer.id);
 
    // reduce the interval (arg 1 in the args array)
 
    if (!repeat) {
        var interval = timer.args[1];
 
        var reduction = Date.now() - timer.created;
        if (reduction < 0) {
            reduction = 0;
        }
 
        interval -= reduction;
        if (interval < 0) {
            interval = 0;
        }
 
        timer.args[1] = interval;
    }
 
    // recreate
 
    function callback() {
        if (timer.cb) {
            timer.cb.apply(window, arguments);
            if (!repeat) {
                delete map[virtualId];
                timer.cb = null;
            }
        }
    }
 
    timer.args[0] = callback;
    timer.created = Date.now();
    timer.id = set.apply(window, timer.args);
 }
 
 //momo
 window.setTimeout = function () {
   for (var i = 0; i < 1000000; i++);
   return createTimer(orgSetTimeout, timeouts, arguments);
 };
 
 
 window.setInterval = function () {
   for (var i = 0; i < 1000000; i++);
   return createTimer(orgSetInterval, intervals, arguments);
 };
 
 window.clearTimeout = function (id) {
    var timer = timeouts[id];
 
    if (timer) {
        delete timeouts[id];
        orgClearTimeout(timer.id);
    }
 };
 
 window.clearInterval = function (id) {
    var timer = intervals[id];
 
    if (timer) {
        delete intervals[id];
        orgClearInterval(timer.id);
    }
 };
 
 window.addEventListener('scroll', function () {
  // recreate the timers using adjusted intervals
  // we cannot know how long the scroll-freeze lasted, so we cannot take that into account

  var virtualId;

  for (virtualId in timeouts) {
    resetTimer(orgSetTimeout, orgClearTimeout, timeouts, virtualId);
  }

  for (virtualId in intervals) {
    resetTimer(orgSetInterval, orgClearInterval, intervals, virtualId);
  }
 });
 
}(window));

