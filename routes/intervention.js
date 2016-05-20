var DB, Everyone;

var Intervention = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Intervention;
};

Intervention.get = function(req, res, next) {
  DB.Intervention.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(interventions) {
    res.send({data:DB.dataToArray(interventions)});
  });
};

Intervention.post = function(req, res, next) {
  DB.Intervention.build({
    name: req.body.name,
    description: req.body.description
  }).save().on('success', function(equipment) {
    res.send({ "id": equipment.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Intervention.put = function(req, res, next) {
  DB.Intervention.find({ where: { id: req.body.id } }).on('success', function(e) {
    if (e) {
      delete req.body.created_at;
      delete req.body.updated_at;

      e.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Intervention.delete = function(req, res, next) {
  DB.Intervention.find({ where: { id: req.params.id } }).on('success', function(mc) {
    mc.destroy().on('success', function(mc) {
      res.send({ "id": mc.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Intervention;
