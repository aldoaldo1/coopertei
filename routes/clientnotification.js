var moment = require('moment');
var DB, Everyone;

var Clientnotification = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Clientnotification;
};

Clientnotification.get = function(req, res, next) {
  var q = " \
    SELECT cn.* \
    FROM clientnotification cn \
    WHERE cn.deleted_at IS NULL \
    ORDER BY cn.created_at DESC \
    LIMIT 50 \
  ";

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(cn) {
      msg.push({
        "id": cn.id,
        "name": cn.name,
        "description": cn.description,
        "related_model": cn.related_model,
        "related_model_id": cn.related_model_id,
        "ot_number": cn.ot_number,
        "client_id": cn.client_id,
        "created_at": moment(new Date(cn.created_at)).format('DD/MM/YYYY')
      });
    });

    res.send(msg);
  });
};

Clientnotification.post = function(req, res, next) {
  DB.Clientnotification.build(req.body).save().on('success', function(clientnotification) {
    res.send({ "id": clientnotification.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Clientnotification.put = function(req, res, next) {
  res.send(true);
};

Clientnotification.delete = function(req, res, next) {
  DB.Clientnotification.find({ where: { id: req.params.id } }).on('success', function(n) {
    n.destroy().on('success', function(n) {
      res.send({ "id": n.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Clientnotification;
