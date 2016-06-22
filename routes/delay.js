var DB, Everyone;

var Delay = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Delay;
};

Delay.get = function(req, res, next) {
  DB.Delay.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(delays) {
    res.send({data:DB.dataToArray(delays)});
  });
};

Delay.post = function(req, res, next) {
  DB.Delay.build({
    reason: req.body.reason,
  }).save().on('success', function(delay) {
    res.send(delay);
  }).on('error', function(err) {
    res.send(false);
  });
};

Delay.put = function(req, res, next) {
  DB.Delay.find({ where: { id: req.params.id } }).on('success', function(e) {
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

Delay.delete = function(req, res, next) {
  DB.Delay.find({ where: { id: req.params.id } }).on('success', function(mc) {
    mc.destroy().on('success', function(mc) {
      res.send({ "id": mc.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Delay;
