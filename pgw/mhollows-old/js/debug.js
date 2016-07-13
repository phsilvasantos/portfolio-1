function log(msg)
{
  $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function debug(block) {
  try {
    block();
  } catch (err) {
    console.log(err.message, err.stack);
    dbg('SOME ERROR');
    dbg(err.message);
    dbg(err.stack);
  }
}

function dbg() {
  if (!window.dbg_data) {
  	window.dbg_data = [];
  }
  console.log(arguments);

  for (var i in arguments) {
    window.dbg_data.push(arguments[i])
  }
}
