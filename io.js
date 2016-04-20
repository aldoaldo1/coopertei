var _ = require('underscore');

var io, DB;

var IO = function(socketio, db) {
  io = socketio;
  DB = db;

  // TODO: Find out how to generalize all messaging for CRUDs, then move on from there.
  //       CRUDs generalized and everything else loosely coded is acceptable

  io.sockets.on('connection', function(socket) {
    socket.on('set nickname', function(name) {
      socket.set('nickname', name, function() {
        socket.emit('ready');
      });
    });

    socket.on('msg', function() {
      socket.get('nickname', function(err, name) {
        console.log('Chat message by ', name);
      });
    });
  });

  return IO;
};

module.exports = IO;
