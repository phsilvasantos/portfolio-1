'use strict';
var cordova = cordova; //this hack for running in web browser

angular.module('gnApp.controllers')
  .controller('MessagesListController', function($scope, Utils, chatService, $location, $ionicLoading, $timeout, $filter) {
    var self = this;

    this.conversations = chatService.getConversations();

    this.spinner = chatService.getSpinnerState();
    console.log('INSIDE CONTOLLER MessagesListController');
    chatService.startConnectionTimeout();

    this.listEmpty = function() {
      return !chatService.getConversations().length;
    };

    if (this.spinner) {
      chatService.showSpinner();
    } else {
      chatService.hideSpinner();
    }

    if (!Parse.User.current()) {
      $location.path('/login');
      return;
    }
  })

.controller('MessagesNewController', function($scope, $ionicSideMenuDelegate, $ionicScrollDelegate, $timeout, $location, chatService) {
  if (cordova != undefined && cordova.plugins != undefined){
    cordova.plugins.Keyboard.disableScroll(true);
  }

  $ionicSideMenuDelegate.canDragContent(true);

  this.receivers = [];
  this.searchQuery = '';
  this.message = '';
  this.users = chatService.getContacts();
  this.currentUserId = chatService.currentUser.id;

  var self = this;

  this.startChat = function($event) {
    this.buttonSendOffsetX = $('button.button-send').offset().left;
    if ($event.pageX > this.buttonSendOffsetX){
      if (!this.receivers.length || !this.message) {
        return false;
      }
      var receivers = [];
      for (var i = 0; i < this.receivers.length; ++i) {
        receivers.push(this.receivers[i].id);
      }
      if (cordova != undefined && cordova.plugins != undefined) {
        cordova.plugins.Keyboard.close();
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      };

      chatService.startChat(receivers, this.message, function(conversationId) {
        self.redirectToConversation(conversationId);
        chatService.hideSpinner();
      });
    }
  };

  this.redirectToConversation = function(receiverId) {
    $location.path('/messages/' + receiverId.toLowerCase());
    //$scope.$apply();
  };

  this.search = function() {
    var keyword = this.searchQuery.toLowerCase().trim();

    if (keyword.length) {
      var users = [];
      chatService.grepUsers(keyword, function(item) {
        var user = {
          id: item.id,
          email: item.attributes.email,
          firstName: item.attributes.firstName,
          lastName: item.attributes.lastName,
          avatarUrl: chatService.getAvatar(item)
        };
        users.push(user);
      });

      this.users = users;

    } else {
      this.users = chatService.getContacts();
    }
    $ionicScrollDelegate.scrollTop();
  }

  this.addContactToReceivers = function(contact) {

    if (this.alreadyReceiverIndex(contact) > -1) {
      var index = this.alreadyReceiverIndex(contact);
      this.receivers.splice(index, 1);
    } else {
      this.receivers.push(contact);
    }
    this.searchQuery = '';
    this.users = chatService.getContacts();
  };

  this.alreadyReceiverIndex = function(contact) {
    var receiver;
    for (receiver in this.receivers) {
      if (this.receivers[receiver].id === contact.id) {
        return receiver;
      }
    }
    return -1;
  }

  if (!Parse.User.current()) {
    $location.path('/login');
    return;
  }
})


.controller('MessagesRoomController', function($window, $ionicModal, $filter, $scope, $rootScope, $stateParams,
  $ionicSideMenuDelegate, $ionicScrollDelegate, $timeout, $interval, $state, chatService, $location, Utils, Mentions) {

  if (cordova != undefined && cordova.plugins != undefined){
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    cordova.plugins.Keyboard.disableScroll(true);
  }

  chatService.startConnectionTimeout();

  // if (!chatService.isReady() && Parse.User.current() && xmppConnection) {
  //   $timeout.cancel(window.xmppAuthTimeout);
  //   xmppConnection.disconnect();
  // }

  window.cs = chatService;

  $ionicSideMenuDelegate.canDragContent(true);

  this.conversationId = $stateParams.conversationId;

  console.log('INSIDE ROOMS CONTROLLER');
  console.log($stateParams);

  chatService.setCurrentConversation($stateParams.conversationId.toLowerCase());

  chatService.resetNotReadMessages();
  this.settingsWasOpened = false;
  this.allMessages = chatService.getMessages();

  this.message = '';
  this.attachedImage = null;
  this.typingUsers = [];
  this.typingUsersObj = chatService.currentConversationTypingUsers();
  this.typingUsers = chatService.getCurrentConversationTyping();
  this.typingUsersAvatar = null;
  this.typingUsersAnounce = '';
  this.typingTimeout = null;
  this.typingRefreshInterval = null;
  this.typingRefreshTimeout = null;
  this.userIsTyping = false;
  this.lastMessageDate = (chatService.currentConversation()) ? chatService.currentConversation().lastMessageDate : new Date().toString();
  this.lastMessageAuthorId = null;
  this.spinner = chatService.getSpinnerState();

  this.contentEl = $('.page-messages-room.scroll-content');
  this.contentElBottom = null;
  this.textareaExpandable = $('textarea.expandable');
  this.currentConversationRoom = undefined;

  var self = this;

  $scope.shared.currentConversation      = chatService.currentConversation();
  $scope.shared.currentConversationUsers = chatService.currentConversationUsers();
  $scope.shared.currentConversationTopic = chatService.getCurrentConversationTopic();

   $ionicModal.fromTemplateUrl('templates/messages-partials/messages-photo-upload-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    controller: 'MessagesRoomController as messagesRoom'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  this.showPhotoModal = function() {
    $scope.modal.show();
  };

  this.hidePhotoModal = function() {
    $scope.modal.hide();
  };

  this.takePhoto = function() {
    var self = this;

    var cbSuccess = function(file) {
      console.log(file);
      window.resolveLocalFileSystemURL(file, function(openedFile) {
        openedFile.file(function(fileEntry) {
          self.attachImage(fileEntry);
        }, function(error) {console.log(error)});
      }, function(error) {console.log(error)});
    };

    var cbError = function(error) {
      console.log(error)
    }

    console.log('Take Photo');
    navigator.camera.getPicture(cbSuccess, cbError, {sourceType: Camera.PictureSourceType.CAMERA, correctOrientation: true} );
    this.hidePhotoModal();
  };

  this.useExistingPhoto = function() {
    console.log('Use existing Photo');

    var self = this;

    var cbSuccess = function(file) {
      console.log(file);
      window.resolveLocalFileSystemURL(file, function(openedFile) {
        openedFile.file(function(fileEntry) {
          self.attachImage(fileEntry);
        }, function(error) {console.log(error)});
      }, function(error) {console.log(error)});
    };

    var cbError = function(error) {
      console.log(error)
    }

    navigator.camera.getPicture(cbSuccess, cbError, {sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
    this.hidePhotoModal();
  };

  $scope.$watch(function(){
    return chatService.getCurrentConversationTopic();
  }, function(topic){
    $scope.shared.currentConversationTopic = topic;
    $rootScope.messages.room = chatService.getRoomState();
    self.currentConversation = chatService.currentConversation();
  });

  $scope.$watch(function () { return chatService.currentConversationUsers() }, function(users){
    $scope.shared.currentConversationUsers = users;
  }, true);

  this.scrollRoomView = function() {
    if (!$ionicSideMenuDelegate.isOpen()){
      $timeout(function(){
        $ionicScrollDelegate.scrollBottom();
      });
    }
  }

  angular.element($window).bind('native.keyboardshow', self.scrollRoomView);
  angular.element($window).bind('native.keyboardhide', self.scrollRoomView);

  var self = this;

  $timeout(function(){$ionicScrollDelegate.scrollBottom(true);}, 100);

  $scope.$watch(function() {
    return $ionicSideMenuDelegate.getOpenRatio();
  }, function(value) {
    if (cordova != undefined && self.settingsWasOpened  && cordova.plugins != undefined){
      cordova.plugins.Keyboard.close();
      $ionicScrollDelegate.scrollBottom(true);
    }
    if (value === -1){
      self.settingsWasOpened = true;
      self.oldTopic = $scope.shared.currentConversationTopic;
    }
    if (!value && self.settingsWasOpened && $scope.shared.currentConversationTopic && $scope.shared.currentConversationTopic !== self.oldTopic){
      chatService.updateTopic($scope.shared.currentConversationTopic);
      self.settingsWasOpened = false;
    }
  });

  $scope.$on('$viewContentLoaded', function() {
    if ($state.current.name == 'app.messages-room'){
      $timeout(function() {
        $ionicScrollDelegate.scrollBottom();
      }, 100);
    }
  });

  this.resizeMessageInput = function($event){
    console.log($event);
  }

  this.isNotification = function(message) {
    return message.type == 'notification' ? true : false;
  };

  this.getTypingUsersAvatar = function(){
    if(this.typingUsersObj.length){
      this.typingUsersAvatar = chatService.getAvatar(this.typingUsersObj[0]);
    }
  };

  this.somebodyTyping = function(){
    this.typingUsersObj = chatService.currentConversationTypingUsers(this.typingUsers);
    this.getTypingUsersAvatar();
    this.typingUsersAnounce = this.getTypingUsersAnounce();
    return this.typingUsers.length;
  };

  this.enableTyping = function(){
    chatService.composingStart();
    self.userIsTyping = true;
  };

  this.disableTyping = function(){
    chatService.composingStop();
    self.userIsTyping = false;
  };

  this.messageInputChanged = function($event) {
    this.userStartTyping();
    $timeout(self.expandTextarea, 0);
    if($rootScope.messages.room){
      Mentions.watchIfMentionCalled(this.message);
    }
  }

  this.alreadyParticipant = function(contact) {
    if ((this.currentConversation && (this.currentConversation.participants.indexOf(contact.id.toLowerCase()) > -1)) || chatService.currentUser.id === contact.id) {
      return true;
    }
    return false;
  }

  /** Mentions */

  this.usersForMentionsCb = function() {
    var users = _.compact(_.map(chatService.users, function(user) {
      if (self.alreadyParticipant(user)) {
        return user.data;
      }

      return null;
    }));

    console.log('GREP MENTIONED USERS', users);

    return users;
  }

  this.showMention = function() {
    return Mentions.displayMentionsList();
  }

  this.mentionUsersList = function() {
    return Mentions.getMentionUsersList();
  }

  this.addUserToMentions = function(user) {
    var self = this;
    this.message = Mentions.addUserToMentions(user, this.message, function() {
      self.expandTextarea();
    });
  };

  Mentions.reset();
  Mentions.initialize(this.textareaExpandable, this.usersForMentionsCb);
  /** End of Mentions */

  this.userStartTyping = function(){
    $timeout.cancel(this.typingRefreshTimeout);
    if(!this.userIsTyping && !$rootScope.messages.room){
      this.enableTyping();
      this.typingRefreshInterval = $interval(function(){
        self.enableTyping();
      }, 1200);
      this.typingRefreshTimeout = $timeout(function(){
        $interval.cancel(self.typingRefreshInterval);
        self.disableTyping();
      }, 1000);
    }
    else{
      $timeout.cancel(this.typingTimeout);
      self.typingTimeout = $timeout(function(){
        $interval.cancel(self.typingRefreshInterval);
        self.disableTyping();
      }, 1100);
    }
  };

  this.toggleRoomSettings = function() {
    console.log($scope.messages.canDragRight());
    $scope.settingsPanelShowed = !$scope.settingsPanelShowed;
    $ionicSideMenuDelegate.toggleRight();
    $('.topic-name').attr('readonly', 'readonly');
    setTimeout(function () {
      $('.topic-name').removeAttr('readonly');
    }, 1000);
  };

  this.attachImage = function(file) { // should be scope

    var saveFile = function(parseFile, shouldResize) {
      parseFile.save().then(
        function () {
          if (shouldResize) {
            Parse.Cloud.run('resizeImage', {url: parseFile.url()}).then(
              function(url) {
                self.attachedImage = url;
                self.sendMessageViaXmpp();
              },
              function(error) {
                 Utils.hideIndicator();
                 Utils.alert('Unable to save Image.', 'Error');
              }
            )
          }
          else {
            self.attachedImage = parseFile.url();
            self.sendMessageViaXmpp();
          }
        },
        function (error) {
          Utils.hideIndicator();
          Utils.alert('Unable to save Image.', 'Error');
        }
      );
    };

    if (file) {
      Utils.showIndicator();
      window.utls = Utils;

      if (file.size / 1024 / 1024 > 10) {
        Utils.alert('File size should be less than 10 MB', 'Error');
        Utils.hideIndicator();
        return false;
      }

      if (file.name.indexOf('.gif') > -1) {
        var name = "photo.gif";
        var shouldResize = false;
      }
      else {
        var name = "photo.jpg";
        var shouldResize = true;
      }

      var parseFile = new Parse.File(name, file);
      saveFile(parseFile, shouldResize);

    } else {
      Utils.alert('No new image to save.', 'Gen-Next');
    }
  };

  this.sendMessageViaXmpp = function() {
    chatService.sendMessage($stateParams.conversationId, this.message, this.attachedImage, Mentions.formMentionedList());
    this.message = '';
    this.attachedImage = null;
  };

  this.sendMessage = function($event) {
    this.buttonSendOffsetX = $('button.button-send').offset().left;
    if ($event.pageX > this.buttonSendOffsetX){
      if (!this.message.length && !this.attachedImage) {
        return false;
      }

      $interval.cancel(self.typingRefreshInterval);
      if(Mentions.checkMentionedOnTheirPlaces(this.message)){
        this.sendMessageViaXmpp();
      }
      this.disableTyping();
    }
  };

  this.userIsAuthor = function(messageAuthorId) {
    return chatService.currentUser && chatService.currentUser.jid === messageAuthorId;
  };

  this.shouldHideUser = function(message) {
    return message.authorFullName == null;
  };

  this.changeTopic = function() {
    console.log(this.topic)
    //chatService.updateTopic(this.settings.topic);
  };

  this.getTypingUsersAnounce = function(){
    if (this.typingUsersObj.length){
      return this.typingUsersObj[0].fullName + ' typing.';
    }
  };

  this.lastMessageWasHourAgo = function(index){
    var differ;
    var currentMessages = chatService.currentConversationMessages();

    if (index === currentMessages.length - 1){
      differ = new Date().getTime() - currentMessages[index].timestamp;
      if (!currentMessages[index].timestamp)
        return false;
    }
    else{
      differ = currentMessages[index + 1].timestamp - currentMessages[index].timestamp;
      if (!currentMessages[index + 1].timestamp || !currentMessages[index].timestamp)
        return false;
    }

    return differ > 3600000 ? true : false;
  };

  this.expandTextarea = function(){
    var $el = self.textareaExpandable;
    var el = $el.get(0);
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';

    var scroll = el.scrollHeight + 23;
    if (self.contentElBottom != scroll){
      var maxHeight = parseInt($el.css('max-height'));
      if (el.scrollHeight <= maxHeight){
        $('.mentions-list').css('bottom', (el.scrollHeight + 30) + 'px');
        self.contentEl.css('bottom', scroll + 'px');
        $ionicScrollDelegate.scrollBottom(true);
      }
      self.contentElBottom = scroll;
    }
    return;
  };
  
  this.addMembers = function(){
    angular.element($('#btn_add_chat_member')).scope().messagesRoomSettings.addMembersModal();
  };

  if (this.spinner) {
    chatService.showSpinner();
  } else {
    chatService.hideSpinner();
  }

  if (!Parse.User.current()) {
    $location.path('/login');
    return;
  }
})

.controller('MessagesRoomSettingsController', function($ionicModal, $scope, $stateParams, $ionicSideMenuDelegate, $ionicScrollDelegate, $timeout, $state, chatService, $location) {
  console.log('Im in the room settings controller');
  this.settings = {};
  this.currentConversationTopic = chatService.getCurrentConversationTopic();
  this.searchQuery = '';
  this.receivers = [];
  this.users = [];
  this.conversation = null;
  this.menuToggle = false;

  var self = this;

  //    setTimeout(function(){console.log('aaaa', self.currentConversation.conversationTopic)}, 10000);

  this.changeTopic = function() {
    console.log(this.settings.topic)
    //chatService.updateTopic(this.settings.topic);
  };
  
  this.closeSettings = function(){
    $ionicSideMenuDelegate.toggleRight(false);
  };
  
  this.done = function(){
    $ionicSideMenuDelegate.toggleRight(false);
  };

  this.leaveRoom = function() {
    console.log('LEAVE ROOM CLICKED');
    chatService.leaveRoom(function() {
      $ionicSideMenuDelegate.toggleRight();
      self.redirectToMessages();
      console.log('REDIRECT TO MESSAGES');
    });
  };

  this.redirectToMessages = function() {
    $state.go('app.messages');
    $scope.$apply();
  };

  $ionicModal.fromTemplateUrl('templates/messages-partials/messages-settings-add-members-modal.html', {
    scope: $scope,
    animation: 'slide-in-up',
    controller: 'MessagesRoomSettingsController as messagesRoomSettings'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  this.addMembersModal = function() {
    self.users = chatService.getContacts();
    $scope.modal.show().then(function(){
    $scope.$apply();
      //$ionicScrollDelegate.resize();
    });

  };

  this.hideMembersModal = function() {
    $scope.modal.hide().then(function() {
      self.searchQuery = '';
      self.receivers = [];
      self.search();
    });
  };

  this.search = function() {
    this.conversation = chatService.currentConversation();
    var keyword = this.searchQuery.toLowerCase().trim();

    if (keyword.length) {
      var users = [];
      chatService.grepUsers(keyword, function(item) {
        var user = {
          id: item.id,
          email: item.attributes.email,
          firstName: item.attributes.firstName,
          lastName: item.attributes.lastName,
          avatarUrl: chatService.getAvatar(item)
        };
        users.push(user);
      });

      $timeout(function() {
        self.users = users;
      });
    } else {
      $timeout(function() {
        self.users = chatService.getContacts();
      });
    }
    $ionicScrollDelegate.scrollTop();
  }

  this.addContactToReceivers = function(contact) {
    if (this.alreadyReceiverIndex(contact) > -1) {
      var index = this.alreadyReceiverIndex(contact);
      this.receivers.splice(index, 1);
    } else {
      this.receivers.push(contact);
    }
    this.searchQuery = '';
  };

  this.alreadyReceiverIndex = function(contact) {
    var receiver;
    for (receiver in this.receivers) {
      if (this.receivers[receiver].id === contact.id) {
        return receiver;
      }
    }
    return -1;
  }

  this.alreadyParticipant = function(contact) {
    if ((this.conversation && (this.conversation.participants.indexOf(contact.id.toLowerCase()) > -1)) || chatService.currentUser.id === contact.id) {
      return true;
    }
    return false;
  }

  this.addUsers = function() {
    chatService.addCurrentConversationUsers(this.receivers, function(newReceiversList) {
      $scope.shared.currentConversationUsers = chatService.currentConversationUsers();
      self.hideMembersModal();
    });
  }

  this.muteToggle = false;
  this.mutePeriods = [{name: '15 minutes', value: 15 * 60},
                      {name: '1 hour', value: 60 * 60},
                      {name: '8 hours', value: 8 * 60 * 60},
                      {name: '24 hours', value: 24 * 60 * 60},
                      {name: 'Until I turn it back on', value: 'inf'}];

  this.mutePeriod = this.mutePeriods[0].value;

  this.chooseMutePeriod = function(mutePeriod) {
    console.log(mutePeriod);
    if (mutePeriod.length) {
      chatService.muteCurrentConversation(mutePeriod);
    }
  }

  this.toggleMute = function() {
    var isMuteOn = !this.muteToggle;

    if (isMuteOn === false) {
      chatService.unmuteCurrentConversation();
    }
    else {
      chatService.muteCurrentConversation(this.mutePeriod);
    }
  }

  $scope.$watch(function() {
    return chatService.isCurrentConversationMuted();
  }, function(muteToggle) {
    console.log('mute Toggle', muteToggle);
    if (muteToggle === true && self.muteToggle == false) {
      self.muteToggle = true;
    }

    if (muteToggle === false && self.muteToggle == true) {
      self.muteToggle = false;
    }
  })

});
