'use strict';

angular.module('gnApp.controllers')
  .controller('FeedController', function ($scope, HttpUtils, Utils, $location, $ionicSideMenuDelegate, $ionicPopover, $ionicScrollDelegate, $state) {

    $scope.categories = [];
    $scope.feeds = [];
    
    $scope.isMoreFeeds = true;

    $ionicSideMenuDelegate.canDragContent(true);

    $scope.user = Parse.User.current();
    $scope.userGroups = [];
    $scope.filters = {type: 'all'};
    $scope.options = {
      user: Parse.User.current().id, 
      page: -1, per: 10,
      categoryId : $scope.filters.type
    };

    /** == filters menu == */
    $scope.typePopover = null;
    $ionicPopover.fromTemplateUrl('feedtypes-popover', {
      scope: $scope
    }).then(function (popover) {
      $scope.typePopover = popover;
    });

    $scope.$on('$destroy', function () {
      $scope.typePopover.remove();
    });

    $scope.onSelectFeedType = function (category, e) {
      jQuery('#selected_feedtypename').text(jQuery(e.toElement).text());
      
      $scope.options.page = 0;
      $scope.options.categoryId = category.id;
      $scope.feeds = [];
      Utils.showIndicator('feed:loadData');
      $scope.fetchAnnouncement();
      $scope.typePopover.hide();
    };

    $scope.feedImage = function(feedItem) {
      var image = feedItem.get('image');
      if (!image && feedItem.get('event')) {
        image = feedItem.get('event').get('thumbImage') || feedItem.get('event').get('image');
      }
      if (image) {
        return image.url();
      }

      try {
        var author = feedItem.get("author");
        return author.get('profile').get('thumbImage').url();
      } catch (err) {
      }

      return '';
    };

    var feedIcons = {
      news: 'ion-document-text', event: 'ion-calendar'
    };
    $scope.getFeedIcon = function (feed) {
      if(feed.type === 'event_recap'){
        return 'ion-flag';
      }
      return feedIcons[feed.class];
    };

    //load data by user's groups
    $scope.loadData = function (bool) {
      HttpUtils.getUserGroups(Parse.User.current(), function (groups) {
        $scope.feeds = [];
        $scope.userGroups = [];
        groups.forEach(function(g){
          if(g) {
            $scope.userGroups.push(g.id);
          }
        });
        if (bool !== false) {
          $scope.loadCategories();
        }else{
          $scope.options.page = -1;
          $scope.fetchAnnouncement();
        }

      });
    };
    
    //load data for categories popover.
    $scope.loadCategories = function () {
      var Categories = Parse.Object.extend('AnnouncementCategory');
      var categoryQuery = new Parse.Query(Categories);
      categoryQuery.find({
        success: function (data) {
          console.log('AnnouncementCategory', data);
          $('.feedtypes-popover').css('height', (50*data.length + 100) + 'px');
          $scope.categories = data;
        },
        error: function () {}
      });
    };

    //load post data every infinite scrolling.
    $scope.fetchAnnouncement = function (bool) {
      Parse.Cloud.run('listAnnouncements', $scope.options, function (data) {
        $scope.$apply(function () {
          if ($scope.options.page === 0) {
            $scope.feeds = data;
            $ionicScrollDelegate.scrollTop();
          } else {
            $scope.feeds = $scope.feeds.concat(data);
          }
          $scope.isMoreFeeds = data.length >= $scope.options.per;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        });
      });
    };

    $scope.getFeedDisplayDate = function (str) {
      return moment(str).format('MMMM DD');
    };

    $scope.openFeed = function (feedItem) {
      openAnnouncement(feedItem, feedItem.get("for"), $state);
    };
    
    $scope.fetchMoreFeeds = function () {
      $scope.options.page++;
      $scope.fetchAnnouncement();
    };

    $scope.applyLogo();
    $scope.loadData();
  });
