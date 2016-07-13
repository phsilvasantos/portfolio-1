'use strict';

angular.module('coride')
  .controller('UserTabCtrl', function ($rootScope, $scope, $location, Review, User){
    $rootScope.barClass = "bar-clear"

    $scope.user = JSON.parse(localStorage.getItem("current_user"))

    User.get({ id: localStorage.getItem("coride_auth_token") }, function(data) {
      localStorage.setItem('current_user', JSON.stringify(data));
      $scope.user = data
    });

    $scope.user_tab = true;

    $scope.getReviews = function() {
      window.plugins.socialsharing.share('Help improve my profile on Coride.co by writing me a reference. Thanks!', null, null, 'https://www.coride.co/reviews/new?reviewee_id=' + $scope.user.id)
    }
    $scope.settings = function() {
      $location.url("/settings")
    }
    $scope.newCar = function() {
      $location.url("/cars/new");
    }
    $scope.editProfile = function() {
      $location.url("/users/edit");
    }
    $scope.openFacebook = function() {
      window.open("https://m.facebook.com/" + $scope.user.facebook_uid, '_blank', 'location=yes', 'closebuttoncaption=back');
    }
  })

  .controller('UserSettingsCtrl', function ($rootScope, $scope, $location, User) {
    $rootScope.barClass = "bar-positive"
    
    $scope.back = function() {
      window.history.back();
    };
    
    $scope.user = JSON.parse(localStorage.getItem("current_user"))

    $scope.updateUser = function(){
      $rootScope.showLoading();
      User.update({}, $scope.user, function(data) {
        $rootScope.hideLoading();
        localStorage.setItem('current_user', JSON.stringify(data));
        $location.url('/tab/user-tab');
        var message = 'Account settings successfully updated.'
        console.log(message);
        navigator.notification.alert(message, null, 'Alert', 'OK');
      }, function(data) {
        $rootScope.hideLoading();
        var message = "There was a problem updating your account settings. Please try again."
        console.log(message);
        navigator.notification.alert(message, null, 'Alert', 'OK');
      });
    };
  })

  .controller('SettingsCtrl', function ($rootScope, $scope, $location) {
    $rootScope.barClass = "bar-positive"
    
    $scope.back = function() {
      window.history.back();
    };

    $scope.logout = function() {
      window.localStorage.clear();
      window.localStorage['didTutorial'] = true;
      $rootScope.$broadcast('app.loggedOut'); 
      $location.url("/")
    }
    
    $scope.current_user = JSON.parse(localStorage.getItem("current_user"))

    $scope.inviteFriends = function() {
      window.plugins.socialsharing.share('Share corides on Coride.co with me!', null, null, 'http://www.coride.co')
    }

    $scope.getReviews = function() {
      window.plugins.socialsharing.share('Help improve my profile on Coride.co by writing me a reference. Thanks!', null, null, 'https://www.coride.co/reviews/new?reviewee_id=' + $scope.current_user.id)
    }
  })
  
  .controller('UserEditCtrl', function ($rootScope, $scope, $state, $location, $http, User) {
    $rootScope.barClass = "bar-positive"
    $rootScope.hideLoading();
    
    $scope.user = JSON.parse(localStorage.getItem("current_user"))

    User.get({ id: localStorage.getItem("coride_auth_token") }, function(data) {
      localStorage.setItem('current_user', JSON.stringify(data));
      $scope.user = data
    });
    
    $scope.back = function() {
      $state.go('tab.user');
    };

    $scope.reviewApp = function() {
      if (device_ios) {
        //window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8'); // or itms://
        window.open('https://www.coride.co/ios');
      } else if (device_android) {
        //window.open('market://details?id=<package_name>');
        window.open('https://www.coride.co/android');
      }
    };

    $scope.updateUser = function(){
      $rootScope.showLoading();
      User.update({}, $scope.user, function(data) {
        $rootScope.hideLoading();
        localStorage.setItem('current_user', JSON.stringify(data));
        if (localStorage.getItem("new_user") == "true") {
          localStorage.removeItem("new_user");
          $location.url("/cars/new");
        } else {
          $location.url('/tab/user-tab');
        }
        var message = 'User successfully updated.'
        console.log(message);
        navigator.notification.alert(message, null, 'Alert', 'OK');
      }, function(data) {
        $rootScope.hideLoading();
        var message = "There was a problem updating your profile. Please try again."
        console.log(message);
        navigator.notification.alert(message, null, 'Alert', 'OK');
      });
    };
  })

  .controller('UserDetailsCtrl', function ($rootScope, $scope, $stateParams, User) {
    $rootScope.barClass = "bar-clear"

    $scope.user = User.get({ id: $stateParams.userId });
    $scope.current_user = JSON.parse(localStorage.getItem("current_user"))

    $scope.user_tab = false;
    
    $scope.back = function() {
      window.history.back();
    }
  });
