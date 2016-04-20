var DB, Everyone;

var Iva = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Iva;
};

Iva.get = function(req, res, next) {
  DB.Iva.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(ivas) {
    res.send(DB.dataToArray(ivas));
  });
};

module.exports = Iva;

