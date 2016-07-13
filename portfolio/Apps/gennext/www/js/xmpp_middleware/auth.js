var xmppConnection;
var xmppAuth;

xmppAuth = (function() {
  function xmppAuth() {}

  xmppAuth.serverAddress = null;
  xmppAuth.currentUser = null;
  xmppAuth.userRooms = [];

  xmppAuth.authenticate = function(user, chatServer, onConnect) {
    console.log('authenticate user');

    xmppAuth.serverAddress = xmppAuth.serverAddressFromUrl(chatServer);
    xmppConnection = new Strophe.Connection(chatServer + 'http-bind/');

    xmppAuth.currentUser = user;
    xmppAuth.userRooms   = user.roomsList;
    xmppConnection.connect(this.buildLogin(user.id), user.chatPassword, onConnect);

    return true;
  };

  xmppAuth.jid = function(){
    xmppAuth.buildLogin(xmppAuth.currentUser.id);
  }

  xmppAuth.buildLogin = function(xmppUser) {
    console.log(xmppUser.toLowerCase() + '@' + xmppAuth.serverAddress)
    return xmppUser.toLowerCase() + '@' + xmppAuth.serverAddress;
  }

  xmppAuth.serverAddressFromUrl = function(chatServer) {
    var match = chatServer.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);

    return match[2];  //we should use this RegExp because Android not works with URL objectgs
  }

  return xmppAuth;

})();