

'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatMessageLinks', function(Mentions, Linkify) {

  var r = {};

  r.parseMentionsInMessage = function(body, mentions) {
    return Mentions.parseMentionsInText(body, mentions);
  }

  r.parseLinksInMessage = function(body) {
    return Linkify.parseLinks(body, {imgCssClass: "content-image", linkCssClass: "chat-link"});
  };

  r.stubLinksInMessage = function(body) {
    return Linkify.stubLinks(body);
  };

  return r;
});
