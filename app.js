/*
 *  Dependencies
 */
var fs = require('fs'),
    lazy = require('lazy'),
    express = require('express'),
    socketio = require('socket.io');

module.exports = express.createServer();
var app = module.exports;
var Everyone = 'this was a "now" instance';
/*
 *  Configuration
 */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'river plate' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});
/*
 *  Database
 */
var DB = require('./db')();
/*
 * Paths
 */
var PATH = {
  UPLOADS: __dirname + '/public/uploads/'
};
/*
 *  Routes
 */
var routes = {};
fs.readdirSync(__dirname + '/routes').forEach(function(x) {
  routes[x.split('.')[0]] = require('./routes/' + x)(DB, Everyone, PATH);
});
require('./routes')(app, routes);

/*
 *  Server
 */

socketio = socketio.listen(app);
socketio.set('log level', 1);
app.listen(3000);

require('./io')(socketio, DB);
