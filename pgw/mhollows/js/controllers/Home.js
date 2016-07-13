'use strict';

angular.module('gnApp.controllers')
  .controller('HomeController', function ($scope, Utils, $ionicSideMenuDelegate, $location) {
    $ionicSideMenuDelegate.canDragContent(false);
    
    if (!Parse.User.current()) {
      //$location.path('/login');
	  localStorage['Parse/6ZRhWKAW7wMBdahiX2UvPBMfnXBcJAh76aB8srTi/currentConfig'] = '{"params":{"aboutThisAppURL":"https://s3.amazonaws.com/www.robotsandrockets.co/GenNext/about.html","active":true,"address":"465 Forest Avenue, Laguna Beach, CA, 94103","adminURL":"http://murmuring-hollows.dev.groupfire.com/","administratorEmail":"dev@robotsandrockets.co","amazonBucket":"development-mobilize","amplitudeApiKey":"9f7c6941597e0414ad72684dd4a87ec9","appAndroid":"http://accounts.groupfire.com/api/v1/apps/com.mobilize.MurmuringHollows/apk","appIOS":"http://accounts.groupfire.com/robots-rockets/apps/com.mobilize.MurmuringHollows/plist?redir=1","chatServer":"http://192.241.215.70:7070/","defaultGroupImage":{"__type":"File","name":"tfss-48623824-017f-41e3-8137-4f3e27f8f219-default_group.png","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-48623824-017f-41e3-8137-4f3e27f8f219-default_group.png"},"defaultProfileImage":{"__type":"File","name":"tfss-fec1bcd0-cc07-49c6-9fe4-1011bae17bbe-default_profile.png","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-fec1bcd0-cc07-49c6-9fe4-1011bae17bbe-default_profile.png"},"downloadAndroidAppIcon":{"__type":"File","name":"tfss-af2c9920-bfdb-42f7-b1a2-59f7bea4ef24-download_android_app.png","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-af2c9920-bfdb-42f7-b1a2-59f7bea4ef24-download_android_app.png"},"downloadiOSAppIcon":{"__type":"File","name":"tfss-3d0a000e-5a0a-49f1-a540-cfce6e12388f-download_ios_app.png","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-3d0a000e-5a0a-49f1-a540-cfce6e12388f-download_ios_app.png"},"dropboxAppKey":"qj9vdqml5rtcpto","dropboxWhitelist":"png,jpg,jpeg,pdf,gif,doc,docx,odt,xls,xlsx,txt,rtf,csv,zip,rar","dummyFile":{"__type":"File","name":"tfss-8b5e7259-f3fb-42e7-aab9-c21224b3288e-dummy.html","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-8b5e7259-f3fb-42e7-aab9-c21224b3288e-dummy.html"},"dummyImage":{"__type":"File","name":"tfss-340c4286-7df5-42ad-a70c-96b2c24b8c77-clip_white.svg","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-340c4286-7df5-42ad-a70c-96b2c24b8c77-clip_white.svg"},"emailNotificationSendgridTemplateId":"5d3b13e0-bb18-4bf3-aa1b-78f9b53d59da","googleClientId":"1025633342888-uh9e72b3toj7hk58suefmf1fdcdhj245.apps.googleusercontent.com","googleClientSecret":"puhX_mULYLfjuCYteCoRsWPF","googleDriveWhitelist":"png,jpg,jpeg,pdf,gif,doc,docx,odt,xls,xlsx,txt,rtf,csv,zip,rar","groupfireId":"murmuring-hollows","logoEmail":{"__type":"File","name":"tfss-f9ef8474-a321-4311-a633-a76fc0f09b71-u2.png","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-f9ef8474-a321-4311-a633-a76fc0f09b71-u2.png"},"logoLarge":{"__type":"File","name":"tfss-4c0688c2-bc34-4dca-8198-1c7220f47ecf-mh_grey.svg","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-4c0688c2-bc34-4dca-8198-1c7220f47ecf-mh_grey.svg"},"logoSmall":{"__type":"File","name":"tfss-60352aab-3316-4be3-bb78-836678c2d5cc-mh_v2.svg","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-60352aab-3316-4be3-bb78-836678c2d5cc-mh_v2.svg"},"noReplyEmail":"noreply@murmuring-hollows.groupfire.com","organizationDomain":"murmuring-hollows.groupfire.com","organizationName":"Murmuring Hollows","s3Bucket":"development-mobilize","s3UserFilesPath":"uploads/murmuring-hollows/userfiles/","sendgridPassword":"jov09rmb","sendgridTemplates":{"mailerLayout":"a2e318b3-9095-4cca-9bc2-efd22105ff74","newAnnouncement":"bfb4c24a-c75c-42ec-ba07-ed448194aff7","test":"b791256e-9318-4586-9e31-b8e64b876031"},"sendgridUsername":"app30464373@heroku.com","signupEnabled":"true","supportEmail":"support.22582.46a14c4b3e324a43@helpscout.net","welcomeEmailSendgridTemplateId":"047b44c3-85f9-459f-af57-4c4d966101c1","welcomeVideoSnapshot":{"__type":"File","name":"tfss-7deb05ec-c90a-43af-ba1c-1fc1244865bd-welcome_video_snapshot.jpg","url":"http://files.parsetfss.com/e76f4a09-dd2b-4cd8-939a-7400db21a2c9/tfss-7deb05ec-c90a-43af-ba1c-1fc1244865bd-welcome_video_snapshot.jpg"},"welcomeVideoURL":"http://www.youtube.com/embed/ZY1fQqA4gKM"}}';
	  localStorage['Parse/6ZRhWKAW7wMBdahiX2UvPBMfnXBcJAh76aB8srTi/currentUser'] = '{"active":true,"chatPassword":"ed2b7061e38741279f97b1fad3d9016b","email":"testguy@radziejewski.pl","engagement":48,"engagementStats":{"commentCount":17,"likeCount":4,"postCount":27},"firstName":"Test","installations":["3f202e55-99ce-49e2-9002-5fa51f151997"],"joinDate":"2014-11-12","lastInAppAt":{"__type":"Date","iso":"2015-09-13T07:21:28.302Z"},"lastName":"Guy","latestAppVersion":"0.0.0","notificationSettings":{"__type":"Pointer","className":"NotificationsSettings","objectId":"5UsQkoH6DI"},"online":true,"pendingChatMessages":{},"profile":{"__type":"Pointer","className":"Profile","objectId":"TQ6agnBZKc"},"status":"active","supportChat":true,"username":"1233333333","objectId":"AS7QCRfcgJ","createdAt":"2014-11-12T19:41:26.313Z","updatedAt":"2015-09-13T07:21:28.339Z","_id":"AS7QCRfcgJ","_sessionToken":"UOTHTudMs4x3ZtcEynP1SDGZN"}';
	  localStorage['Parse/6ZRhWKAW7wMBdahiX2UvPBMfnXBcJAh76aB8srTi/installationId'] = 'f8826e90-263e-810f-98f7-67a3441fdbd5';
	  window.location.reload();
      return;
    } else {
      window.identifyUser();
      window.subscribeUserToChannels();
    }
    
    if($scope.shared.user.isPending){
      $location.url('/profile/' + $scope.shared.user.get('profile').id + '?from=menu');
      return;
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