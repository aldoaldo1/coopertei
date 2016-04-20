var DB, Everyone;

var Materialcategory = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Materialcategory;
};

Materialcategory.get = function(req, res, next) {
  DB.Materialcategory.findAll({
    where: ["deleted_at IS NULL"],
    order: "name ASC"
  }).on('success', function(materialcategorys) {
    res.send(DB.dataToArray(materialcategorys));
  });
};

Materialcategory.post = function(req, res, next) {
  DB.Materialcategory.build({
    name: req.body.name
  }).save().on('success', function(materialcategory) {
    res.send({ "id": materialcategory.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Materialcategory.put = function(req, res, next) {
  DB.Materialcategory.find({ where: { id: req.body.id } }).on('success', function(u) {
    if (u) {
      req.body.created_at = DB.toMySqlDate(req.body.created_at.substr(0, 10));
      req.body.updated_at = DB.toMySqlDate(req.body.updated_at.substr(0, 10));
      
      u.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Materialcategory.delete = function(req, res, next) {
  DB.Materialcategory.find({ where: { id: req.params.id } }).on('success', function(mc) {
    mc.destroy().on('success', function(mc) {
      res.send({ "id": mc.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Materialcategory;

