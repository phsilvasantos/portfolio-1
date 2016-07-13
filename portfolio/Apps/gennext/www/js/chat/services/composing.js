'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatComposing', function() {

  var r = {};

  r.composingStart = function() {
    var conversation = this.getConversationById(this.currentConversationId);
    if (!conversation.room) {
      xmppGroupChat.sendTypingStatus(this.currentConversationId, conversation.participants, 'start');
    }
  };

  r.composingStop = function() {
    var conversation = this.getConversationById(this.currentConversationId);
    if (!conversation.room) {
      xmppGroupChat.sendTypingStatus(this.currentConversationId, conversation.participants, 'stop');
    }
  };

  return r;
});