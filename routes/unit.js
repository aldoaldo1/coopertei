var DB, Everyone;

var Unit = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Unit;
};

Unit.get = function(req, res, next) {
  DB.Unit.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(units) {
    res.send(DB.dataToArray(units));
  });
};

module.exports = Unit;

