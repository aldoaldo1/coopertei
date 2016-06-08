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
    res.send({data:DB.dataToArray(materialcategorys)});
  });
};

Materialcategory.post = function(req, res, next) {
  DB.Materialcategory.build({
    name: req.body.name,
    material: ((req.body.material == 'on')? 1 : 0),
    internaldiameter: ((req.body.internaldiameter == 'on')? 1 : 0),
    externaldiameter: ((req.body.externaldiameter == 'on')? 1 : 0),
    width: ((req.body.width == 'on')? 1 : 0),
    height: ((req.body.height == 'on')? 1 : 0),
    thickness: ((req.body.thickness == 'on')? 1 : 0),
    longitude: ((req.body.longitude == 'on')? 1 : 0),
  }).save().on('success', function(materialcategory) {
    res.send({ "id": materialcategory.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Materialcategory.put = function(req, res, next) {
  DB.Materialcategory.find({ where: { id: req.params.id } }).on('success', function(u) {
    if (u) {
      
      delete req.body.created_at;
      delete req.body.updated_at;
      req.body.material = ((req.body.material == 'on')? 1 : 0);
      req.body.internaldiameter = ((req.body.internaldiameter == 'on')? 1 : 0);
      req.body.externaldiameter = ((req.body.externaldiameter == 'on')? 1 : 0);
      req.body.width = ((req.body.width == 'on')? 1 : 0);
      req.body.height = ((req.body.height == 'on')? 1 : 0);
      req.body.thickness = ((req.body.thickness == 'on')? 1 : 0);
      req.body.longitude = ((req.body.longitude == 'on')? 1 : 0);
      u.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Materialcategory.getProperties = function(req, res, next){
  DB.Materialcategory.find({where: {id: req.params.id}}).on('success', function(result){
    res.send(result)
  })
},

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

