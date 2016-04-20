var socket = io.connect('http://localhost');

socket.on('connect', function() {
  //socket.emit('set nickname', prompt('What is your nickname?'));

  socket.on('ready', function() {
    //socket.emit('msg', prompt('What is your message?'));
  });
});
