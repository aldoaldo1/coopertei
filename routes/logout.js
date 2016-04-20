var DB, Everyone;

var Logout = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Logout;
};

Logout.get = function(req, res, next) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

module.exports = Logout;

