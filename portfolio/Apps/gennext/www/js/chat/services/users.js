'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatUsers', function() {

  var r = {};

  r.users         = []; // users from Aprse in format {id: parse_id, data: parse_object}
  r.usersContacts = []; // builded and sorted contacts for isplaying to user {id, email, firstName, lastName, avatarUrl}
  r.currentUser = null;

  r.initializeUser = function(user) {
    user['fullName'] = user.attributes.firstName + ' ' + user.attributes.lastName;
    this.currentUser = user;
    this.currentUser.jid = user.id.toLowerCase();

    return user;
  };

  r.getUsers = function() {
    return this.users;
  };

  r.getContacts = function() {
    return this.usersContacts;
  };

  r.getUserById = function(id) {
    return this.findById(this.users, id);
  };

  r.grepUsers = function(keyword, callback) {
    $.grep(this.users, function(user) {
      var item = user.data;
      var searchString = (item.attributes.email + ' ' + item.attributes.firstName + ' ' + item.attributes.lastName).toLowerCase();
      if (searchString.indexOf(keyword) > -1) {
        callback(item);
      }
    });
  };

  r.loadAppUsers = function(callback) {
    var self = this;
    var query = new Parse.Query(Parse.User);
    query.limit(500);

    var collection = query.include('profile').collection();

    collection.fetch({
      success: function(data) {
        data.models.forEach(function(user) {
          user['fullName'] = user.attributes.firstName + ' ' + user.attributes.lastName;
          self.addUser(user, user.id.toLowerCase());
        });

        var compare = function(a, b) {
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
      error: function(collection, error) {
        // The collection could not be retrieved.
      }
    });

  };

  r.getAvatar = function(user) {
    var userAvatar = null;
    if (user && user.attributes.profile) {
      userAvatar = user.attributes.profile.attributes.picture;
    }

    if (userAvatar) {
      return userAvatar._url;
    }
    return 'img/default_image.svg'
  };

  r.addUser = function(user, key) {
    var self = this;

    this.users.push({
      id: key,
      data: user
    });
    this.usersContacts.push({
      id: user.id,
      email: user.attributes.email,
      firstName: user.attributes.firstName,
      lastName: user.attributes.lastName,
      fullName: user.fullName,

      avatarUrl: self.getAvatar(user)
    });
  };

  return r;
});
