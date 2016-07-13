function onNotificationAPN(data) {
  dbg('Notification was triggered APN');
  dbg(data);
  window.pushNotifications.onMessageReceived(data);
};

function onNotificationGSM(data) {
  dbg('Notification was triggered GSM');
  dbg(data);
  window.pushNotifications.onMessageReceived(data);
};

var notificationsService = null;

notificationsService = (function() {
  function notificationsService() {}

  notificationsService.eventHandlers = {};

  notificationsService.sendParseConnectionStatus = function(state){
    var self = this;
    var data = {
      state: state
    };
    Parse.Cloud.run('setUserConnectionStatus', data).then(
      function(result) {
        console.log(result);
      },
      function(error) {}
    );
  }

  notificationsService.initialize = function() {

    dbg('Initialize PUSH');
    try{
      // we use two plugins here. PushNotifications(IOS) && ParsePushNotificaions(Android)
      var pushNotification = window.plugins.pushNotification;

      var successHandler = function(result) {
        dbg('App registered for Android notifications'); dbg(result);
      }

      var tokenHandler = function(result) {
        dbg('App registered for IOS notifications'); dbg(result);
      }

      var errorHandler = function(error) {
        dbg('cant register for IOS notifications, error'); dbg(error);
      }

      if ( device.platform == 'iOS'){
        dbg('Register IOS IPN');

        pushNotification.register(
          tokenHandler,
          errorHandler,
          {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN"
          }
        );
      };

      if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
        dbg('Register Android');

        parsePlugin = window.ParsePushPlugin;
        parsePlugin.register({
          appId: window.applicationConfiguration['ParseAppID'],
          clientKey: window.applicationConfiguration['ParseClientKey']
        }, window.subscribeUserToChannels, null);
      }
    }
    catch(e) {
      dbg(e.message)
      window.stack = e.stack;
    }
  };

  notificationsService.registerEvent = function(name, scope, callback) {
    notificationsService.eventHandlers[name] = [scope, callback];
  };

  notificationsService.onMessageReceived = function(notificationData, ignoreDeviceState) {
    console.log('onPushMessageReceived', angular.element(document.body).injector().get('$state'));
    if (!ignoreDeviceState && window.appIsInForeground) {
      dbg('BREAK BECAUSE APP IN FOREGROUND', ignoreDeviceState, window.appIsInForeground);
      return;
    }

    if (!Parse.User.current()){
      dbg('BREAK BECAUSE NO CURRENT USER');
      return;
    }
    if (notificationData.data) {
      if (typeof notificationData.data == 'string')
        notificationData.data = JSON.parse(notificationData.data);

      if (Object.keys(notificationData.data).length) {
        Object.keys(notificationData.data).forEach(function(key) {
          if (notificationsService.eventHandlers[key]) {
            var scope   = notificationsService.eventHandlers[key][0];
            var handler = notificationsService.eventHandlers[key][1];

            handler.call(scope, notificationData, ignoreDeviceState);

            return true;
          }
        });
      }
      else {
        dbg('Cant find handler for push notification');
        dbg(notificationData);
      }
    }
    else {
      dbg('Notification data is empty');
    }
  };

  notificationsService.sendNotification = function(members, message, data, options) {
    if (options == undefined) {
      options = {};
    }

    var baseData = {
      users: members,
      message: message,
      data: JSON.stringify(data)
    };
    var requestJSON = angular.extend(baseData, options);

    Parse.Cloud.run('sendChatPushNotification', requestJSON).then(
      function(result) {
        console.log(result);
      },
      function(error) {}
    );
  };

  notificationsService.state = function() {
    return angular.element(document.body).injector().get('$state')
  }

  notificationsService.location = function() {
    return angular.element(document.body).injector().get('$location')
  }

  return notificationsService;
})();

window.pushNotifications = notificationsService;
