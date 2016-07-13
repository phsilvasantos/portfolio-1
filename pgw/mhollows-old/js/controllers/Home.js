'use strict';

angular.module('gnApp.controllers')
  .controller('HomeController', function ($scope, Utils, $ionicSideMenuDelegate, $location, $rootScope) {
    $ionicSideMenuDelegate.canDragContent(false);
    
    if (!Parse.User.current()) {
      Utils.showIndicator();
	  Parse.User.logIn('1233333333', '1234', {
		success: function (user) {
		  Utils.hideIndicator();

		  if (user.get('status') !== 'active') {
			Parse.User.logOut();
			$location.path('/login');
			var notificationText = 'This account has been suspended and cannot log in.';
			if (user.get('status') === 'pending') {
			  notificationText = 'This account has not been approved yet and cannot log in.';
			}
			notificationText += 'Contact your organization\'s administrator for more information.';
			if (window.device) {
			  navigator.notification.alert(
					  notificationText, // message
					  null,
					  user.get('status') === 'pending' ? 'Account in Pending' : 'Account Suspended',
					  'OK'
					  );
			} else {
			  Utils.alert(notificationText);
			}
			return;
		  }

		  window.identifyUser();
		  if (window.mixpanel) {
			window.mixpanel.track("Log In");
		  }

		  window.subscribeUserToChannels();
		  window.checkLatestVersion(false);

		  $location.path('/feed');
		  $rootScope.$broadcast('userLoggedIn');
		},
		error: function (user, error) {
		  Utils.hideIndicator();
		  Utils.alert("Invalid username or password. Please try again.");
		}
	  });
	  
	  
	  
      return;
    } else {
      window.identifyUser();
      window.subscribeUserToChannels();
    }
    
    //redirect to home page
    var query = new Parse.Query(Parse.Object.extend('MenuSetting'));
    query.equalTo('home', true);
    Utils.showIndicator();
    query.find().then(function (results) {
      var homePath = '/feed';
      if(results.length > 0){
        homePath = results[0].get('url');
      }
      $scope.$apply(function(){
        $location.path(homePath);
      });
      Utils.hideIndicator();
    });
    return;

    /*$scope.data = {};
    $scope.isTestflight = window.testFlight;
    $scope.feedbackModal = null;
    $scope.data.feedbackContent = '';

    $ionicModal.fromTemplateUrl('feedback-modal-html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.feedbackModal = modal;
    });

    $scope.openFeedbackForm = function () {
      $scope.feedbackModal.show();
      $scope.data.feedbackContent = '';
      $('.modal-feedback textarea').height($('.modal-feedback').height() - 10)
        .css('padding-top', ($('.modal-feedback .bar-header').outerHeight() + 5) + 'px');
    };

    $scope.doneLeaveFeedback = function () {
      window.testFlight.submitFeedback(function () {
        $scope.feedbackModal.hide();
      }, function () {
        Utils.alert('Unable to submit feedback, try again later.');
        $scope.feedbackModal.hide();
      }, $scope.data.feedbackContent);
    };

    $scope.$on('$destroy', function () {
      $scope.feedbackModal.remove();
    });*/
  });