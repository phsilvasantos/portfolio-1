'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatSettings', function() {
  var r = {};

  r.getRoomState = function() {
    if (this.getConversationById(this.currentConversationId)) {
      return this.getConversationById(this.currentConversationId).room;
    } else {
      return false;
    }
  };

  r.getTopicString = function() {
    if (this.getConversationById(r.currentConversationId)) {
      return this.getConversationById(this.currentConversationId).conversationTopic;
    } else {
      return '';
    }
  };

  r.getTopic = function(receiverId, conversation) {
    return this.buildDefaultTopicName(conversation);
  };

  r.updateTopic = function(newTopic) {
    this.getConversationById(this.currentConversationId).conversationTopic = newTopic;
    xmppGroupChat.setTopic(this.currentConversationId, newTopic);
    this.fetchConversationById(this.currentConversationId, function(conversation) {
      conversation.set('conversationTopic', newTopic);
      conversation.save();
    });
  };

  r.leaveRoom = function(callback) {
    console.log('ROOM LEAVING');
    var self = this;
    var conversationId = this.currentConversationId;

    xmppGroupChat.leave(conversationId);

    this.fetchConversationById(conversationId, function(conversation) {
      console.log('FETCH CONVERSATION AND REMOVE FROM IT CURRENT PARTICIPANT');
      var conversationObj = self.removeUserFromConversaionParticipants(conversationId, self.currentUser.jid);
      conversation.set('participants', conversationObj.participants);
      conversation.save();

      for (var i = 0; i < self.conversations.length; ++i) {
        if (self.conversations[i].id == conversationId) {
          self.conversations.splice(i, 1);
          break;
        }
      }

      callback();
    });
  };

  return r;
});