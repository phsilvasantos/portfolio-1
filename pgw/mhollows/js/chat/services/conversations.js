'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatConversations', function ($state, $ionicScrollDelegate, $timeout) {
  var r = {};

  r.conversations = [];
  r.currentConversationId = '',
  r.currentConversationTopic = '',
  r.currentConversationParticipants = [];

  r.newConversationTimeout = null;

  r.addParticipantToConversationList = function (users) {
    var addUsersList = [];
    users = users.split(',');

    for (var user in users) {
      if (!_.contains(this.currentConversation().participants, users[user])) {
        addUsersList.push(users[user]);
      }
    }

    this.currentConversation().participants = this.currentConversation().participants.concat(addUsersList);
  };

  r.getConversations = function () {
    return this.conversations;
  };

  r.getConversationById = function (id) {
    return this.findById(this.conversations, id);
  };

  r.getCurrentConversationTopic = function () {
    return this.currentConversationTopic;
  };

  r.isUserInRoom = function (conversationId) {
    return $state.current.name == 'app.messages-room' && conversationId == this.currentConversationId;
  };

  r.addCurrentConversationUsers = function (participants, callback) {
    var participant;
    var receivers = [];
    var self = this;

    for (participant in participants) {
      receivers.push(participants[participant].id.toLowerCase());
    }
    var currentConversation = this.currentConversation();

    var newParticipantsList = currentConversation.participants.concat(receivers);
    newParticipantsList = $.grep(newParticipantsList, function (v, k) {
      return $.inArray(v, newParticipantsList) === k;
    });

    currentConversation.participants = newParticipantsList;

    var Conversation = Parse.Object.extend('Conversation');
    var query = new Parse.Query(Conversation);
    query.equalTo("conversationId", this.currentConversationId);
    query.first({
      success: function (Conversation) {
        Conversation.save(null, {
          success: function (contact) {
            contact.set('participants', newParticipantsList.concat([self.currentUser.jid]));
            contact.save();
            xmppGroupChat.inviteUsers(self.currentConversationId, receivers);
          }
        });
      }
    });
    callback(newParticipantsList);
  };

  r.currentConversationUsers = function () {
    var member, participant, participantObj;
    var participants = [];
    var conversation = this.currentConversation();
    if (conversation) {
      //return conversation.users;
      participants.push({
        id: this.currentUser.id.toLowerCase(),
        fullName: this.currentUser.fullName,
        avatarUrl: this.getAvatar(this.getUserById(this.currentUser.id.toLowerCase()))
      });
      for (member in conversation.participants) {
        participant = this.getUserById(conversation.participants[member]);
        if (participant) {
          participantObj = {
            id: conversation.participants[member],
            fullName: participant.fullName,
            avatarUrl: this.getAvatar(participant)
          };
          participants.push(participantObj);
        }
      }
      return participants;
    } else
      return [];
  };

  r.isConversationHidden = function(conversation) {
    return conversation.get('hiddenBy') && conversation.get('hiddenBy').indexOf(this.currentUser.jid) > -1 ? true : false;
  }

  r.addNewConversation = function (conversation) {
    var conversationId = conversation.attributes.conversationId.toLowerCase();
    var avatarUrl = 'img/default_image.svg';
    var contactId = null;
    if (!conversation.room) {
      contactId = this.getContactFromParticipants(conversation.attributes.participants);
      var contact = this.getUserById(contactId);
      avatarUrl = this.getAvatar(contact);
    }

    if (!this.getConversationById(conversationId)) {
      console.log('LOAD CONVERSATION', conversation.attributes.mutes, this.currentUser.jid)
      var muted = conversation.attributes.mutes ? conversation.attributes.mutes[this.currentUser.jid] : null
      var muteTimeout = null;

      if (muted && muted != 'inf') {
        muteTimeout = setTimeout()
      }

      var conversationObj = {
        muted: muted,
        hidden: this.isConversationHidden(conversation),
        lastMessageDate: null,
        lastMessageText: '',
        avatarUrl: avatarUrl,
        authorId: contactId,
        conversationId: conversationId,
        conversationTopic: conversation.attributes.conversationTopic,
        participants: conversation.attributes.participants,
        room: conversation.attributes.room,
        notReadMessages: 0
      };

      if (muted && muted != 'inf') {
        conversationObj.mutedTimeout = setTimeout(function () {
          conversationObj.mutedTimeout = null;
          conversationObj.muted = null;
        }, muted - new Date().getTime())
      }

      this.addConversation(conversationObj, conversationId);
      this.addRoomToConnect(conversationId);
    }
    $timeout.cancel(this.newConversationTimeout);
    this.newConversationTimeout = $timeout(function () {
      $ionicScrollDelegate.resize();
    }, 200);
  };

  r.loadConversations = function (callback) {
    var self = this;
    var Conversation = Parse.Object.extend('Conversation');
    var query = new Parse.Query(Conversation);

    query.equalTo("participants", self.currentUser.jid);
    query.limit(500);

    var collection = query.collection();

    collection.fetch({
      success: function (data) {
        data.models.forEach(function (conversation) {
          self.addNewConversation(conversation);

          var conversationId = conversation.attributes.conversationId.toLowerCase();
          if (conversationId == self.currentConversationId) {
            self.currentConversationTopic = self.getConversationTopic(self.getConversationById(conversationId));
          }
        });

        callback();
      },
      error: function (collection, error) {
        // The collection could not be retrieved.
      }
    });
  };

  r.syncConversations = function (scope, callback) {
    console.log('SYNCH CONVERSATIONS');

    var self = this;
    var Conversation = Parse.Object.extend('Conversation');
    var query = new Parse.Query(Conversation);

    query.notEqualTo("joinedParticipants", self.currentUser.jid);
    query.equalTo("participants", self.currentUser.jid);

    query.limit(500);

    var collection = query.collection();

    collection.fetch({
      success: function (data) {
        data.models.forEach(function (conversation) {
          console.log('unsynch conversation', conversation);
          callback.call(scope, conversation);
        });
      },
      error: function (collection, error) {
        // The collection could not be retrieved.
      }
    });
  }

  r.fetchConversationById = function (conversationId, callback) {
    var Conversation = Parse.Object.extend('Conversation');
    var query = new Parse.Query(Conversation);
    query.equalTo("conversationId", conversationId);
    query.first({
      success: function (conversation) {
        callback(conversation);
      },
      error: function (message) {
        console.log('Cant loadad conversation', message);
      }
    });
  };

  r.startChat = function (receivers, message, callback) {
    this.showSpinner();
    if (receivers.length === 1) {
      this.startPrivateChat(receivers[0], message, callback);
    } else {
      this.startGroupChat(receivers, message, callback);
    }
  };

  r.startPrivateChat = function (receiverId, message, callback) {

    var privateConversations = $.grep(this.conversations, function (item) {
      return item.data.room == false
    });
    //check if we already has conversation with this user

    if (receiverId) {
      for (var i = 0; i < privateConversations.length; ++i) {

        if (privateConversations[i].data.participants.indexOf(receiverId.toLowerCase()) > -1 && !privateConversations[i].data.room) {
          console.log('PRIVATE CHAT FOUND');
          xmppGroupChat.sendMessage(privateConversations[i].id, message);
          callback(privateConversations[i].id);
          return true;
        }
      }

      this.createConversation([receiverId], message, false, callback);
    } else {
      console.log('CANT FIND RECEIVER');
    }
  };

  r.startGroupChat = function (receivers, message, callback) {
    this.createConversation(receivers, message, true, callback);
  };

  r.createConversation = function (receivers, message, room, callback) {
    console.log('CREATE CONVERSATION', receivers);
    var self = this;
    var newRoomId = Math.random().toString(36).substring(7);
    var Conversation = Parse.Object.extend('Conversation');
    var conversation = new Conversation();
    var participants = [Parse.User.current().id.toLowerCase()];

    for (var i = 0; i < receivers.length; ++i) {
      participants.push(receivers[i].toLowerCase());
    }
    ;

    conversation.save({
      room: room,
      conversationId: newRoomId,
      conversationTopic: null,
      participants: participants
    }, {
      success: function (conversation) {
        self.addNewConversation(conversation);

        xmppGroupChat.registerUiHandler('onRoomCreated', function (roomId) {
          console.log('onRoomCreated');
          xmppGroupChat.inviteUsers(roomId, participants);
          xmppGroupChat.joinToRooms(roomId);
          if (message) // we can start an empty conversation from members list or user profile
            xmppGroupChat.sendMessage(roomId, message);
          callback(roomId);
        });

        xmppGroupChat.startChat(newRoomId);
      }
    });
  };

  r.addConversation = function (conversation, key) {
    this.conversations.push({
      id: key,
      data: conversation
    });
  };

  r.setCurrentConversation = function (conversationId) {
    this.currentConversationId = conversationId;

    if (this.getConversationById(conversationId)) {
      this.currentConversationTopic = this.getConversationTopic(this.getConversationById(conversationId));
      this.sendReceiptMessage();
    }
  };

  r.currentConversation = function () {
    return this.getConversationById(this.currentConversationId);
  };

  r.getContactFromParticipants = function (participants) {
    var index = participants.indexOf(this.currentUser.jid);
    participants.splice(index, 1);
    return participants[0];
  };

  r.getConversationTopic = function (conversation) {
    if (conversation.attributes) {
      if (conversation.attributes.conversationTopic) {
        return conversation.attributes.conversationTopic;
      }
      return this.buildDefaultTopicName(conversation.attributes.participants);
    } else {
      if (conversation.conversationTopic) {
        return conversation.conversationTopic;
      }
      return this.buildDefaultTopicName(conversation.participants);
    }
  };

  r.buildDefaultTopicName = function (participants) {

    var number_of_full_names = 3;

    var participants_names = []
    var result = ''

    if (participants.length > 0) {
      for (var i = 0; i < participants.length; ++i) {
        if (i < number_of_full_names && (participants.length > 2 || participants[i] != this.currentUser.jid)) {
          var participant = this.getUserById(participants[i].toLowerCase());
          if (participant) {
            participants_names.push(participant.fullName);
          }
        }
        ;
      }
      result = participants_names.join(', ');
      if (participants.length > number_of_full_names) {
        result += ' and ' + (participants.length - number_of_full_names) + ' more...'
      }
    } else {
      result = 'Empty Room';
    }

    return result;
  };

  r.isCurrentConversationMuted = function () {
    var conversation = this.getConversationById(this.currentConversationId);

    return conversation && (conversation.muted || conversation.hidden) ? true : false;
  };

  r.muteCurrentConversation = function (mutePeriodInSeconds) {
    var self = this;
    var conversation = this.getConversationById(this.currentConversationId);

    var muteEndsAt = mutePeriodInSeconds == 'inf' ? 'inf' : new Date().getTime() + mutePeriodInSeconds * 1000;

    conversation.muted = muteEndsAt;

    if (mutePeriodInSeconds != 'inf') {
      if (conversation.mutedTimeout) {
        clearTimeout(conversation.mutedTimeout);
        conversation.mutedTimeout = null;
      }

      conversation.mutedTimeout = setTimeout(function () {
        conversation.mutedTimeout = null;
        conversation.muted = null;
      }, mutePeriodInSeconds * 1000)
    }

    this.fetchConversationById(this.currentConversationId, function (conversation) {
      if (!conversation.get('mutes')) {
        conversation.set('mutes', {});
      }

      console.log(muteEndsAt);
      conversation.get('mutes')[self.currentUser.jid] = muteEndsAt;
      conversation.save();
    });
  };

  r.isMuteActual = function (conversation) {
    if (!conversation.muted) {
      return false;
    }

    if (conversation.muted == 'inf' || conversation.muted > new Date().getTime()) {
      return true;
    }

    return false;
  };

  r.unmuteCurrentConversation = function () {
    var self = this;
    var conversation = this.getConversationById(this.currentConversationId);


    conversation.muted = null;

    if (conversation.mutedTimeout) {
      clearTimeout(conversation.mutedTimeout);
      conversation.mutedTimeout = null;
    }

    this.fetchConversationById(this.currentConversationId, function (conversation) {
      if (!conversation.get('mutes')) {
        conversation.set('mutes', {});
      }

      delete conversation.get('mutes')[self.currentUser.jid];
      conversation.save();
    });
  };

  r.joinToConversation = function (conversation) {
    var self = this;

    if (conversation.get('joinedParticipants')) {
      if (conversation.get('joinedParticipants').indexOf(self.currentUser.jid) == -1) {
        conversation.set('joinedParticipants', conversation.get('joinedParticipants').concat([self.currentUser.jid]));
        conversation.save();
      }
    }
    else {
      conversation.set('joinedParticipants', [self.currentUser.jid]);
      conversation.save();
    }

    var conversationId = conversation.attributes.conversationId.toLowerCase();

    self.addNewConversation(conversation);
    xmppGroupChat.joinToRooms(conversationId);
    $timeout.cancel(self.invitationTimeout);
    self.invitationTimeout = $timeout(function () {
      $ionicScrollDelegate.resize();
    }, 200);
  }

  r.hideConversation = function(conversationId, callback) {
    var self = this;

    console.log('HIDE CURRENT CONVERSATION', conversationId);

    this.fetchConversationById(conversationId, function(conversation) {
      console.log('CONVERSATION FOUND', conversation);
      if (!conversation.get('hiddenBy')) {
        conversation.set('hiddenBy', []);
      }

      conversation.get('hiddenBy').push(self.currentUser.jid);
      conversation.save().then(function() {
        var currentConversation = self.getConversationById(conversationId);
        currentConversation.hidden = true;
        self.resetNotReadMessagesForConversation(conversationId);
        callback();
      })
    });
  }

  r.unhideConversation = function(conversationId, callback) {
    var self = this;

    console.log('UNHIDE CURRENT CONVERSATION', conversationId);

    this.fetchConversationById(conversationId, function(conversation) {
      var index = conversation.get('hiddenBy').indexOf(self.currentUser.jid);
      if (index > -1) {

        conversation.get('hiddenBy').splice(index, 1);
      }

      console.log('CONVERSATION FOUND', conversation.get('hiddenBy'));
      conversation.save().then(function() {
        var currentConversation = self.getConversationById(conversationId);
        currentConversation.hidden = false;
        callback();
      });
    });
  }

  r.destroyConversation = function(conversationId, callback) {
    var self = this;

    console.log('DESTROY CURRENT CONVERSATION', conversationId);
    this.fetchConversationById(conversationId, function(conversation) {
      if (conversation.get('room')) {
        self.leaveRoom(conversationId, function() {
          callback();
        });
      }
      else {
        conversation.destroy().then(function() {
          xmppGroupChat.destroyRoom(conversationId);
          self.resetNotReadMessagesForConversation(conversationId);
          self.deleteConversationFromList(conversationId);
          console.log('DESTROY DONE');
          callback();
        });
      }

    });
  }

  r.deleteConversationFromList = function(conversationId) {
    var index = -1;
    for (var i in this.conversations) {
      if (this.conversations[i].id == conversationId) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      console.log('deleteConversationFromList', conversationId, index)
      this.conversations.splice(index, 1);
    }
  }

  r.dropUserFromConversation = function(userId, conversationId) {
    var self = this;

    if (!conversationId)
      conversationId = this.currentConversationId;

    var conversation = this.getConversationById(conversationId);
    var user = this.getUserById(userId);

    var index = conversation.participants.indexOf(userId);
    if (index > -1) {
      conversation.participants.splice(index, 1);
    }

    this.fetchConversationById(conversationId, function(conversation) {
      self.removeUserFromConversaionParticipants(conversation, userId);
      xmppGroupChat.dropUserFromConversation(userId, conversationId);
    });
  }

  return r;
});
