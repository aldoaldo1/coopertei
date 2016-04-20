var DB, Everyone;

var Area = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Area;
};

Area.get = function(req, res, next) {
  DB.Area.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(areas) {
    res.send(DB.dataToArray(areas));
  });
};

module.exports = Area;

