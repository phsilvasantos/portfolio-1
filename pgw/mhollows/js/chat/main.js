'use strict';

var module = angular.module('gnApp.messagesModule', []);

function sortMyLastMessageDateCompare(a, b) {
  if (a.data.lastMessageDate && !b.data.lastMessageDate)
    return -1;
  if (!a.data.lastMessageDate && b.data.lastMessageDate)
    return 1;

  var a_timestamp = new Date(a.data.lastMessageDate).getTime();
  var b_timestamp = new Date(b.data.lastMessageDate).getTime();

  if (a_timestamp > b_timestamp)
    return -1;
  if (a_timestamp < b_timestamp)
    return 1;
  return 0;
};

function sortConversationMessagesCompare(a, b) {
  if (a.timestamp < b.timestamp)
    return -1;
  if (a.timestamp > b.timestamp)
    return 1;
  return 0;
};

module.filter('currentConversationMessages', function() {
  return function(allMessages, conversationId) {
    var filteredMessages = $.grep(allMessages, function(message) {
      return message.conversationId == conversationId;
    });

    return filteredMessages;
  };
});

module.filter('sortByLastMessageDate', function(chatService) {
  return function(allConversations, condition) {
    if (!chatService.getSpinnerState()) {
      return allConversations.sort(sortMyLastMessageDateCompare);
    }
  };
});

module.filter('visibleConversations', function() {
  return function(allConversations) {
    return $.grep(allConversations, function(conversation) { return conversation.data.hidden == false });
  };
});

module.factory('chatService', function($ionicScrollDelegate, $location, $ionicLoading, $state, $timeout, $ionicPlatform, $filter, appNotificationsCounter, //){
  chatComposing, chatConversations, chatMessages, chatNotifications, chatSettings, chatMentions, chatSpinner, chatTyping, chatUsers, chatXmpp, chatMessageLinks, Utils) {

  var r = {};

  r.isChatReady = false;
  r.connectionTimestamp = null;

  r.initialize = function(user) {
    var self = this;

    self.initData();
    self.initializeUser(user);

    self.loadAppUsers(function() {
      self.loadConversations(function() {
        self.connectToXmpp();
      });
    });

  };

  r.initData = function() {
    this.conversations = [];
    this.users = [],
    this.usersContacts = [],
    this.messages = [],
    this.currentConversationId = '',
    this.currentUser = null,
    this.currentConversationTyping = [],
    this.currentConversationTopic = '',
    this.roomsToConnect = [],
    this.spinner = true,
    this.notReadMessages = 0,
    this.topicChangeTimeout = null,
    this.messageReceiptTimeout = null,
    this.invitationTimeout = null
  };

  r.isReady = function() {
    return r.isChatReady;
  };

  r.findById = function(arr, id) {
    if (!Parse.User.current()) return null;
    var filtered = $.grep(arr, function(c) {
      return c.id.toLowerCase() == id;
    });
    if (filtered.length == 0) {
      return null;
    } else {
      return filtered[0].data;
    }
  };

  r.updateChatState = function(value) {
    this.isChatReady = value;
  };

  r.isTimestampActual = function(timestamp) {
    return timestamp * 1 > this.connectionTimestamp;
  };

  r.registerUiHandlers = function() {
    var self = this;

    xmppGroupChat.registerUiHandler('onTopicChange', function(conversationId, userId, newTopic, timestamp) {
      if (self.isTimestampActual(timestamp)) {
        console.log('TOPIC CHANGED BY ' + userId + ' SET TO ' + newTopic);
        self.getConversationById(conversationId).conversationTopic = newTopic;
        if (self.isUserInRoom(conversationId)) {
          self.currentConversationTopic = newTopic;
        }
        $timeout.cancel(self.topicChangeTimeout);
        self.topicChangeTimeout = $timeout(function(){
          $ionicScrollDelegate.resize();
        }, 200);
      }
    });

    xmppGroupChat.registerUiHandler('onUserWasDroped', function(conversationId, userId) {
      console.log('onUserWasDroped', conversationId, userId);

      var conversation = self.getConversationById(conversationId);
      var user = self.getUserById(userId);

      var index = conversation.participants.indexOf(userId);
      if (index > -1) {
        conversation.participants.splice(index, 1);
      }

      if (userId == self.currentUser.jid) {
        xmppGroupChat.leaveRemoteRoom(conversationId);
        self.deleteConversationFromList(conversationId);

        if ($state.current.name == 'app.messages')
          $ionicScrollDelegate.resize();
        else
          $state.go('app.messages');
      }
    });

    xmppGroupChat.registerUiHandler('onRoomDestroyed', function(conversationId) {
      console.log('onRoomDestroyed', conversationId);
      self.resetNotReadMessagesForConversation(conversationId);
      self.deleteConversationFromList(conversationId);

      if ($state.current.name == 'app.messages')
        $ionicScrollDelegate.resize();
      else
        $state.go('app.messages');
    });

    xmppGroupChat.registerUiHandler('onMessageReceipt', function(conversationId, lastMessageId) {
      console.log('onMessageReceipt', conversationId, lastMessageId);
      self.markMessagesAsReadedForConversation(conversationId);
      $timeout.cancel(self.messageReceiptTimeout);
      self.messageReceiptTimeout = $timeout(function(){
        $ionicScrollDelegate.resize(); //refresh page
      }, 200);
    });

    xmppGroupChat.registerUiHandler('onMessageDelivered', function(uniqueId) {
      self.messages.forEach(function(messageObj) {
        if (messageObj.uniqueId == uniqueId) {
          messageObj.delivered = true;
          Utils.hideIndicator();

          self.sendPushNotification(messageObj.senderName, messageObj);

          return true;
        }
      });
    });

    xmppGroupChat.registerUiHandler('onMessage', function(message) {
      //console.log('MESSAGE RECEIVED', message);

      var user = self.getUserById(message.userId);
      var conversation = self.getConversationById(message.roomId);

      var messageObj = {};
      messageObj.body = message.body;
      messageObj.authorId = message.userId;
      messageObj.conversationId = message.roomId;
      messageObj.authorAvatarUrl = self.getAvatar(user);
      messageObj.authorFullName = user.fullName;
      messageObj.authorProfile = user.profile;
      messageObj.type = 'message';
      messageObj.uniqueId = message.uniqueId;
      messageObj.timestamp = message.timestamp;
      messageObj.readed = conversation.room || message.archived ? true : self.isUserInRoom(messageObj.conversationId);
      messageObj.attachedImage = message.attachedImage;
      messageObj.delivered = true;
      messageObj.archived = message.archived;
      messageObj.mentions = message.mentions;

      if (!messageObj.archived && conversation.hidden) {
        conversation.hidden = false;
        console.log('Message for hidden conversation', conversation);
        self.unhideConversation(conversation.conversationId, function() {
          $ionicScrollDelegate.resize()
        });
      }

      if (messageObj.authorId != self.currentUser.jid) {
        self.markMessagesAsReadedForConversation(messageObj.conversationId);
      }

      self.checkIsHystoryLoaded(messageObj);

      if (!messageObj.archived && !conversation.hidden && !self.isUserInRoom(messageObj.conversationId)) {
        self.incrementNotReadMessages(conversation);
      }

      if (!messageObj.archived && self.shouldShowToastyNotification(messageObj)) {
        try {
          self.showToastyNotification(messageObj, conversation);
        } catch (e) {
          console.log('Toasty notifcations are not available in browser', e.message);
        }
      }

      self.addMessageToConversations(messageObj);
    });

    xmppGroupChat.registerUiHandler('onInvitationReceived', function(conversationId) {
      try {
        self.fetchConversationById(conversationId, function(conversation) {
          self.joinToConversation(conversation);
        });
      } catch (err) {
        console.log(err.message, err.stack);
      }
    });

    xmppGroupChat.registerUiHandler('onParticipantLeaveRoom', function(conversationId, userId) {
      console.log('onParticipantLeaveRoom CALLBACK');
      if (self.currentUser.jid != userId) {
        var conversation = self.getConversationById(conversationId);
        var user = self.getUserById(userId);

        var index = conversation.participants.indexOf(userId);
        if (index > -1) {
          conversation.participants.splice(index, 1);
        }


        var messageObj = {};
        messageObj.body = user.fullName + " has left this conversation";
        messageObj.authorId = userId;
        messageObj.conversationId = conversationId;
        messageObj.authorAvatarUrl = '';
        messageObj.authorFullName = user.fullName;
        messageObj.authorProfile = user.profile;
        messageObj.type = 'notification';
        messageObj.timestamp = new Date().getTime();
        messageObj.uniqueId = messageObj.timestamp;
        messageObj.readed = true;
        messageObj.attachedImage = null;
        messageObj.delivered = true;

        self.addMessage(messageObj);

        console.log("PARTICIPANT LEAVE ROOM", messageObj);
      }
    });

    xmppGroupChat.registerUiHandler('onUsersInvited', function(conversationId, userId, users) {
      console.log('onUsersInvited CALLBACK', users);
      if (self.currentUser.jid != userId) {
        var conversation = self.currentConversation();
        var user = self.getUserById(userId);

        var invitedUsers = []
        users.split(',').forEach(function(item) {
          invitedUsers.push(self.getUserById(item).fullName);
        });

        self.addParticipantToConversationList(users);

        var messageObj = {};
        messageObj.body = user.fullName + " invited " + invitedUsers.join(', ') + " to this chat";
        messageObj.authorId = userId;
        messageObj.conversationId = conversationId;
        messageObj.authorAvatarUrl = '';
        messageObj.authorFullName = user.fullName;
        messageObj.authorProfile = user.profile;
        messageObj.type = 'notification';
        messageObj.uniqueId = null;
        messageObj.timestamp = new Date().getTime();
        messageObj.readed = true;
        messageObj.attachedImage = null;
        messageObj.delivered = true;

        self.addMessage(messageObj);

        console.log("USERS WAS INVITED", messageObj);
      }
    });

    xmppGroupChat.registerUiHandler('onComposingStart', function(conversationId, userId) {
      var conversation = self.getConversationById(conversationId);
      if (!conversation.room && self.currentConversationId == conversationId && $state.current.name == 'app.messages-room') {
        self.currentConversationTyping.push(userId);
        $timeout(function() {
          $ionicScrollDelegate.scrollBottom();
        }, 0);
        console.log('USER START COMPOSING', userId);
      }
    });

    xmppGroupChat.registerUiHandler('onComposingStop', function(conversationId, userId) {
      var conversation = self.getConversationById(conversationId);

      if (!conversation.room && self.currentConversationId == conversationId && $state.current.name == 'app.messages-room') {
        var index = self.currentConversationTyping.indexOf(userId);
        if (index > -1) {
          self.currentConversationTyping.splice(index, 1);
          $timeout(function() {
            $ionicScrollDelegate.resize();
          }, 0);
          console.log('USER STOP COMPOSING', userId);
        }
      }
    });
  };

  var chatService = angular.extend(r, chatComposing, chatConversations, chatMessages, chatMessageLinks,
    chatNotifications, chatSettings, chatSpinner, chatTyping, chatUsers, chatXmpp, chatMentions);

  return chatService;
});
