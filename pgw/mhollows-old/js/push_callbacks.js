function initializePushCallbacks() {
  // notifications event would fired when receive notification with correct key inside data
  // {"alert": "Test Message", "data": {"room": "some room id"}}
  window.pushNotifications.registerEvent('room', this, function(notificationData) {
    console.log('Clicked on push notification');
    console.log('#/messages/' + notificationData.data.room);
    window.pushNotifications.state().go('app.messages-room', {conversationId: notificationData.data.room});
  });


  window.pushNotifications.registerEvent('announcement', this, function(notificationData, ignoreDeviceState) {
    dbg('Announcement Notification Received')
    dbg(notificationData);
    var query = new Parse.Query(Parse.Object.extend('Announcement'));
    query.include('event');
    query.equalTo('objectId', notificationData.data.announcement);

    query.first().then(function(announcement) {
      dbg("Announcement FOUND", announcement);
      openAnnouncement(announcement, announcement.get('for'), window.pushNotifications.state(), ignoreDeviceState);
    }, function(error) { dbg(error) });
  });

  // notifications - when new post or comment is added
  // {"alert": "Test Message", "channels": [], "data": {"post": "some post id"}}
  window.pushNotifications.registerEvent('post', this, function(notificationData) {
    //$rootScope.gotoLastComment = 1;
    console.log(JSON.stringify(notificationData));
    window.pushNotifications.state().go('app.group-feed-detail', {postId: notificationData.data.post});
  });


}

initializePushCallbacks();
