//This file was created for playing with Strophejs And OpenFire Server


// ONE TO ONE CHAT
on_message = function(message) {
  log('Message received ');
  return true;
};

bosh_service = 'http://192.241.215.70:7070/http-bind/';
connection = new Strophe.Connection(this.bosh_service);
login = '1yy0xc6ayg@192.241.215.70';
password = '776ad035fc0b42adb7534bea9eff9dd5';

connection.connect(login, password, function(status) {
  if (status == Strophe.Status.CONNECTED) {
    log('Strophe is connected. 111');
  }
});

connection.addHandler(on_message, null, 'message', null, null, null);
connection.send($pres().tree());




//GROUP CHAT


function dump(obj) {
  var out = '';
  for (var i in obj) {
    out += i + ": " + obj[i] + "\n";
  }

  alert(out);
}

//Oleg
roomsServer = 'conference.192.241.215.70';
user = {
  id: 'ggoyppzvnw',
  chatPassword: '4178e6f9d8e74f379aa30e0c0e227d8e',
  chatName: 'Oleg Zaporozhchenko'
};
xmppAuth.authenticate(user);

//Bogdan
roomsServer = 'conference.192.241.215.70';
user = {
  id: 'fcbeqhdvhf',
  chatPassword: '2ba88284f2314e34b8e7e8a4afc3ed84',
  chatName: 'Bogdan Kostko'
};
xmppAuth.authenticate(user);

//Ivan
roomsServer = 'conference.192.241.215.70';
user = {
  id: 'pmsypbq6eb',
  chatPassword: '2fbf2063bdb545e588b32063d178eaf0',
  chatName: 'Ivan Linko'
};
xmppAuth.authenticate(user);



// *******************************  SANDBOX **************************************************

//rooms list
xmppConnection.muc.listRooms(roomsServer, function(data) {
  window.roomsList = data;
}, function(error) {
  dump(error)
});

//room param for further queries
roomJID = roomsList.getElementsByTagName('item')[0].getAttribute('jid');

// join room
msg_handler_cb = function(msg) {
  console.log(msg);
  return true;
};
pres_handler_cb = function(data) {
  console.log(data);
  return true
};
roster_cb = function() {
  console.log('roster');
  return true
};
password = null;
history_attrs = null;

xmppConnection.muc.join(roomJID, 'GgoyPpZVnW'.toLowerCase(), msg_handler_cb, pres_handler_cb, roster_cb, password, history_attrs);

//invite to join room
receiver = '1yy0xc6ayg@192.241.215.70';
xmppConnection.muc.invite(roomJID, receiver, null);

//get room occupants
occupants_success_cb = function(data) {
  console.log(data);
  alert('occupants')
};
occupants_error_cb = function(error) {
  console.log(error);
  alert('occupants list error')
}
xmppConnection.muc.queryOccupants(roomJID, occupants_success_cb, occupants_error_cb);

//send message
message = 'Hellow to All=)';
html_message = null;
msgid = null;

xmppConnection.muc.groupchat(roomJID, message, html_message, msgid);

//leave room
leave_handler_cb = function() {
  alert('leave room')
};
exit_msg = 'Good buy';
xmppConnection.muc.leave(roomJID, nick, leave_handler_cb, exit_msg);

//create room
roomName = 'new_room' + '@' + roomsServer;

//create tmp room
createRoomMessage = $pres({
  from: 'e93wvfzlw9@192.241.215.70',
  to: roomName + '/c3gdlk'
}).c("x", {
  xmlns: "http://jabber.org/protocol/muc"
}).tree();
xmppConnection.send(createRoomMessage);

//make tmp room as instant
room_success_cb = function(data) {
  alert('room created')
};
room_error_cb = function(error) {
  alert('room creation error');
  dump(error);
};

xmppConnection.muc.createInstantRoom(roomName, room_success_cb, room_error_cb);


// I should send request to create tmp room
// <presence
//     from='crone1@shakespeare.lit/desktop'
//     to='coven@chat.shakespeare.lit/firstwitch'>
//   <x xmlns='http://jabber.org/protocol/muc'/>
// </presence>

// Response 

// <presence xmlns="jabber:client" from="new_room@conference.192.241.215.70/c3gdlk" to="e93wvfzlw9@192.241.215.70/9ddfffbb">
//   <x xmlns="http://jabber.org/protocol/muc#user">
//     <item jid="e93wvfzlw9@192.241.215.70/9ddfffbb" affiliation="owner" role="moderator"/>
//     <status code="110"/><status code="100"/><status code="201"/>
//   </x>
// </presence>


// room creation error response
// <body xmlns='http://jabber.org/protocol/httpbind'>
//     <iq xmlns="jabber:client" type="error" id="2:sendIQ" from="new_room@conference.192.241.215.70" to="e93wvfzlw9@192.241.215.70/1135f13d">
//         <query xmlns="http://jabber.org/protocol/muc#owner">
//             <x xmlns="jabber:x:data" type="submit"/>
//         </query>
//         <error code="401" type="auth"><not-authorized xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/></error>
//     </iq>
// </body>


//////// ******************** APP testing ***************

//Oleg
roomsServer = 'conference.192.241.215.70';
user = {
  chatLogin: 'ggoyppzvnw',
  chatPassword: '4178e6f9d8e74f379aa30e0c0e227d8e',
  chatName: 'Oleg Zaporozhchenko',
  roomsList: []
};
xmppAuth.authenticate(user);

//Bogdan
roomsServer = 'conference.192.241.215.70';
user = {
  chatLogin: 'fcbeqhdvhf',
  chatPassword: '2ba88284f2314e34b8e7e8a4afc3ed84',
  chatName: 'Bogdan Kostko',
  roomsList: []
};
xmppAuth.authenticate(user);

//Ivan
roomsServer = 'conference.192.241.215.70';
user = {
  chatLogin: 'pmsypbq6eb',
  chatPassword: '2fbf2063bdb545e588b32063d178eaf0',
  chatName: 'Ivan Linko',
  roomsList: []
};
xmppAuth.authenticate(user);


// LOGIN FINISHED

// START CHAT
xmppGroupChat.startChat('aroom');

// INVITE SECOND USER
BogdanJID = 'fcbeqhdvhf@192.241.215.70';
xmppGroupChat.inviteUsers('aroom', BogdanJID);

xmppGroupChat.sendMessage('aroom', 'Hellow. This is a message 1');