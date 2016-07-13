'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatMessages', function($ionicScrollDelegate, $state, $timeout, appNotificationsCounter, deviceState) {
  var r = {};

  r.messages = [];
  r.notReadMessages = 0;
  r.isHistoryLoaded = false;
  r.historyTimeout = null;

  r.renderTimeoutMessages = null;

  r.getNotReadMessages = function() {
    return this.notReadMessages;
  };

  r.resetNotReadMessages = function() {
    this.resetNotReadMessagesForConversation(this.currentConversationId);
  };

  r.resetNotReadMessagesForConversation = function(conversationId) {
    var conversation = this.getConversationById(conversationId);

    if (conversation) {
      appNotificationsCounter.decreaseCounter(conversation.notReadMessages);
      this.notReadMessages -= conversation.notReadMessages;
      conversation.notReadMessages = 0;
    }
  }

  r.incrementNotReadMessages = function(conversation) {
    this.notReadMessages++;
    conversation.notReadMessages++;

    appNotificationsCounter.increaseCounter(1);
  };

  r.getMessages = function() {
    return this.messages;
  };

  r.conversationMessages = function(conversationId) {
    return $.grep(this.messages, function(message) {
      return message.conversationId == conversationId;
    });
  };

  r.currentConversationMessages = function() {
    return this.conversationMessages(this.currentConversationId);
  };

  r.markMessagesAsReadedForConversation = function(conversationId) {
    this.conversationMessages(conversationId).forEach(function(message) {
      if (!message.readed) {
        message.readed = true;
      }
    });
  };

  r.sendReceiptMessage = function(first_unread_message_timestamp) {
    var conversation = this.currentConversation();
    if (!(deviceState.isInBackground() || conversation.room)) {
      if (first_unread_message_timestamp == undefined) {
        var unreaded_messages_timestamps = [];
        this.currentConversationMessages().forEach(function(message) {
          if (!message.readed) {
            unreaded_messages_timestamps.push(message.uniqueId);
          }
        });
        first_unread_message_timestamp = Math.min.apply(null, unreaded_messages_timestamps);
      };

      xmppGroupChat.sendReceiptMessage(this.currentConversationId, conversation.participants, first_unread_message_timestamp);
    };
  };

  r.addMessageToConversations = function(messageObj) {
    var conversation = this.getConversationById(messageObj.conversationId);

    conversation.lastMessageDate = this.messageDate(messageObj);
    conversation.lastMessageText = this.getLastMessage(messageObj, conversation);
    if (conversation.room) {
      conversation.avatarUrl = messageObj.authorAvatarUrl;
      conversation.authorId = messageObj.authorId;
    }

    if (this.shouldSendMessageReceipt(conversation, messageObj)) {
      this.sendReceiptMessage(messageObj.uniqueId);
    }

    this.addMessage(messageObj);
  };

  r.shouldSendMessageReceipt = function(conversation, messageObj) {
    var private_room_and_not_author = !conversation.room && messageObj.authorId != this.currentUser.jid;
    var recipient_is_online_in_current_conversation = this.isUserInRoom(messageObj.conversationId);

    return private_room_and_not_author && recipient_is_online_in_current_conversation;
  }

  r.messageDate = function(messageObj) {
    var result = null;
    if (!messageObj.archived) {
      result = new Date().toString();

    } else {
      var d = new Date();
      //timestamp = timestamp - d.getTimezoneOffset() * 60 * 1000;
      result = new Date(messageObj.timestamp).toString();
    }

    return result;
  };

  r.lastMessageAuthorChange = function(messageObj) {
    var filteredMessages = this.conversationMessages(messageObj.conversationId).sort(sortConversationMessagesCompare);
    return filteredMessages.length > 0 && filteredMessages[filteredMessages.length - 1].authorId != messageObj.authorId
  }

  r.addMessage = function(messageObj) {
    var existing_messages = $.grep(this.messages, function(item) {
      return messageObj.uniqueId && item.uniqueId == messageObj.uniqueId;
    });

    var self = this;

    if (existing_messages.length == 0) {
      messageObj.senderName = messageObj.authorFullName;
      messageObj.rawMessage = messageObj.body;
      /*if (this.conversationMessages(messageObj.conversationId).length > 0 && (messageObj.authorId == this.currentUser.jid || !this.lastMessageAuthorChange(messageObj))) {
        messageObj.authorFullName = null;
        messageObj.authorAvatarUrl = null;
      }*/

      messageObj.body = this.parseLinksInMessage(messageObj.body);
      messageObj.body = this.parseMentionsInMessage(messageObj.body, messageObj.mentions);

      this.messages.push(messageObj);
      $timeout.cancel(this.renderTimeoutMessages);
      this.renderTimeoutMessages = $timeout(function(){
        if ($state.current.name == 'app.messages-room' && self.currentConversationId == messageObj.conversationId) {
          $ionicScrollDelegate.scrollBottom(true);
        } else if ($state.current.name == 'app.messages') {
          $ionicScrollDelegate.resize();
        }
      }, 200);
    }
  };

  r.getLastMessage = function(messageObj, conversation) {
    var self = this;

    function messageBody(message) {
      return message.length > 0 && message.trim() != self.imageStub ? message : 'Sent new photo'
    }

    var message = self.stubLinksInMessage(messageObj.body);

    return messageBody(message);
  };

  r.sendMessage = function(receiver, message, image, mentions) {
    var self = this;

    var messageId = xmppGroupChat.sendMessage(receiver, message, null, image, mentions);
    var userId = this.currentUser.jid;
    var user = this.getUserById(userId);
    var conversation = this.getConversationById(receiver);

    var messageObj = {};
    messageObj.body = message;
    messageObj.authorId = userId;
    messageObj.conversationId = receiver;
    messageObj.authorAvatarUrl = this.getAvatar(user);
    messageObj.authorFullName = user.fullName;
    messageObj.authorProfile = user.profile;
    messageObj.type = 'message';
    messageObj.uniqueId = messageId;
    messageObj.timestamp = messageId;
    messageObj.readed = conversation.room;
    messageObj.attachedImage = image;
    messageObj.delivered = false;
    messageObj.archived = false;
    messageObj.mentions = mentions;

    this.addMessage(messageObj);
  };

  r.lastMessageWasHourAgo = function() {
    try {
      var lastMessageDate;
      var conversation = this.getConversationById(this.currentConversationId);

      if (conversation && conversation.lastMessageDate) {
        console.log('AAAAAA', onversation.lastMessageDate);
        lastMessageDate = new Date(conversation.lastMessageDate);
      } else {
        return false;
      }
      var nowDate = new Date();
      var lastMessageDatePlusHour = lastMessageDate.setHours(lastMessageDate.getHours() + 1);
      if (nowDate >= lastMessageDatePlusHour) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('ERROR', e.message);
    }

  };

  r.checkIsHystoryLoaded = function(messageObj) {
    if (this.isHistoryLoaded)
      return true;

    var self = this;

    var onLoadDone = function(context) {
      console.log('HISTORY WAS LOAD');
      context.isHistoryLoaded = true;
      context.historyTimeout = null;
      context.hideSpinner();
      if($state.current.name == 'app.messages-room'){
        $timeout(function() {
          $ionicScrollDelegate.scrollBottom();
        }, 200);
      }
    }

    if (window.historyTimeout)
      clearTimeout(window.historyTimeout);

    if (messageObj.archived) {
      window.historyTimeout = setTimeout(function() {
        onLoadDone(self);
      }, 3000)
    }
    else {
      onLoadDone(self);
    }

  }

  return r;
});
