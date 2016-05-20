var DB, Everyone;

var Errorreport = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Errorreport;
};

Errorreport.get = function(req, res, next) {
  var q = " \
    SELECT er.* \
    FROM errorreport er \
    WHERE er.deleted_at IS NULL \
    ORDER BY er.created_at DESC \
  ";

  DB._.query(q, function(err, errorreports) {
    if (errorreports) {
      res.send({data:errorreports});
    } else {
      res.send(false);
    }
  });
};

Errorreport.post = function(req, res, next) {
  req.body.user = req.session.user_id;

  DB.Errorreport.build(req.body).save().on('success', function(errorreports) {
    res.send(true);
  }).on('error', function(err) {
    res.send(false);
  });
};

Errorreport.put = function(req, res, next) {
  res.send(true);
};

Errorreport.delete = function(req, res, next) {
  DB.Errorreport.find({ where: { id: req.params.id } }).on('success', function(e) {
    e.destroy().on('success', function(e) {
      res.send({ "id": e.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Errorreport;
