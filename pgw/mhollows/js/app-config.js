window.appIsInForeground = false;

window.appSettings = {};

Date.prototype.getUTCTime = function () {
  var d = new Date();

  return new Date(d.toUTCString()).getTime() + d.getUTCMilliseconds();
}

function openAnnouncement(announcement, type, state) {
  dbg("OPEN ANNOUNCEMENT", announcement, type, state);

  if (type == 'event' || type == 'event_recap') {
    state.go('app.event-detail', {eventId: announcement.get('event').id});
  } else {
    announcement.relation('readBy').add(Parse.User.current());
    announcement.save();
    if (announcement.get('type') == 'url') {
      var url = correctExternalURL(announcement.get('url'));
      var ref = appStateManager.openUrl(url, '_blank', 'location=no,EnableViewPortScale=yes');
    } else {
        state.go('app.announcement', {id: announcement.id});
    }
  }
}

function getConfigFromXML(configPath) {
  var request = new XMLHttpRequest();

  try {
    request.open('GET', configPath, false); // `false` makes the request synchronous
    request.send(null);
  } catch (err) {
    return {};
  }

  if (request.status === 200 || request.status === 0) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(request.responseText, "application/xml");
    var preferences = doc.getElementsByTagName("preference");
    var rval = {};
    for (var i = 0; i < preferences.length; i++) {
      var pref = preferences[i];
      rval[pref.getAttribute("name")] = pref.getAttribute("value");
    }

    try {
      rval['appVersion'] = doc.getElementsByTagName('widget')[0].getAttribute('version');
    } catch (err) {
    }

    try {
      rval['bundleIdentifier'] = doc.getElementsByTagName('widget')[0].getAttribute('id');
    } catch (err) {
    }

    return rval;
  }
  return {};
}

window.identifyUser = function () {
  if (window.mixpanel) {
    var user = Parse.User.current();
    mixpanel.people.set({
      "$name": user.get('firstName') + ' ' + user.get('lastName'),
      "$email": user.get('email'),
      "First Name": user.get('firstName'),
      "Last Name": user.get('lastName'),
      "Phone Number": user.get('username'),
      "Admin": user.get('admin')
    });
    window.mixpanel.identify(user.id);
  }
};

window.subscribeUserToChannels = function () {
  if (typeof window.parsePlugin === 'undefined')
    return;
  if (!Parse.User.current())
    return;

  parsePlugin.getInstallationId(function (installationId) {
    var channels = ['Global', 'User_' + Parse.User.current().id];

    var callSetUserForInstallation = function () {
      Parse.Cloud.run('setUserForInstallation', {userId: Parse.User.current().id, installationId: installationId}, {
        success: function () {
        },
        error: function () {
          setTimeout(callSetUserForInstallation, 30000); //call after 30 secs if failed
        }
      });
    };
    callSetUserForInstallation();

    Parse.Cloud.run('groupsForUser', {id: Parse.User.current().id}, {
      success: function (response) {
        _.each(response, function (g) {
          if (g) {
            channels.push('Group_' + g.id);
          }
        });
        _.each(channels, function (channel) {
          parsePlugin.subscribe(
                  channel,
                  function () {
                  }, // subscribed!
                  function (e) {
                  }  // unable to subscribe...
          );
        });
      },
      error: function (error) {
      } // something bad happened
    });

    Parse.User.current().fetch().then(function (user) {
      user.addUnique('installations', installationId);
      user.save();
    });

  }, function () {
    // failed to get the installation ID, darn...
  });
}

window.fetchAppSettings = function() {
  Parse.Config.get().then(function(config){
    window.appSettings = config.attributes;
  });
}

window.initializeParsePlugin = function () {
  parsePlugin.initialize(
    window.applicationConfiguration['ParseAppID'],
    window.applicationConfiguration['ParseClientKey'],
    window.subscribeUserToChannels,
    null
  );
}

function initializeGoogleAnalytics() {
  var trackerId = window.applicationConfiguration['GoogleAnalyticsTrackerID'];
  if (navigator.analytics && trackerId) {
    navigator.analytics.setTrackingId(trackerId);
  }
}

window.applicationConfiguration = getConfigFromXML('xml/config.xml');
window.versionIsOutOfDate = null;

window.notifyVersionIsBelowMinimum = function () {
  window.versionIsOutOfDate = true;
  navigator.notification.alert(
          'There is a new version of this App and this version can no longer be used. Install the new version now and take advantage of the new features!',
          function () {
            Parse.Config.get().then(function (config) {
              var downloadURL = 'http://' + config.get('groupfireId') + '.admin.groupfire.com/download';
              var ref = appStateManager.openUrl(downloadURL, '_system', 'location=no');
            });
          },
          'New Version Available!',
          'Update Now'
          );
}

window.notifyVersionIsOutOfDate = function () {
  window.versionIsOutOfDate = true;
  navigator.notification.confirm(
          'There is a new version of this App. Would you like to install now and take advantage of the new features?',
          function (buttonIndex) {
            if (buttonIndex == 2) {
              Parse.Config.get().then(function (config) {
                var downloadURL = 'http://' + config.get('groupfireId') + '.admin.groupfire.com/download';
                var ref = appStateManager.openUrl(downloadURL, '_system', 'location=no');
              });
            }
          },
          'New Version Available!',
          ['Not Now!', 'Yes!']
          );
  var scope = angular.element($('#app-container')[0]).scope();
  scope.$apply(function () {
    scope.versionIsOutOfDate = window.versionIsOutOfDate;
  });
}

window.notifyVersionIsLatest = function () {
  window.versionIsOutOfDate = false;
  navigator.notification.alert(
          "You have the latest version.", // message
          null,
          "You are up to date!",
          'Great!'
          );
}

window.handleVersionCheckResponse = function (request) {
  var result = $.parseJSON(request.responseText);
  if (result.newer) {
    if (result.canProceed) {
      notifyVersionIsOutOfDate();
    } else {
      notifyVersionIsBelowMinimum();
    }
  }
  else {
    window.versionIsOutOfDate = false;
  }
}

window.handleVersionCheckResponseWithConfirm = function (request) {
  var result = $.parseJSON(request.responseText);
  if (result.newer) {
    notifyVersionIsOutOfDate();
  } else {
    notifyVersionIsLatest();
  }
}

window.checkLatestVersion = function (needsConfirm) {
  if (!window.device)
    return;

  Parse.Config.get().then(function (config) {
    var platform = window.device.platform.toLowerCase();
    var currentVersion = window.applicationConfiguration.appVersion;

    if (!(platform == 'ios' || platform == 'android'))
      return; // cant version check for android yet

    var url = "http://accounts.groupfire.com/api/v1/apps/";
    url = url + window.applicationConfiguration.bundleIdentifier + '/check-version/' + platform;
    url = url + "?current_version=" + currentVersion;

    if (needsConfirm) {
      // do things synchronously
      var request = new XMLHttpRequest();
      request.open('GET', url, false); // `false` makes the request synchronous
      request.send(null);
      window.handleVersionCheckResponseWithConfirm(request);
    } else {
      if (window.versionIsOutOfDate != null)
        return;
      $.ajax(url).complete(window.handleVersionCheckResponse);
    }
  });
};

function initializeImgCache() {
  //init imgcache
  ImgCache.options.debug = false;
  ImgCache.options.chromeQuota = 100 * 1024 * 1024;
  ImgCache.init(function () {
    //console.log('ImgCache init: success!');
  }, function () {
    //console.log('ImgCache init: error! Check the log for errors');
  });
}

function initializeCordovaApplication() {
  // because we can't prevent alert from push when app in foreground -
  // we should at least do not redirect user to push target
  setTimeout(function () {
    window.appIsInForeground = true;
  }, 2000);

  initializeImgCache();
  initializeParsePlugin();
  initializeGoogleAnalytics();
  if (Parse.User.current())
    window.checkLatestVersion(false);
  if (window.mixpanel) {
    mixpanel.register({"Platform": window.device.platform});
  }

  window.pushNotifications.initialize();
  catchPushNotification(); // should be here on device ready

  if (cordova.InAppBrowser) {
    window.open = cordova.InAppBrowser.open;
  }
}

function catchPushNotification() {
  if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
    webintent = window.plugins.webintent;
    webintent.hasExtra("com.parse.Data",
            function (has) {
              if (has) {
                console.log('Push Notification catched');
                webintent.getExtra("com.parse.Data",
                        function (d) {
                          var metadata = JSON.parse(d);
                          console.log('aaaaaaaa', metadata);
                          window.pushNotifications.onMessageReceived(metadata);
                          // console.log(metadata);
                          // console.log('#/messages/' + metadata.roomId);
                          // $state.go('app.messages-room', {conversationId: metadata.roomId});
                        }, function () {
                  // There was no extra supplied.
                }
                );
              }
            }, function () {
      alert('fail');
    }
    );
  } else {
    pushNotification = window.plugins.pushNotification;
  }
}

// initialize parse
Parse.initialize(window.applicationConfiguration['ParseAppID'], window.applicationConfiguration['ParseJsKey']);

// initialize mixpanel (if available)
if (window.applicationConfiguration['MixpanelToken']) {
  window.mixpanel.init(window.applicationConfiguration['MixpanelToken']);
  window.mixpanel.register({"Platform": "web"});
  if (Parse.User.current())
    window.identifyUser();
  window.mixpanel.track("App Launch");
} else {
  window.mixpanel = false;
}

document.addEventListener('deviceready', initializeCordovaApplication, false);

appStateManager.onResume(function () {
  if (window.mixpanel) {
    window.mixpanel.track("App Resume");
  }

  var currentUser = Parse.User.current();
  if (currentUser) {
    window.identifyUser();
    //reload feeds
    if ($('.page-feed').length > 0) {
      angular.element($('.page-feed')[0]).scope().loadData(false);
    }
    //reload content pages
    if ($('ion-nav-view[name=menuContent]').length > 0) {
      var AppCtrl = angular.element($('ion-nav-view[name=menuContent]')[0]).scope();
      AppCtrl.$apply(function(){
        AppCtrl.refreshMenuData();
        AppCtrl.checkUserActive();
      });
    }
  }
});


//Open chat links in system browser
$(document).on('click', 'a.outgoing-link', function (e) {
  e.preventDefault();
  appStateManager.openUrl($(e.target).attr('href'));
});

window.fetchAppSettings();
