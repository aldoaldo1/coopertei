var DB, Everyone;

var City = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return City;
};

City.get = function(req, res, next) {
  DB.City.findAll({
    where: ["deleted_at IS NULL"],
    order: "name ASC"
  }).on('success', function(citys) {
    res.send(DB.dataToArray(citys));
  });
};

module.exports = City;

