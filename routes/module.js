var DB, Everyone;

var Module = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Module;
};

Module.get = function(req, res, next) {
  DB.Module.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(modules) {
    res.send(DB.dataToArray(modules));
  });
};

module.exports = Module;
