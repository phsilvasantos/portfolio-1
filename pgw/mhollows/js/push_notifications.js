function onPushReceived(data) {
  dbg('Notification was received');
  dbg(data);
  if (!data.alert)
    window.pushNotifications.onSilentMessageReceived(data);
};

function onPushOpen(data) {
  dbg('Notification was opened by user');
  dbg(data);
  window.pushNotifications.onMessageReceived(data);
};

// functions above are hardcoded inside plugins code, so you not need to use these names in register functions

var notificationsService = null;

notificationsService = (function() {
  function notificationsService() {}

  notificationsService.eventHandlers = {};
  notificationsService.silentEventHandlers = {};

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

  notificationsService.registerSilentEvent = function(name, scope, filter, callback) {
    if (!notificationsService.silentEventHandlers[name])
    notificationsService.silentEventHandlers[name] = [];

    notificationsService.silentEventHandlers[name].push({scope: scope, filter: filter, callback: callback});
  };

  notificationsService.onMessageReceived = function(notificationData) {
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

            handler.call(scope, notificationData);

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

  notificationsService.onSilentMessageReceived = function(notificationData) {
    if (!Parse.User.current()){
      dbg('BREAK BECAUSE NO CURRENT USER');
      return;
    }

    if (notificationData.silent) {
      if (typeof notificationData.silent == 'string') {
        notificationData.silent = JSON.parse(notificationData.silent);
      }

      if (notificationData.event && notificationsService.silentEventHandlers[notificationData.event] && notificationsService.silentEventHandlers[notificationData.event].length) {
        notificationsService.silentEventHandlers[notificationData.event].forEach(function(handler) {
          var scope    = handler.scope;
          var filter   = handler.filter;
          var callback = handler.callback;

          if (filter && !filter.call(scope, notificationData)) {
            return false;
          }

          callback.call(scope, notificationData);

          return true;
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

  notificationsService.sendSilentNotification = function(event, members, data, options) {
    if (options == undefined) {
      options = {};
    }

    var baseData = {
      event: event,
      members: members,
      data: data
    };
    var requestJSON = angular.extend(baseData, options);

    console.log('SILENT NOTIFICATION', members, data);

    return Parse.Cloud.run('sendSilentNotification', requestJSON).then(
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
