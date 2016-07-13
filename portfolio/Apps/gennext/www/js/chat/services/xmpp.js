'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatXmpp', function($state, $timeout, $interval) {
  var r = {};

  r.roomsToConnect = [];
  r.syncInterval = null;

  r.resolveConnectionAlert = function(index) {
    if (index == 1) {
      this.connectToXmpp();
      this.startConnectionTimeout();
    } else {
      if ($state.current.name == 'app.messages') {
        history.go(-1);
      }
    }
  };

  r.showConnectionAlert = function() {
    if (navigator) {
      if (confirm('Cannot connect to chat at this time. Retry?')) {
        this.connectToXmpp();
        this.startConnectionTimeout();
      } else {
        if ($state.current.name == 'app.messages') {
          history.go(-1);
        }
      }
    } else {
      navigator.notification.confirm(
        'Cannot connect to chat at this time.',
        this.resolveConnectionAlert,
        'Oops!', ['Retry', 'Cancel']
      );
    }
  };

  r.startConnectionTimeout = function() {
    if (!this.isReady()) {
      console.log('START CONNECTION TIMEOUT');
      this.showSpinner();
      var self = this;

      if (window.xmppAuthTimeout) {
        this.cancelConnectionTimeout();
      }
      window.xmppAuthTimeout = $timeout(function() {
        console.log('SHOW CONNECTION ALERT');
        self.showConnectionAlert()
      }, 10000);
    }
  }

  r.cancelConnectionTimeout = function() {
    if (window.xmppAuthTimeout) {
      $timeout.cancel(window.xmppAuthTimeout);
      window.xmppAuthTimeout = null;
    }
  };

  r.connectToXmpp = function() {
    var self = this;
    var user = {
      id: this.currentUser.jid,
      chatPassword: this.currentUser.attributes.chatPassword,
      chatName: this.currentUser.id,
      roomsList: this.roomsToConnect
    };
    Parse.Config.get().then(function(config){
      var chatServer = config.get('chatServer');

      if (chatServer){
        xmppAuth.authenticate(user, chatServer, function(status) {
          if (status == Strophe.Status.CONNECTING) {

            console.log('Strophe is connecting.');
            self.isConnecting = true;
            self.updateChatState(false);
          } else if (status == Strophe.Status.CONNFAIL) {
            console.log('Strophe failed to connect.');
            $('#connect').get(0).value = 'connect';

            self.updateChatState(false);
            self.cancelConnectionTimeout();
            self.showConnectionAlert();
            self.isConnecting = false;
          } else if (status == Strophe.Status.DISCONNECTING) {
            console.log('Strophe is disconnecting.');
            self.updateChatState(false);
          } else if (status == Strophe.Status.AUTHFAIL) {
            console.log('Strophe is authentication failed.');
          } else if (status == Strophe.Status.DISCONNECTED) {
            console.log('Strophe is disconnected.');
            self.connectToXmpp();
          } else if (status == Strophe.Status.CONNECTED) {
            console.log('Strophe is connected.');
            window.ss = self;
            self.cancelConnectionTimeout();

            try {
              xmppGroupChat.joinToRooms(xmppAuth.userRooms);
              xmppGroupChat.registerXmppHandlers();
              xmppConnection.send($pres().tree());

              self.registerUiHandlers();
              self.updateChatState(true);
              self.connectionTimestamp = new Date().getTime();

              if (!self.syncInterval) { // we should get all conversations we participate for prevent missing conversations
                self.syncInterval = $interval(function() {
                  if (self.isReady) { //we need this condition becaus chat may be disconnected when this running
                    self.syncConversations(self, function(conversation){
                      self.joinToConversation(conversation);
                    })
                  }
                }, 60000);
              }


              if (xmppAuth.userRooms.length == 0) {
                self.hideSpinner();
                self.cancelConnectionTimeout();
              }

            } catch (err) {
              console.log(err.message, err.stack);
            }
          }

          return true;
        });
      }
    });
  };

  r.addRoomToConnect = function(conversationId) {
    this.roomsToConnect.push(conversationId);
  };

  return r;
});