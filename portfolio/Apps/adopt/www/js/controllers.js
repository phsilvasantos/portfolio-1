angular.module('wpIonic.controllers', ['ngIOS9UIWebViewPatch']).controller('AppCtrl', function ($scope, $ionicModal, $timeout, $sce, Utils, $rootScope, $ionicSideMenuDelegate) {

  // Enter your site url here. You must have the Reactor Core plugin activated on this site

  $rootScope.url = 'http://adoptapet.ie';

  $rootScope.callback = '_jsonp=JSON_CALLBACK';
  $rootScope.filterTitle = {
    "location": "Location", "breeds": "Breed", "size": "Size", "gender": "Gender",
    "location_cat": "Location", "gender_cat": "Gender",
    "location_others": "Location", "other_type": "Type"
  }

  $rootScope.getFilterData = function (filter) {
    Utils.loadDogsTerms(filter, $rootScope.petKind).then(function (rep) {
      $rootScope.petsTermsInfo = rep.facets;
      $rootScope.totalCount = rep.settings.pager.total_rows;
      $rootScope.totalDisplay = $rootScope.totalCount + ' ' + $rootScope.keyword;
      console.log($rootScope.totalCount);
      for (var key in rep.facets) {
        var string = rep.facets[key];
        var newkey = key.replace('-', '_');
        var res = string.replace('<select class="facetwp-dropdown">', '<div class="input-label">' + $rootScope.filterTitle[newkey] + '</div><select ng-model="filter.' + newkey + '" ng-change="updateFilters()">');
        rep.facets[key] = res;
      }
    });
  };

  $rootScope.updateFilters = function () {
    $rootScope.getFilterData($rootScope.filter);
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
    $scope.src = $sce.trustAsResourceUrl($rootScope.url + '/app-contact-pet/?author_id={{post.contactinfo.authorid}}&post_title={{post.contactinfo.posttitle}}');
  });
  Utils.hideRefineBtn();
  // Triggered in the login modal to close it
  $scope.closeLogin = function () {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function () {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.logUserIn = function (username, password) {

    console.log('Logging in...');

    $scope.spinner = true;
    $scope.loginMessage = null;

    targetFrame = window.frames['login-iframe'];
    targetFrame.postMessage({
      message: 'login',
      username: username,
      password: password

    }, '*');

  }

  window.addEventListener('message', function (event) {

    if (event.data.loggedin === true) {
      $scope.spinner = false;
      console.log(event.data);
      $scope.loggedin();
      $scope.closeLogin();
      localStorage.setItem('reactorUser', JSON.stringify(event.data));
    }

    if (event.data.loggedin === false) {
      $scope.spinner = false;
      console.log(event.data.message);
      $scope.loginMessage = event.data.message;
      $scope.$apply();
    }

  });

  $scope.loggedin = function () {
    $scope.isUserLoggedIn = true;
  }

  $scope.logUserOut = function () {
    $scope.$broadcast('logout');
  }

  $scope.$on('logout', function (event, msg) {
    console.log('doing logout');
    localStorage.removeItem('reactorUser');
    $scope.isUserLoggedIn = false;
    $scope.closeLogin();
  });

  $rootScope.notSorted = function (obj) {
    if (!obj)
      return [];
    return Object.keys(obj);
  };
  $rootScope.clearFilter = function () {
    $rootScope.filterPram = {};
    for (var key in $rootScope.filter) {
      $rootScope.filter[key] = "";
    }
    $rootScope.updateFilters();
  };
  $rootScope.searchFilter = function () {
    switch ($rootScope.petKind) {
      case 'dogs':
        $rootScope.filterUrl = $rootScope.url + '/wp-json/posts?type=dogs';
        if ($rootScope.filter.location)
          $rootScope.filterUrl += '&filter[location]=' + $rootScope.filter.location;
        if ($rootScope.filter.breeds)
          $rootScope.filterUrl += '&filter[breed]=' + $rootScope.filter.breeds;
        if ($rootScope.filter.gender)
          $rootScope.filterUrl += '&filter[genderdogs]=' + $rootScope.filter.gender;
        if ($rootScope.filter.size)
          $rootScope.filterUrl += '&filter[sizedogs]=' + $rootScope.filter.size;
        $rootScope.$broadcast("dogsFilterLoad");
        break;
      case 'cats':
        $rootScope.filterUrl = $rootScope.url + '/wp-json/posts?type=cats';
        if ($rootScope.filter.location_cat)
          $rootScope.filterUrl += '&filter[locationcats]=' + $rootScope.filter.location_cat;
        if ($rootScope.filter.gender_cat)
          $rootScope.filterUrl += '&filter[gendercats]=' + $rootScope.filter.gender_cat;
        $rootScope.$broadcast("catsFilterLoad");
        break;
      case 'others':
        $rootScope.filterUrl = $rootScope.url + '/wp-json/posts?type=others';
        if ($rootScope.filter.location_others)
          $rootScope.filterUrl += '&filter[locationothers]=' + $rootScope.filter.location_others;
        if ($rootScope.filter.other_type)
          $rootScope.filterUrl += '&filter[otherpetstype]=' + $rootScope.filter.other_type;
        $rootScope.$broadcast("othersFilterLoad");
        break;
      default:
        break;
    }
  };
  $scope.initPhotoFullviewModal = function () {
    $rootScope.photoModalService = {
      formatDate: Utils.formatDate,
      photos: [],
      activeSlide: 0,
      category: '',
      viewPhoto: function (photos, index, category) {
        $rootScope.photoModalService.photos = photos;
        $rootScope.photoModalService.category = category;
        $rootScope.photoModal.show();
        Utils.showIndicator();
        $('.modal-photoview .slider-slides').css('opacity', 0);
        var _self = this;
        $timeout(function () {
          _self.activeSlide = index || 0;
          $timeout(function () {
            $('.modal-photoview .slider-slides').animate({opacity: 1}, 500);
            $('.modal-photoview .modal-content').removeClass('hide-caption');
            Utils.hideIndicator();
          }, 200);
        }, 300);
      },
      getImgUrl: function (photo) {
        if (typeof (photo) == 'string')
          return photo;
        else
          return photo.full[0];
      }
    };
    $ionicModal.fromTemplateUrl('templates/modal-photoview.html', {
      id: 'viewphoto',
      scope: $rootScope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $rootScope.photoModal = modal;
    });

    $rootScope.$on('$destroy', function () {
      $rootScope.photoModal.remove();
    });

    $rootScope.$on('modal.shown', function (event, modal) {
      if (modal.id == 'viewphoto') {
        if (window.StatusBar) {
          StatusBar.hide();
        }
        setTimeout(function () {
          $('.modal-photoview').find('.modal-content')
                  .width($(document).width())
                  .height($(document).height());
        });
      }
    });

    $rootScope.$on('modal.hidden', function (event, modal) {
      if (modal.id == 'viewphoto') {
        if (window.StatusBar) {
          StatusBar.show();
        }
      }
    });
  };

  $scope.initPhotoFullviewModal();
  $scope.$watch(function () {
    return $ionicSideMenuDelegate.getOpenRatio();
  },
  function (ratio) {
    if (ratio > 0.1) {
      $scope.closeDrawer();
    }
  });
})


//================================================================================================
//
//	Google Analytics Controller
//
//================================================================================================

googleanalytics.controller('AnalyticsController', function ($scope) {
  if (typeof analytics !== 'undefined') {
    analytics.trackView("Analytics Controller");
  }

  $scope.initEvent = function () {
    if (typeof analytics !== 'undefined') {
      analytics.trackEvent("Category", "Action", "Label", 25);
    }
  }
})


//================================================================================================
//
//	Dog listing view controller
//
//================================================================================================


        .controller('DogsCtrl', function ($scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, Utils, $ionicScrollDelegate, $sce, $ionicLoading) {

          $scope.postsApi = $rootScope.url + '/wp-json/posts/?type=dogs';
          // Avoid cached value    
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.showRefineBtn();
            $rootScope.keyword = 'Dogs';
            if ($rootScope.petKind !== 'dogs') {
              $rootScope.petKind = 'dogs';
              $rootScope.filter = {"location": "", "breeds": "", "size": "", "gender": ""};
              $rootScope.getFilterData($rootScope.filter);
            }
          });
          $scope.countFilter = "Loading...";

          $scope.loadPosts = function () {

            DataLoader.all($scope.postsApi + '&' + $rootScope.callback).success(function (data, status, headers, config) {
              $scope.posts = data;
              if (data.length)
                  $scope.countFilter = "Showing " + data.length + " of " + $rootScope.totalCount + " Dogs";
                else
                  $scope.countFilter = "Not find anything";
              $ionicLoading.hide();
              //console.dir( data );
            }).
                    error(function (data, status, headers, config) {
                      console.log('error');
                    });

          }

          // Load posts on page load
          $scope.loadPosts();

          paged = 2;
          $scope.moreItems = true;

          // Load more (infinite scroll)
          $scope.loadMore = function () {

            if (!$scope.moreItems) {
              return;
            }

            var pg = paged++;

            $timeout(function () {

              var apiurl = $rootScope.url + '/wp-json/posts/?type=dogs&';
              var url = $scope.postsApi + '&page=' + pg + '&' + $rootScope.callback;
              DataLoader.all(url).success(function (data, status, headers, config) {

                angular.forEach(data, function (value, key) {
                  $scope.posts.push(value);
                });

                if (data.length <= 0) {
                  $scope.moreItems = false;
                }
                if (data.length)
                  $scope.countFilter = "Showing " + data.length + " of " + $rootScope.totalCount + " Dogs";
                // Don't strip post html
                $scope.content = $sce.trustAsHtml(data.content);
                $scope.title = $sce.trustAsHtml(data.title);
              }).
                      error(function (data, status, headers, config) {
                        $scope.moreItems = false;
                        console.log('error');
                      });

              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.$broadcast('scroll.resize');

            }, 1000);

          }

          $scope.moreDataExists = function () {
            return $scope.moreItems;
          }

          // Pull to refresh
          $scope.doRefresh = function () {

            console.log('Refreshing!');
            $timeout(function () {

              $scope.loadPosts();

              //Stop the ion-refresher from spinning
              $scope.$broadcast('scroll.refreshComplete');

            }, 1000);

          };

          $rootScope.$on("dogsFilterLoad", function (event, args) {
            paged = 2;
            $scope.postsApi = $rootScope.filterUrl;
            $scope.posts = [];
            $scope.moreItems = true;
            $ionicLoading.show();
            $scope.loadPosts();
          });
          $rootScope.$on("dogsFilterDone", function (event, args) {
            $scope.loadPosts();
          });

        })


//================================================================================================
//
//	Single Dogs View controller
//
//================================================================================================


        .controller('SingleDogCtrl', function ($scope, $stateParams, Utils, DataLoader, $ionicLoading, $ionicSlideBoxDelegate, $rootScope, $sce, $compile, $ionicHistory) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });
          $scope.breed = [];
          $scope.genderdogs = [];
          $scope.sizedogs = [];
          $scope.location = [];
          $scope.headerClass = 'bar-hidden bar-positive';


          $scope.facebookShare = function () {
            window.plugins.socialsharing.shareViaFacebook('com.apple.social.twitter', 'Message via Facebook', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.twitterShare = function () {
            window.plugins.socialsharing.shareViaTwitter('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.whatsappShare = function () {
            window.plugins.socialsharing.shareViaWhatsApp('com.apple.social.twitter', 'Message via WhatsApp', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }

          $ionicLoading.show({
            noBackdrop: true
          });


          var singlePostApi = $rootScope.url + '/wp-json/posts/' + $stateParams.postId + '?' + $rootScope.callback;

          DataLoader.get(singlePostApi).success(function (data, status, headers, config) {
            $scope.post = data;
            $scope.dogSlides = data.slidesdogs.dogSlides;
            $ionicSlideBoxDelegate.update();


            // Don't strip post html
            $scope.content = $sce.trustAsHtml(data.content);
            $scope.title = $sce.trustAsHtml(data.title);
            $ionicLoading.hide();
          }).
                  error(function (data, status, headers, config) {
                    console.log('error');
                  });





        })

//================================================================================================
//
//	Cat Listing view controller
//
//================================================================================================


        .controller('CatsCtrl', function ($scope, $http, Utils, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $sce, $ionicLoading) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.showRefineBtn();
            $rootScope.keyword = 'Cats';
            if ($rootScope.petKind !== 'cats') {
              $rootScope.petKind = 'cats';
              $rootScope.filter = {"location_cat": [], "gender_cat": []};
              $rootScope.getFilterData($rootScope.filter);
            }

          });

          $scope.postsApi = $rootScope.url + '/wp-json/posts/?type=cats';

          $scope.loadPosts = function () {

            DataLoader.all($scope.postsApi + '&' + $rootScope.callback).success(function (data, status, headers, config) {
              $scope.posts = data;
              if (data.length)
                  $scope.countFilter = "Showing " + data.length + " of " + $rootScope.totalCount + " Cats";
                else
                  $scope.countFilter = "Not find anything";
              $ionicLoading.hide();
              //console.dir( data );
            }).
                    error(function (data, status, headers, config) {
                      console.log('error');
                    });

          }

          // Load posts on page load
          $scope.loadPosts();

          paged = 2;
          $scope.moreItems = true;

          // Load more (infinite scroll)
          $scope.loadMore = function () {

            if (!$scope.moreItems) {
              return;
            }

            var pg = paged++;

            $timeout(function () {

              var url = $scope.postsApi + '&page=' + pg + '&' + $rootScope.callback;

              DataLoader.all(url).success(function (data, status, headers, config) {

                angular.forEach(data, function (value, key) {
                  $scope.posts.push(value);
                });

                if (data.length <= 0) {
                  $scope.moreItems = false;
                }
                if (data.length)
                  $scope.countFilter = "Showing " + data.length + " of " + $rootScope.totalCount + " Cats";
                // Don't strip post html
                $scope.content = $sce.trustAsHtml(data.content);
                $scope.title = $sce.trustAsHtml(data.title);
                $ionicLoading.hide();

              }).
                      error(function (data, status, headers, config) {
                        $scope.moreItems = false;
                        console.log('error');
                      });

              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.$broadcast('scroll.resize');

            }, 1000);

          }

          $scope.moreDataExists = function () {
            return $scope.moreItems;
          }

          // Pull to refresh
          $scope.doRefresh = function () {

            console.log('Refreshing!');
            $timeout(function () {

              $scope.loadPosts();

              //Stop the ion-refresher from spinning
              $scope.$broadcast('scroll.refreshComplete');

            }, 1000);

          };
          $rootScope.$on("catsFilterLoad", function (event, args) {
            paged = 2;
            $scope.postsApi = $rootScope.filterUrl;
            Utils.showRefineBtn();
            $scope.posts = [];
            $scope.moreItems = true;
            $ionicLoading.show();
            $scope.loadPosts();
          });
        })

//================================================================================================
//
//	Single Cat View controller
//
//================================================================================================


        .controller('SingleCatCtrl', function ($scope, $stateParams, DataLoader, $ionicSlideBoxDelegate, $ionicLoading, $rootScope, $sce, Utils) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });
          $scope.gendercats = [];
          $scope.locationcats = [];

          $scope.facebookShare = function () {
            window.plugins.socialsharing.shareViaFacebook('com.apple.social.twitter', 'Message via Facebook', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.twitterShare = function () {
            window.plugins.socialsharing.shareViaTwitter('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.whatsappShare = function () {
            window.plugins.socialsharing.shareViaWhatsApp('com.apple.social.twitter', 'Message via WhatsApp', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }

          $ionicLoading.show({
            noBackdrop: true
          });

          var singlePostApi = $rootScope.url + '/wp-json/posts/' + $stateParams.postId + '?' + $rootScope.callback;

          DataLoader.get(singlePostApi).success(function (data, status, headers, config) {
            $scope.post = data;
            $scope.catSlides = data.slidescats.catSlides;
            $ionicSlideBoxDelegate.update();

            // Don't strip post html
            $scope.content = $sce.trustAsHtml(data.content);
            $scope.title = $sce.trustAsHtml(data.title);
            $ionicLoading.hide();
          }).
                  error(function (data, status, headers, config) {
                    console.log('error');
                  });


        })


//================================================================================================
//
//	Other Pet Listing view controller
//
//================================================================================================


        .controller('OthersCtrl', function ($scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $sce, $ionicLoading, Utils) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.showRefineBtn();
            $rootScope.keyword = 'Others';
            $scope.countFilter = "Loading...";
            if ($rootScope.petKind !== 'others') {
              $rootScope.petKind = 'others';
              $rootScope.filter = {"location_others": [], "other_type": []}
              $rootScope.getFilterData($rootScope.filter);
            }

          });


          $scope.postsApi = $rootScope.url + '/wp-json/posts/?type=others';

          $scope.loadPosts = function () {
            $scope.countFilter = "Loading...";
            DataLoader.all($scope.postsApi + '&' + $rootScope.callback).success(function (data, status, headers, config) {
              $scope.posts = data;
              if (data.length)
                  $scope.countFilter = "Showing " + data.length + " of " + $rootScope.totalCount + " Others";
                else
                  $scope.countFilter = "Not find anything";
              $ionicLoading.hide();
              //console.dir( data );
            }).
                    error(function (data, status, headers, config) {
                      console.log('error');
                    });

          }

          // Load posts on page load
          $scope.loadPosts();

          paged = 2;
          $scope.moreItems = true;

          // Load more (infinite scroll)
          $scope.loadMore = function () {

            if (!$scope.moreItems) {
              return;
            }

            var pg = paged++;

            $timeout(function () {

              var url = $scope.postsApi + '&page=' + pg + '&' + $rootScope.callback;
              $scope.countFilter = "Loading...";
              DataLoader.all(url).success(function (data, status, headers, config) {

                angular.forEach(data, function (value, key) {
                  $scope.posts.push(value);
                });

                if (data.length <= 0) {
                  $scope.moreItems = false;
                }
                if (data.length)
                  $scope.countFilter = "Showing " + data.length + " of " + $rootScope.totalCount + " Others";
                // Don't strip post html
                $scope.content = $sce.trustAsHtml(data.content);
                $scope.title = $sce.trustAsHtml(data.title);
                $ionicLoading.hide();

              }).
                      error(function (data, status, headers, config) {
                        $scope.moreItems = false;
                        console.log('error');
                      });

              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.$broadcast('scroll.resize');

            }, 1000);

          }

          $scope.moreDataExists = function () {
            return $scope.moreItems;
          }

          // Pull to refresh
          $scope.doRefresh = function () {

            console.log('Refreshing!');
            $timeout(function () {

              $scope.loadPosts();

              //Stop the ion-refresher from spinning
              $scope.$broadcast('scroll.refreshComplete');

            }, 1000);

          };
          $rootScope.$on("othersFilterLoad", function (event, args) {
            paged = 2;
            Utils.showRefineBtn();
            $scope.postsApi = $rootScope.filterUrl;
            $scope.posts = [];
            $scope.moreItems = true;
            $ionicLoading.show();
            $scope.loadPosts();
          });
        })


//================================================================================================
//
//	Single Others View controller
//
//================================================================================================


        .controller('SingleOthersCtrl', function ($scope, $stateParams, DataLoader, $ionicSlideBoxDelegate, $ionicLoading, $rootScope, $sce, Utils) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });
          $scope.genderothers = [];
          $scope.otherpetstype = [];

          $scope.facebookShare = function () {
            window.plugins.socialsharing.shareViaFacebook('com.apple.social.twitter', 'Message via Facebook', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.twitterShare = function () {
            window.plugins.socialsharing.shareViaTwitter('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.whatsappShare = function () {
            window.plugins.socialsharing.shareViaWhatsApp('com.apple.social.twitter', 'Message via WhatsApp', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }

          $ionicLoading.show({
            noBackdrop: true
          });

          var singlePostApi = $rootScope.url + '/wp-json/posts/' + $stateParams.postId + '?' + $rootScope.callback;

          DataLoader.get(singlePostApi).success(function (data, status, headers, config) {
            $scope.post = data;
            $scope.otherSlides = data.slidesothers.otherSlides;
            $ionicSlideBoxDelegate.update();

            // Don't strip post html
            $scope.content = $sce.trustAsHtml(data.content);
            $scope.title = $sce.trustAsHtml(data.title);
            $ionicLoading.hide();
          }).
                  error(function (data, status, headers, config) {
                    console.log('error');
                  });


        })



//================================================================================================
//
//	Latest News view controller
//
//================================================================================================


        .controller('PostsCtrl', function ($scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, Utils, $rootScope, $sce, $ionicLoading) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });
          var postsApi = $rootScope.url + '/wp-json/posts/?' + $rootScope.callback;

          $scope.loadPosts = function () {

            DataLoader.all(postsApi).success(function (data, status, headers, config) {
              $scope.posts = data;

              //console.dir( data );
            }).
                    error(function (data, status, headers, config) {
                      console.log('error');
                    });

          }

          // Load posts on page load
          $scope.loadPosts();

          paged = 2;
          $scope.moreItems = true;

          // Load more (infinite scroll)
          $scope.loadMore = function () {

            if (!$scope.moreItems) {
              return;
            }

            var pg = paged++;

            $timeout(function () {

              var apiurl = $rootScope.url + '/wp-json/posts/';

              DataLoader.all(apiurl + 'page=' + pg + '&' + $rootScope.callback).success(function (data, status, headers, config) {

                angular.forEach(data, function (value, key) {
                  $scope.posts.push(value);
                });

                if (data.length <= 0) {
                  $scope.moreItems = false;
                }
                // Don't strip post html
                $scope.content = $sce.trustAsHtml(data.content);
                $scope.title = $sce.trustAsHtml(data.title);
                $ionicLoading.hide();
              }).
                      error(function (data, status, headers, config) {
                        $scope.moreItems = false;
                        console.log('error');
                      });

              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.$broadcast('scroll.resize');

            }, 1000);

          }

          $scope.moreDataExists = function () {
            return $scope.moreItems;
          }

          // Pull to refresh
          $scope.doRefresh = function () {

            console.log('Refreshing!');
            $timeout(function () {

              $scope.loadPosts();

              //Stop the ion-refresher from spinning
              $scope.$broadcast('scroll.refreshComplete');

            }, 1000);

          };

        })

//================================================================================================
//
//	Single Post View controller
//
//================================================================================================


        .controller('PostCtrl', function ($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, Utils) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });
          $scope.myHTML = '<ion-slide> <div class="box" ng-click="openImageModal(\'http://www.adoptapet.ie/wp-content/uploads/2015/08/Tory-1.jpg\')"><img width="210" height="205" src="http://www.adoptapet.ie/wp-content/uploads/2015/08/Tory-1.jpg" class="attachment-pet_thumb" alt="Tory 1" /></div> </ion-slide><ion-slide> <div class="box" ng-click="openImageModal(\'http://www.adoptapet.ie/wp-content/uploads/2015/08/Troy-2.jpg\')"><img width="329" height="318" src="http://www.adoptapet.ie/wp-content/uploads/2015/08/Troy-2.jpg" class="attachment-pet_thumb" alt="Troy 2" /></div> </ion-slide><div class="reserved-inner"></div>'
          $scope.breed = [];
          $scope.genderDogs = [];
          $scope.sizeDogs = [];
          $scope.location = [];

          $scope.facebookShare = function () {
            window.plugins.socialsharing.shareViaFacebook('com.apple.social.twitter', 'Message via Facebook', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.twitterShare = function () {
            window.plugins.socialsharing.shareViaTwitter('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.whatsappShare = function () {
            window.plugins.socialsharing.shareViaWhatsApp('com.apple.social.twitter', 'Message via WhatsApp', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }

          $ionicLoading.show({
            noBackdrop: true
          });

          var singlePostApi = $rootScope.url + '/wp-json/posts/' + $stateParams.postId + '?' + $rootScope.callback;

          DataLoader.get(singlePostApi).success(function (data, status, headers, config) {
            $scope.post = data;

            // Don't strip post html
            $scope.content = $sce.trustAsHtml(data.content);
            $scope.title = $sce.trustAsHtml(data.title);
            $ionicLoading.hide();
          }).
                  error(function (data, status, headers, config) {
                    console.log('error');
                  });


        })



//================================================================================================
//
//	How To Adopt View controller
//
//================================================================================================


        .controller('HowToAdoptCtrl', function ($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, Utils) {

          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });

          $scope.facebookShare = function () {
            window.plugins.socialsharing.shareViaFacebook('com.apple.social.twitter', 'Message via Facebook', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.twitterShare = function () {
            window.plugins.socialsharing.shareViaTwitter('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.whatsappShare = function () {
            window.plugins.socialsharing.shareViaWhatsApp('com.apple.social.twitter', 'Message via WhatsApp', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }

          $ionicLoading.show({
            noBackdrop: true
          });

          var singlePostApi = $rootScope.url + '/wp-json/posts/8808?' + $rootScope.callback;

          DataLoader.get(singlePostApi).success(function (data, status, headers, config) {
            $scope.post = data;

            // Don't strip post html
            $scope.content = $sce.trustAsHtml(data.content);
            $ionicLoading.hide();
          }).
                  error(function (data, status, headers, config) {
                    console.log('error');
                  });


        })

//================================================================================================
//
//	About Us View controller
//
//================================================================================================


        .controller('AboutUsCtrl', function ($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, Utils) {

          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });

          $scope.facebookShare = function () {
            window.plugins.socialsharing.shareViaFacebook('com.apple.social.twitter', 'Message via Facebook', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.twitterShare = function () {
            window.plugins.socialsharing.shareViaTwitter('com.apple.social.twitter', 'Message via Twitter', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }
          $scope.whatsappShare = function () {
            window.plugins.socialsharing.shareViaWhatsApp('com.apple.social.twitter', 'Message via WhatsApp', null, null, 'http://www.adoptapet.ie', function () {
              console.log('share ok')
            }, function (msg) {
              alert('error: ' + msg)
            });
          }

          $ionicLoading.show({
            noBackdrop: true
          });

          var singlePostApi = $rootScope.url + '/wp-json/posts/7444?' + $rootScope.callback;

          DataLoader.get(singlePostApi).success(function (data, status, headers, config) {
            $scope.post = data;

            // Don't strip post html
            $scope.content = $sce.trustAsHtml(data.content);
            $ionicLoading.hide();
          }).
                  error(function (data, status, headers, config) {
                    console.log('error');
                  });


        })



//================================================================================================
//
//	Intro Controller
//
//================================================================================================

        .controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate, $ionicViewService, Utils) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });
          $ionicViewService.nextViewOptions({
            disableBack: true
          });

          // Called to navigate to the main app
          $scope.startApp = function () {
            $state.go('app.posts');
          };
          $scope.next = function () {
            $ionicSlideBoxDelegate.next();
          };
          $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
          };

          // Called each time the slide changes
          $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
          };

        })

        .controller('TabsCtrl', function ($scope, Utils) {
          $scope.$on('$ionicView.beforeEnter', function () {
            Utils.hideRefineBtn();
          });
          // Tabs stuff here

        });