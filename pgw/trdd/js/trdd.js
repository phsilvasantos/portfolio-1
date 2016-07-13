// Initialize your app
var myApp = new Framework7({
    pushState: true, //hash navigation
    cache: false
});

// Export selectors engine
var $$ = Framework7.$;

myApp.storyItemTemplate = $$('#story-item-template').html();
myApp.articleItemTemplate = $$('#article-item-template').html();

myApp.articles = {
    loading: false,
    maxItems: 0,
    itemsPerLoad: 10,
    lastIndex: -1
};

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

//myApp.selectedClusterId = '53f4c366f9ab2a020027c3b5';
// Build list of clusters on home page
myApp.refreshStories = function() {

    myApp.showIndicator();

    myApp.get('api/clusters.json', function(data) {
        myApp.hideIndicator();
        myApp.pullToRefreshDone();
        $$('[data-page=index] .page-content').scrollTop(0, 300);

        var clustersData = [];

        $$('.clusters-list ul').html('');
        clustersData = JSON.parse(data);
        var html = '';
        for (var i = 0; i < clustersData.length; i++) {
            var representingArticle = clustersData[i].articles.filter(function(article) {
                return clustersData[i].representingArticle == article._id;
            })[0];
            representingArticle.cluster_id = clustersData[i]._id;
            representingArticle.total_articles = clustersData[i].articles.length;
            html += Mustache.render(myApp.storyItemTemplate, representingArticle);
        }
        $$('.clusters-list ul').html(html);

        myApp.clustersData = clustersData;
    });
};

// Build list of articles of selected article
myApp.refreshArticles = function() {
    myApp.articles.lastIndex = -1;
    myApp.articles.maxItems = 0;
    if (myApp.clustersData) {
        myApp.drawArticlesList(myApp.clustersData);
    } else {
        myApp.showIndicator();
        myApp.get('api/clusters.json', function(data) {
            myApp.hideIndicator();
            myApp.pullToRefreshDone();
            myApp.clustersData = JSON.parse(data);
            myApp.drawArticlesList(myApp.clustersData);

            $$('[data-page=details] .page-content').scrollTop(0, 300);
        });
    }
};

myApp.drawArticlesList = function(data) {
    var articles = data.filter(function(cluster) {
        //console.log(cluster._id + ' == ' + myApp.selectedClusterId);
        return cluster._id == myApp.selectedClusterId;
    })[0].articles;
    
    articles = articles.sort(function(a, b){
         return (b.last_update > a.last_update) ? 1 : ((b.last_update < a.last_update) ? -1 : 0);
    });

    myApp.articles.maxItems = articles.length;

    if (myApp.articles.lastIndex == -1) {
        $$('.articles-list ul').html('');
    }
    var html = '';
    for (var i = myApp.articles.lastIndex + 1; i <= myApp.articles.lastIndex + myApp.articles.itemsPerLoad; i++) {
        if (i >= articles.length) {
            break;
        }
        html += Mustache.render(myApp.articleItemTemplate, articles[i]);
    }
    $$('.articles-list ul').append(html);

    myApp.articles.lastIndex = $$('.articles-list li').length - 1;


    if (myApp.articles.lastIndex + 1 >= myApp.articles.maxItems) {
        // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
        myApp.detachInfiniteScroll($$('.infinite-scroll'));
        // Remove preloader
        $$('.infinite-scroll-preloader').remove();
        return;
    }
};

//bind events to elements
myApp.bindEvents = function() {
    $$(document).on('infinite', '.infinite-scroll', function() {
        // Exit, if loading in progress
        if (myApp.articles.loading)
            return;

        // Set loading flag
        myApp.articles.loading = true;

        // Emulate 1s loading
        setTimeout(function() {
            // Reset loading flag
            myApp.articles.loading = false;

            myApp.drawArticlesList(myApp.clustersData);

        }, 600);
    });

    $$(document).on('refresh', '.pull-to-refresh-content', function() {
        if ($$(this).parents('.page').data('page') == 'index') {
            myApp.refreshStories();
        } else if ($$(this).parents('.page').data('page') == 'details') {
            myApp.clustersData = null;
            myApp.refreshArticles();
        }
    });

    //load clusters
    $$(document).on('click', '.refresh-click.clusters', function() {
        myApp.refreshStories();
    });

    //load articles
    $$(document).on('click', '.refresh-click.articles', function() {
        myApp.clustersData = null;
        myApp.refreshArticles();
    });

    $$(document).on('click', '.item-link.article', function() {
        window.open($$(this).data('link'), '_blank');
    });

    myApp.onPageInit('details', function(page) {
        myApp.selectedClusterId = location.href.substr(location.href.indexOf('details.html?') + 'details.html?'.length);
        myApp.refreshArticles();
    });

};

//init bind Events
myApp.bindEvents();

// Update html and weather data on app load
myApp.refreshStories();
