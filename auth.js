var url = require('url'),
    _ = require('underscore');
var DB;

var Auth = function(db) {
  DB = db;

  return Auth;
};

Auth.restrict = function(req, res, next) {
  var paths_per_role = [
    // Dummy
    null,
    // Vigilancia
    ['/', '/inout', '/profile'],
    // Operador
    ['/', '/alert', '/profile', '/news', '/ot', '/'],
    // Supervisor
    ['/', '/alert', '/profile', '/news', '/ot']
  ];

  var url_parts = url.parse(req.url, true),
      isNotAdmin = req.session.role_id <= 3,
      roleArray = paths_per_role[req.session.role_id],
      cannotPass = _.indexOf(roleArray, url_parts.path) === -1;

  if (!req.session.username || !req.session.user_id || !req.session.role_id) {
    res.redirect('/login');
  //} else if (cannotPass) {
  //  res.render('noauth', { layout: false });
  } else {
    next();
  }
};

Auth.doLogin = function(user, pass, fn) {
  DB.User.find({
    where: { username: user, password: pass }
  }).success(function(user) {
    fn(user);
  }).error(function(err) {
    fn(new Error('Usuario o contrase&ntilde;a incorrectos'));
  });
};

module.exports = Auth;
