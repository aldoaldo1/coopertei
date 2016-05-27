var DB, Everyone;

var Equipment = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Equipment;
};

Equipment.get = function(req, res, next) {
  var q = " \
    SELECT e.*, i.id AS intervention_id, i.name AS intervention, \
           c.id AS client_id, c.name AS client \
    FROM equipment e \
    INNER JOIN intervention i ON e.intervention_id = i.id \
    INNER JOIN client c ON e.client_id = c.id \
    WHERE e.deleted_at IS NULL \
  ";

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(e) {
      msg.push({
        "id": e.id,
        "name": e.name,
        "intervention": e.intervention,
        "intervention_id": e.intervention_id,
        "client": e.client,
        "client_id": e.client_id
      });
    });

    res.send({data:msg});
  });
};

Equipment.post = function(req, res, next) {
  DB.Equipment.build({
    name: req.body.name,
    intervention_id: req.body.intervention_id,
    client_id: req.body.client_id
  }).save().on('success', function(equipment) {
    res.send({ "id": equipment.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Equipment.put = function(req, res, next) {
  DB.Equipment.find({ where: { id: req.body.id } }).on('success', function(e) {
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

Equipment.delete = function(req, res, next) {
  DB.Equipment.find({ where: { id: req.params.id } }).on('success', function(mc) {
    mc.destroy().on('success', function(mc) {
      res.send({ "id": mc.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Equipment;
