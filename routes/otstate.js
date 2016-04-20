var DB, Everyone;

var Otstate = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Otstate;
};

Otstate.get = function(req, res, next) {
  DB.Otstate.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(otstate) {
    res.send(DB.dataToArray(otstate));
  });
};

module.exports = Otstate;

