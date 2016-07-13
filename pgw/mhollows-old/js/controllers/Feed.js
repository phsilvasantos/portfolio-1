'use strict';

angular.module('gnApp.controllers')
  .controller('FeedController', function ($scope, HttpUtils, Utils, $location, $ionicSideMenuDelegate, $ionicPopover, $ionicScrollDelegate, $state) {

    $scope.feeds = [];

    $ionicSideMenuDelegate.canDragContent(true);

    $scope.user = Parse.User.current();
    $scope.userGroups = [];
    $scope.filters = {type: ''};

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

    $scope.onSelectFeedType = function (type, e) {
      if (window.mixpanel) {
        window.mixpanel.track("Filter Feed", {
          "Filter": type,
        });
      }
      jQuery('#selected_typename').text(jQuery(e.toElement).text());
      $scope.filters.type = type;
      $ionicScrollDelegate.scrollTop(0);
      $scope.typePopover.hide();
    };

    $scope.feedImage = function (image, author) {
      if (image) {
        return image.url();
      }

      try {
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
      if (bool !== false) {
        Utils.showIndicator();
      }
      HttpUtils.getUserGroups(Parse.User.current(), function (groups) {
        $scope.feeds = [];
        $scope.userGroups = [];
        groups.forEach(function(g){
          if(g) {
            $scope.userGroups.push(g.id);
          }
        });
        $scope.loadAnnouncements(bool);
      });
    };

    $scope.announcements = [];
    $scope.loadAnnouncements = function (bool) {
      if (bool !== false) {
        Utils.showIndicator();
      }
      var Announcement = Parse.Object.extend('Announcement');

      var allQuery = new Parse.Query(Announcement);
      allQuery.equalTo('target', 'all');

      var specificQuery = new Parse.Query(Announcement);
      specificQuery.equalTo('target', 'specific');
      specificQuery.containedIn('targetGroups', $scope.userGroups);

      var currentDate = new Date();
      // currentDate.setHours(0, 0, 0, 0);

      var expireableQuery = Parse.Query.or(allQuery, specificQuery);
      expireableQuery.notEqualTo('expireOn', null);
      expireableQuery.greaterThanOrEqualTo('expireOn', currentDate);

      var notExpireableQuery = Parse.Query.or(allQuery, specificQuery);
      notExpireableQuery.equalTo('expireOn', null);
      //notExpireableQuery.doesNotExist('expireOn');

      var query = Parse.Query.or(expireableQuery, notExpireableQuery);
      query.include('author.profile,category,event');
      query.lessThanOrEqualTo('publishOn', currentDate);
      query.descending('publishOn');

      query.find({
        success: function (data) {
          $scope.$apply(function () {
            jQuery(data).each(function () {
              var image = this.get('image');
              if (!image && this.get('event')) {
                image = this.get('event').get('thumbImage') || this.get('event').get('image');
              }
              var type = this.get('for');
              var categoryText = this.get('category') ? this.get('category').get('name') : 'News';
              if (type == 'event') {
                categoryText = 'Upcoming Program';
              }
              if (type == 'event_recap') {
                categoryText = 'Event Recap';
              }
              $scope.feeds.push({
                type: type,
                class: type == 'event' ? 'event': 'news',
                id: this.id,
                category: categoryText,
                publishOn: this.get('publishOn'),
                author: this.get('author'),
                title: this.get('title'),
                subtitle: this.get('strapLine'),
                image: image,
                object: this
              });
            });
          });
          Utils.hideIndicator();
          $scope.$broadcast('scroll.refreshComplete');
        },
        error: function () {
          Utils.hideIndicator();
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
    };

    $scope.getFeedDisplayDate = function (str) {
      return moment(str).format('MMMM DD');
    };

    $scope.openFeed = function (feedItem) {
      openAnnouncement(feedItem.object, feedItem.type, $state);
    };

    $scope.applyLogo();
    $scope.loadData();
  });
