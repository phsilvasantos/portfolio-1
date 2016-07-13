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

  r.updateTopic = function(newTopic) {
    this.getConversationById(this.currentConversationId).conversationTopic = newTopic;
    xmppGroupChat.setTopic(this.currentConversationId, newTopic);
    this.fetchConversationById(this.currentConversationId, function(conversation) {
      conversation.set('conversationTopic', newTopic);
      conversation.save();
    });
  };

  r.leaveRoom = function(conversationId, callback) {
    console.log('ROOM LEAVING');
    var self = this;

    if (!conversationId)
      conversationId = this.currentConversationId;

    xmppGroupChat.leave(conversationId);

    this.fetchConversationById(conversationId, function(conversation) {
      console.log('FETCH CONVERSATION AND REMOVE FROM IT CURRENT PARTICIPANT');
      self.removeUserFromConversaionParticipants(conversation, self.currentUser.jid);
      self.deleteConversationFromList(conversationId);

      var messages = self.conversationMessages(conversationId);

      for (var i in messages) {
        var message = messages[i];
        xmppConnection.unregisterMessage(message.uniqueId);

        var index = self.messages.indexOf(message);
        self.messages.splice(index, 1);
      }

      callback();
    });
  };

  r.removeUserFromConversaionParticipants = function(conversation, userId) {
    if (conversation) {
      var index = conversation.get('participants').indexOf(userId);
      if (index > -1) {
        conversation.get('participants').splice(index, 1);
      };

      var index = conversation.get('joinedParticipants').indexOf(userId);
      if (index > -1) {
        conversation.get('joinedParticipants').splice(index, 1);
      };

      conversation.save();
    }

    return conversation;
  };

  return r;
});
