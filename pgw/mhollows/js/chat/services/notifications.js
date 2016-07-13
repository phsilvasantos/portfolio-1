'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatNotifications', function($state, deviceState, appNotificationsCounter) {
  var r = {};

  r.showToastyNotification = function(messageObj, conversation) {
    var message = messageObj.authorFullName + ': ' + this.formNotificationMessageBody(messageObj);

    window.plugins.toast.showShortTop(message);
  };

  r.shouldShowToastyNotification = function(messageObj) {
    if (messageObj.authorId == this.currentUser.jid) {
      return false
    };

    var conversation = this.getConversationById(messageObj.conversationId);

    var not_muted = !this.isMuteActual(conversation);
    var app_in_background = deviceState.isInBackground();
    var in_messages = $state.current.name == 'app.messages';
    var current_conversation = messageObj.conversationId == $state.params.conversationId;

    return not_muted && (in_messages || (!current_conversation && !in_messages)) && !app_in_background;
  };

  r.formNotificationMessageBody = function(messageObj) {
    var message = null;
    if(messageObj.attachedImage){
      message = 'Sent new photo';
    }
    else{
      message = this.stubLinksInMessage(messageObj.rawMessage ? messageObj.rawMessage : messageObj.body);
    }
    return message;
  };

  r.buildNotificationText = function(messageObj, conversation) {
    var message = '';
    var topic = '';

    if (conversation.room) {
      message = messageObj.authorFullName + ': ' + this.formNotificationMessageBody(messageObj);
      topic   = conversation.conversationTopic;
    } else {
      message = this.formNotificationMessageBody(messageObj);
      topic   = messageObj.authorFullName;
    }

    return {message: message, topic: topic};
  }

  r.sendPushNotification = function(senderName, messageObj) {
    var onlineParticipants;
    var members = [];
    var channels = [];
    var message = '';

    var conversation = this.getConversationById(messageObj.conversationId);
    var participants = conversation.participants;

    for (var participant in participants) {
      members.push(this.getUserById(participants[participant]).id);
    }

    if (conversation.room) {
      message = senderName + ' to ' + this.currentConversationTopic + ': ' + this.formNotificationMessageBody(messageObj);
    } else {
      message = senderName + ': ' + this.formNotificationMessageBody(messageObj);
    }

    console.log('0000', this.currentUser.id);

    window.pushNotifications.sendNotification(members, message, {room: this.currentConversationId, senderId: this.currentUser.id, mentions: messageObj.mentions});
  };

  return r;
});