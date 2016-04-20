var DB, Everyone;

var Role = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Role;
};

Role.get = function(req, res, next) {
  DB.Role.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(roles) {
    res.send(DB.dataToArray(roles));
  });
};

module.exports = Role;

