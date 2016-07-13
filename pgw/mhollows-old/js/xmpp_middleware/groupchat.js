var xmppGroupChat, typingTimeout;
var xmppConnectionData;

xmppGroupChat = (function() {
  function xmppGroupChat() {}

  xmppGroupChat.stub_empty_body_text = 'STUBEMPTYBODY'
  xmppGroupChat.handlersAlreadyRegistered = false;

  xmppGroupChat.roomsServer = function() {
    return 'conference.' + xmppAuth.serverAddress;
  }

  xmppGroupChat.registerXmppHandlers = function() {
    // describe functions for sending mesages

    if (!xmppConnectionData) {
      xmppConnectionData = {};
      xmppConnectionData.processedMessages = [];
      xmppConnectionData.deliverTimeouts   = [];        
    }
    
    Strophe.Builder.prototype.root = function() {
      while (this.nodeTree != this.node) { //going to root
        this.up()
      }
    };

    xmppConnection.registerMessage = function(uniqueId) {
      xmppConnectionData.processedMessages.push(uniqueId);

      var timeoutElementIndex = -1;

      for (var i = 0; i < xmppConnectionData.deliverTimeouts.length; i++) {
        var item = xmppConnectionData.deliverTimeouts[i];

        if (item.messageId == uniqueId) {
          clearTimeout(item.timeoutIndex);
          timeoutElementIndex = i;
          break;
        }
      };

      if (timeoutElementIndex > -1) {
        xmppConnectionData.deliverTimeouts.splice(timeoutElementIndex, 1);  
      }

      return true;
    };

    xmppConnection.isMessageDelivered = function(uniqueId) {
      return xmppConnectionData.processedMessages.indexOf(uniqueId) > -1;
    };

    xmppConnection.sendMessage = function(messageBuilder, msgid) {
      messageBuilder.root();

      if (!msgid) {
        msgid = new Date().getTime();
      }

      messageBuilder.c('uniqueid').t(msgid);

      this.sendWithRetry(messageBuilder, msgid);

      return true;
    };

    xmppConnection.sendWithRetry = function(messageBuilder, msgid) {
      if (this.isMessageDelivered(msgid)) {
        return true;
      }  

      var self = this;
      xmppConnection.send(messageBuilder.tree());

      var timeout = setTimeout(function() {
        console.log('RETRY MESSAGE');
        self.sendWithRetry(messageBuilder, msgid);
      }, 5000);

      xmppConnectionData.deliverTimeouts.push({messageId: msgid, timeoutIndex: timeout});
    }

    //redefine some MUC methods and add the new one

    xmppConnection.muc.setTopic = function(room, topic) {
      var msg;
      var msgid = xmppGroupChat._generateMessageUid();

      msg = $msg({
        to: room,
        from: this._connection.jid,
        type: "groupchat",
        id: msgid //we need this fix to handle outdated topic change
      }).c("subject", {
        xmlns: "jabber:client"
      }).t(topic);
      return this._connection.sendMessage(msg, msgid);
    };

    xmppConnection.muc.message = function(room, nick, message, html_message, type, msgid, messageBuilder) {
      var msg, parent, room_nick;
      room_nick = this.test_append_nick(room, nick);
      type = type || (nick != null ? "chat" : "groupchat");
      msgid = msgid || this._connection.getUniqueId();
      msg = $msg({
        to: room_nick,
        from: this._connection.jid,
        type: type,
        id: msgid
      }).c("body", {
        xmlns: Strophe.NS.CLIENT
      }).t(message);
      msg.up();

      if (html_message != null) {
        msg.c("html", {
          xmlns: Strophe.NS.XHTML_IM
        }).c("body", {
          xmlns: Strophe.NS.XHTML
        }).h(html_message);
        if (msg.node.childNodes.length === 0) {
          parent = msg.node.parentNode;
          msg.up().up();
          msg.node.removeChild(parent);
        } else {
          msg.up().up();
        }
      }

      msg.c("x", {
        xmlns: "jabber:x:event"
      }).c("composing");

      if (messageBuilder != undefined && messageBuilder) { //we should be able to send custom data with message
        msg = messageBuilder(msg);
      };

      this._connection.sendMessage(msg, msgid);
      return msgid;
    };

    xmppConnection.muc.groupchat = function(room, message, html_message, msgid, messageBuilder) {
      return this.message(room, null, message, html_message, void 0, msgid, messageBuilder);
    };

    xmppConnection.muc.userLeavedRoom = function(room) {
      var msg;
      var msgid = xmppGroupChat._generateMessageUid();

      msg = $msg({
        to: room,
        from: this._connection.jid,
        type: "groupchat",
        id: msgid //we need this fix to handle outdated topic change
      }).c("leaver", {
        xmlns: "jabber:client"
      });
      return this._connection.sendMessage(msg, msgid);
    };

    xmppConnection.muc.userInvitedRoom = function(room, users) {
      var msg;
      var msgid = xmppGroupChat._generateMessageUid();

      msg = $msg({
        to: room,
        from: this._connection.jid,
        type: "groupchat",
        id: msgid //we need this fix to handle outdated topic change
      }).c("invited", {
        xmlns: "jabber:client", users: users
      });
      return this._connection.sendMessage(msg, msgid);
    };

    if (!xmppGroupChat.handlersAlreadyRegistered) {
      dbg('INITIALIZE XMPP HANDLERS');
      xmppGroupChat.handlersAlreadyRegistered = true; 

      xmppConnection.addHandler(this.xmppHandlers.onInvitationReceived, null, 'message', null, null, null);
      //xmppConnection.addHandler(this.xmppHandlers.onParticipantLeaveRoom, null, 'presence', 'unavailable', null, null);
      xmppConnection.addHandler(this.xmppHandlers.onComposing, null, 'message', 'composing', null, null);
      xmppConnection.addHandler(this.xmppHandlers.onMessageReceipt, null, 'message', 'receipt', null, null);

    } else {
      dbg('XMPP HANDLERS ALREADY INITIAKIZED'); 
    }    

    return true;
  };

  xmppGroupChat.registerUiHandler = function(name, callback) {
    xmppGroupChat.uiHandlers[name] = callback;

    return true;
  };

  xmppGroupChat.choseMessageHandler = function(name, message, filter) {
    if (filter(message)) {
      xmppGroupChat.xmppHandlers[name].call(this, message);
    };

    return true;
  };


  xmppGroupChat.uiHandlers = {
    onMessage: function(message) {
    },
    onRoomCreated: function(roomName) {
    },
    onInvitationReceived: function(roomName) {
    },
    onUsersInvited: function(roomName, userName, users) {
    },
    onRoomLeaved: function(roomName) {
    },
    onParticipantLeaveRoom: function(roomName, userId) {
    },
    onComposingStart: function(roomName, userId) {
    },
    onComposingStop: function(roomName, userId) {
    },
    onTopicChange: function(roomName, userId, newTopic) {
    },
    onMessageReceipt: function(roomName, uniqId) {
    },
    onMessageDelivered: function(timestamp) {
    }
  };

  xmppGroupChat.xmppHandlers = {
    onMessageReceived: function(message) {
      //console.log('onMessageReceived', message);
      if (message.getAttribute('type') == 'error') {
        console.log("Error ON message receiving"); //do not remove this logger
        return true
      };      

      debug(function() {
        //for some unknown reasons in some cases this event is triggered by several time on same message
        //we need some hack for this
        var uniqueness = message.getElementsByTagName('uniqueid');
        var messageId = null;
        if (uniqueness.length) {
          messageId = Strophe.getText(uniqueness[0]);
        }

        if (messageId) {
          messageId = messageId * 1;

          if (xmppConnection.isMessageDelivered(messageId)) {
            return true; //we already processed this message
          }
          
          xmppConnection.registerMessage(messageId);
        }
        // end of hack for double messages

        xmppGroupChat.choseMessageHandler('onMessage', message, function() { return message.getElementsByTagName('body').length > 0 });
        xmppGroupChat.choseMessageHandler('onMessageDelivered', message, function() {
          return message.getElementsByTagName('body').length > 0 
                 && xmppGroupChat._userById(message.getAttribute('from')) == xmppAuth.currentUser.id.toLowerCase() 
                 && message.getElementsByTagName('delay').length == 0;
        });
        xmppGroupChat.choseMessageHandler('onTopicChange', message, function() { return message.getElementsByTagName('subject').length > 0 });
        xmppGroupChat.choseMessageHandler('onParticipantLeaveRoom', message, function() { return message.getElementsByTagName('leaver').length > 0 });
        xmppGroupChat.choseMessageHandler('onUsersInvited', message, function() { return message.getElementsByTagName('invited').length > 0 });
      });

      return true;
    },

    onMessage: function(message) {
      var elems = message.getElementsByTagName('body');
      var roomName = xmppGroupChat._roomNamebyID(message.getAttribute('from').split('/')[0]);
      var userName = xmppGroupChat._userById(message.getAttribute('from'));

      var delays = message.getElementsByTagName('delay');
      var timestamp = null;
      if (delays.length) {
        timestamp = new Date(delays[0].getAttribute('stamp')).getTime();
      }
      else {
        timestamp = message.getAttribute('id');
      }

      var uniqueness = message.getElementsByTagName('uniqueid');
      

      var attachedImage = null;
      var images = message.getElementsByTagName('image');
      if (images.length) {
        attachedImage = Strophe.getText(images[0]);
      }

      var mentions = null;

      var mentionsTag = message.getElementsByTagName('mentions');

      if (mentionsTag.length) {
        mentions = [];
        var mentionTags = mentionsTag[0].getElementsByTagName('mention');
        for (var i = 0; i < mentionTags.length; i++) {
          mentions.push($('<div/>').html(Strophe.getText(mentionTags[i])).text());
        }
      }

      var result = {
        roomId: roomName,
        userId: userName,
        to: message.getAttribute('to'),
        timestamp: timestamp * 1,
        uniqueId: Strophe.getText(uniqueness[0]) * 1,
        body: Strophe.getText(elems[0]),
        attachedImage: attachedImage, 
        archived: delays.length > 0,
        mentions: mentions
      };

      if (result.body == xmppGroupChat.stub_empty_body_text)
        result.body = '';

      xmppGroupChat.uiHandlers.onMessage(result);
    },

    onMessageDelivered: function(message) {
      var uniqueness = message.getElementsByTagName('uniqueid');
      var uniqueId = Strophe.getText(uniqueness[0]) * 1;      

      xmppGroupChat.uiHandlers.onMessageDelivered(uniqueId);
    },

    onTopicChange: function(message) {
      var elems = message.getElementsByTagName('subject');

      var roomName = xmppGroupChat._roomNamebyID(message.getAttribute('from').split('/')[0]);
      var userName = xmppGroupChat._userById(message.getAttribute('from'));
      var newTopic = Strophe.getText(elems[0]);
      var timestamp = message.getAttribute('id');

      xmppGroupChat.uiHandlers.onTopicChange(roomName, userName, newTopic, timestamp);
    },

    onParticipantLeaveRoom: function(message) {
      debug(function() {
        var roomName = xmppGroupChat._roomNamebyID(message.getAttribute('from').split('/')[0]);
        var userName = xmppGroupChat._userById(message.getAttribute('from'));
        var invited = message.getElementsByTagName('invited')

        xmppGroupChat.uiHandlers.onParticipantLeaveRoom(roomName, userName);
      });

      return true;
    },

    onUsersInvited: function(message) {
      console.log('onUsersInvited');
      debug(function() {
        var roomName = xmppGroupChat._roomNamebyID(message.getAttribute('from').split('/')[0]);
        var userName = xmppGroupChat._userById(message.getAttribute('from'));
        var invited  = message.getElementsByTagName('invited')[0];
        var users    = invited.getAttribute('users');

        xmppGroupChat.uiHandlers.onUsersInvited(roomName, userName, users);
      });

      return true;
    },

    onRoomPresence: function(presence) {
       if (presence.getAttribute('type') == 'error') {
        console.log("Error ON JOIN TO ROOM", presence.getAttribute('from')); //do not remove this logger
        return true
      };

      return true;
    },

    onRoomRoster: function(roster) {
      return true;
    },

    onRoomCreated: function(data) {
      debug(function() {
        roomName = xmppGroupChat._roomNamebyID(data.getAttribute('from'));

        xmppGroupChat.uiHandlers.onRoomCreated(roomName);
      });

      return true;
    },

    onInvitationReceived: function(message) {
      debug(function() {
        var x_elems = message.getElementsByTagName('x');
        if (x_elems.length > 0) {
          var invites = x_elems[0].getElementsByTagName('invite');
          if (invites.length > 0) {
            var roomName = xmppGroupChat._roomNamebyID(message.getAttribute('from'));

            xmppGroupChat.uiHandlers.onInvitationReceived(roomName);
          }
        }
      });

      return true;
    },

    onComposing: function(message) {
      debug(function() {
        var composings = message.getElementsByTagName('composing');
        if (composings.length > 0) {
          var roomName = composings[0].getAttribute('room');
          var status = composings[0].getAttribute('status');
          var userId = xmppGroupChat._senderById(message.getAttribute('from'));
          if (status == 'start') {
            console.log('start composing');
            xmppGroupChat.uiHandlers.onComposingStart(roomName, userId);
            typingTimeout = setTimeout(function(){
              xmppGroupChat.uiHandlers.onComposingStop(roomName, userId);
            }, 1600);
          }
          else {
            clearTimeout(typingTimeout);
            console.log('stop composing');
            xmppGroupChat.uiHandlers.onComposingStop(roomName, userId);
          }
        }

         console.log('EVERETHING WORKS FINE');
      });

      return true;
    },

    onMessageReceipt: function(message) {
      debug(function(){
        console.log('Received message receipt', message);
        var receipts = message.getElementsByTagName('receipt');
        if (receipts.length > 0) {
          var roomName      = receipts[0].getAttribute('room');
          var lastMessageId = receipts[0].getAttribute('id');

          debug(function(){
              xmppGroupChat.uiHandlers.onMessageReceipt(roomName, lastMessageId);
          });

        }
      });

      return true;
    },

    onRoomLeaved: function(roomId) {
      debug(function() {
        xmppGroupChat.uiHandlers.onRoomLeaved(xmppGroupChat._roomNamebyID(roomId));
      });

      return true;
    }
  };

  xmppGroupChat.joinToRooms = function(roomNames) {
    if (typeof roomNames === 'string') {
      roomNames = [roomNames];
    }

    for (i = 0; i < roomNames.length; ++i) {
      roomJID = xmppGroupChat._roomIDbyName(roomNames[i]);

      password = null;
      history_attrs = null;
      xmppConnection.muc.join(roomJID, xmppAuth.currentUser.chatName, this.xmppHandlers.onMessageReceived, this.xmppHandlers.onRoomPresence, this.xmppHandlers.onRoomRoster, null, null);
      console.log("JOINED TO ROOM", roomJID);
    }

  };

  xmppGroupChat.createTemporaryRoom = function(roomName, user, callback) {
    preparedRoomName = xmppGroupChat._roomIDbyName(roomName) + '/' + user.chatName.toLowerCase();

    createRoomMessage = $pres({
      from: user['jid'],
      to: preparedRoomName
    }).c("x", {
      xmlns: "http://jabber.org/protocol/muc"
    }).tree();

    xmppConnection.addHandler(callback, null, 'presence', null, null, preparedRoomName, null);
    xmppConnection.send(createRoomMessage);
  };

  xmppGroupChat.startChat = function(roomName) {
    xmppGroupChat.createTemporaryRoom(roomName, xmppAuth.currentUser, function(presence) {
      var statuses = presence.getElementsByTagName('status');
      var roomWasJustCreated = false;

      for (i = 0; i < statuses.length; ++i) {
        if (statuses[i].getAttribute('code') == '201') {
          roomWasJustCreated = true;
        }
      }
      if (roomWasJustCreated) {
        var roomConfig = {"muc#roomconfig_persistentroom": "1", "muc#roomconfig_membersonly": "1", "muc#roomconfig_allowinvites": "1"};
        //http://stackoverflow.com/questions/11434720/xmppframework-iphone-groupchat-getting-error-code-404-recipient-unavailable
        //some of room becomes unavailable for its users after some time. Try to fix this with solution from link above

        setTimeout(
          function() {
            xmppConnection.muc.createConfiguredRoom(xmppGroupChat._roomIDbyName(roomName), roomConfig, xmppGroupChat.xmppHandlers.onRoomCreated, function() {});
          }, 3000
        );
        // xmppConnection.muc.createInstantRoom(xmppGroupChat._roomIDbyName(roomName), xmppGroupChat.xmppHandlers.onRoomCreated, function() {});
      } else {
        xmppGroupChat.xmppHandlers.onRoomCreated(presence);
      }
    });
  };

  xmppGroupChat.leave = function(roomName) {
      xmppConnection.muc.userLeavedRoom(xmppGroupChat._roomIDbyName(roomName));

      setTimeout(function() {
        xmppConnection.muc.leave(xmppGroupChat._roomIDbyName(roomName), xmppAuth.currentUser.chatName, function(args) {}, '');
        xmppGroupChat.xmppHandlers.onRoomLeaved(roomName);
      }, 2000);
  };

  xmppGroupChat.sendMessage = function(roomName, body, id, image, mentions) {
    var messageBuilder = undefined;

    console.log('SEND MESSAGE', body, image, mentions);
    if (image != undefined && image || mentions != undefined && mentions) {
      messageBuilder = function(message) {
         message.root();

         if (image != undefined && image) {
           message.c('image').t(image); 
         } 

         message.root(); 
         if (mentions != undefined && mentions.length) {
           message.c('mentions');
           for (var i = 0; i < mentions.length; i++) {
             message.c('mention').t(mentions[i]).up();  
           }
         }

         return message;
      }
    }

    var uid = xmppGroupChat._generateMessageUid();
    if (id != undefined) {
      uid = id;
    }

    if (!body || body.length == 0) {
      body = xmppGroupChat.stub_empty_body_text;
    }

    return xmppConnection.muc.groupchat(xmppGroupChat._roomIDbyName(roomName), body, null, uid, messageBuilder);
  };

  xmppGroupChat.inviteUsers = function(roomName, users) {
    console.log('START USERS INVITATIONS');
    if (typeof users === 'string') {
      users = [users];
    }

    for (i = 0; i < users.length; ++i) {
      var receiverJid = xmppAuth.buildLogin(users[i]);
      console.log('Invite: ', xmppGroupChat._roomIDbyName(roomName), receiverJid);
      xmppConnection.muc.invite(xmppGroupChat._roomIDbyName(roomName), receiverJid, null);
    }

    xmppConnection.muc.userInvitedRoom(xmppGroupChat._roomIDbyName(roomName), users.join(','));
  };

  xmppGroupChat.sendTypingStatus = function(roomName, participants, status){
    console.log('send message composing to ', participants);
    xmppGroupChat._sendServiceMessage(roomName, participants, function(participant){
      return $msg({from: xmppConnection.jid, to: xmppAuth.buildLogin(participant), type: 'composing', id: xmppGroupChat._generateMessageUid()} ).c('composing', {room: roomName, status: status}).tree();
    });
  };

  xmppGroupChat.sendReceiptMessage = function(roomName, participants, lastMessageId){
    console.log('send message receipt to ', participants);
    xmppGroupChat._sendServiceMessage(roomName, participants, function(participant){
      return $msg({from: xmppConnection.jid, to: xmppAuth.buildLogin(participant), type: 'receipt', id: xmppGroupChat._generateMessageUid()} ).c('receipt', {room: roomName, id: lastMessageId}).tree();
    });
  };

  xmppGroupChat._sendServiceMessage = function(roomName, participants, messageBuilder) {
    if (participants.length > 2) {
      return false;
    }

    var userId = xmppAuth.currentUser.id.toLowerCase();
    for (var i = 0; i < participants.length; ++i) {
      if (userId != participants[i]) {
        var m = messageBuilder(participants[i]);
        xmppConnection.send(m);
      }
    };
  };

  xmppGroupChat.setTopic = function(roomName, topic) {
    xmppConnection.muc.setTopic(xmppGroupChat._roomIDbyName(roomName), topic);
  };

  xmppGroupChat._roomIDbyName = function(roomName) {
    return roomName + '@' + xmppGroupChat.roomsServer();
  };

  xmppGroupChat._roomNamebyID = function(roomJID) {
    return roomJID.split('@')[0]
  };

  xmppGroupChat._userById = function(roomJID) {
    return roomJID.split('/')[1].toLowerCase();
  };

  xmppGroupChat._senderById = function(userJID) {
    return userJID.split('@')[0].toLowerCase();
  };

  xmppGroupChat._generateMessageUid = function() {
    return new Date().getTime();
  };

  return xmppGroupChat;
})();