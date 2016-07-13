

'use strict';

var module = angular.module('gnApp.messagesModule');

module.factory('chatMessageLinks', function(Mentions) {

  var r = {};

  r.imageStub = '(image)';
  r.linkStub = '(link)'

  r.__urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  r.__imgRegex = /\.(?:jpe?g|gif|png)$/i;

  r.parseMentionsInMessage = function(body, mentions) {
    return Mentions.parseMentionsInText(body, mentions);
  }

  r.parseLinksInMessage = function(body) {
    var __urlRegex = this.__urlRegex;
	  var __imgRegex = this.__imgRegex;

		function parseURL($string){
	    var exp = __urlRegex;
	    return $string.replace(exp,function(match){
          __imgRegex.lastIndex=0;
          if(__imgRegex.test(match)){
            return '<img src="' + match + '" class="message-image" />';
          }
          else{
            return '<a href="' + match + '" target="_system" class="chat-link">' + match + '</a>';
          }
        }
	    );
		};

    return parseURL(body);
  };

  r.stubLinksInMessage = function(body) {
    var __urlRegex = this.__urlRegex;
    var __imgRegex = this.__imgRegex;

    var self = this;

    function parseURL($string){

      var exp = __urlRegex;
      return $string.replace(exp,function(match){
          __imgRegex.lastIndex=0;
          if(__imgRegex.test(match)){
            return self.imageStub;
          }
          else{
            return self.linkStub;
          }
        }
      );
    };

    return parseURL(body);
  };

  return r;
});
