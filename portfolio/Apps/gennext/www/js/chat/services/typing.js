'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatTyping', function() {

  var r = {};

  r.currentConversationTyping = [];

  r.getCurrentConversationTyping = function() {
    return this.currentConversationTyping;
  };

  r.currentConversationTypingUsers = function(users) {
    var user = null;
    var usersObj = [];
    for (user in users) {
      usersObj.push(this.getUserById(users[user]));
    }

    return usersObj;
  };

  return r;
});