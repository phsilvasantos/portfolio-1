'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatUsers', function () {

  var r = {};

  r.users = []; // users from Aprse in format {id: parse_id, data: parse_object}
  r.usersDictionary = {}; // dictionary object of which key is user id 
  r.usersContacts = []; // builded and sorted contacts for isplaying to user {id, email, firstName, lastName, avatarUrl}
  r.currentUser = null;

  r.initializeUser = function (user) {
    user['fullName'] = user.attributes.firstName + ' ' + user.attributes.lastName;
    this.currentUser = user;
    this.currentUser.jid = user.id.toLowerCase();

    return user;
  };

  r.getUsers = function () {
    return this.users;
  };

  r.getContacts = function () {
    return this.usersContacts;
  };

  r.getUserById = function (id) {
    //return this.findById(this.users, id);
    return this.usersDictionary[id];
  };

  r.grepUsers = function (keyword, callback) {
    $.grep(this.users, function (user) {
      var item = user.data;
      var searchString = (item.attributes.email + ' ' + item.attributes.firstName + ' ' + item.attributes.lastName).toLowerCase();
      if (searchString.indexOf(keyword) > -1) {
        callback(item);
      }
    });
  };

  r.loadAppUsers = function (callback) {
    var self = this;
    var query = new Parse.Query(Parse.User);
    query.equalTo('supportChat', true);
    query.limit(500);

    var collection = query.include('profile').collection();

    self.usersContacts = [];

    collection.fetch({
      success: function (data) {
        data.models.forEach(function (user) {
          user['fullName'] = user.attributes.firstName + ' ' + user.attributes.lastName;
          self.addUser(user, user.id.toLowerCase());
        });

        var compare = function (a, b) {
          if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) {
            return -1;
          }
          if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) {
            return 1;
          }
          return 0;
        }

        self.usersContacts.sort(compare);
        callback();
      },
      error: function (collection, error) {
        // The collection could not be retrieved.
      }
    });

  };

  r.getAvatar = function (user) {
    var userAvatar = null;
    if (user && user.attributes.profile) {
      userAvatar = user.attributes.profile.attributes.thumbImage;
    }

    if (userAvatar) {
      return userAvatar._url;
    }
    return 'img/default_image.svg'
  };

  r.getAvatarById = function (userId) {
    return this.getAvatar(this.getUserById(userId));
  };

  r.getUserDisplayNameById = function (userId) {
    var user = this.getUserById(userId);
    if (user) {
      return user.get('firstName') + ' ' + user.get('lastName');
    } else {
      return '';
    }
  };
  
  r.getUserProfileById = function (userId) {
    var user = this.getUserById(userId);
    if (user) {
      return user.get('profile');
    } else {
      return '';
    }
  };

  r.addUser = function (user, key) {
    var self = this;

    user.profile = user.attributes.profile;

    var filtered;

    filtered = $.grep(this.users, function (c) {
      return c.id.toLowerCase() == key;
    });
    if (filtered.length > 0) {
      filtered[0].data = user;
    } else {
      this.users.push({
        id: key,
        data: user
      });
    }
    this.usersDictionary[key] = user;

    var contactItem = {
      id: user.id,
      email: user.attributes.email,
      firstName: user.attributes.firstName,
      lastName: user.attributes.lastName,
      fullName: user.fullName,
      profile: user.profile,
      avatarUrl: self.getAvatar(user)
    };
    var foundIndex = -1;
    filtered = $.grep(this.usersContacts, function (c, ind) {
      if (c.id === user.id) {
        foundIndex = ind;
        return true;
      }
      return false;
    });
    if (filtered.length > 0) {
      this.usersContacts[foundIndex] = contactItem;
    } else {
      this.usersContacts.push(contactItem);
    }
  };

  return r;
});
