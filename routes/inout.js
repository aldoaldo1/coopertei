var moment = require('moment');
var DB, Everyone;

var Inout = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Inout;
};

Inout.get = function(req, res, next) {
  var q = " \
    SELECT io.*, e.id AS employee_id, \
           CONCAT(p.lastname, ', ', p.firstname) AS employee \
    FROM `inout` io \
    LEFT JOIN employee e ON io.employee_id = e.id \
    LEFT JOIN person p ON e.person_id = p.id \
    WHERE io.deleted_at IS NULL AND io.comeback IS NULL \
    ORDER BY io.authorized ASC \
  ";

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(io) {
      msg.push({
        "id": io.id,
        "employee_id": io.employee_id,
        "employee": io.employee,
        "authorized": io.authorized,
        "out": io.out,
        "comeback": io.comeback,
        "permitted": io.permitted
      });
    });

    res.send(msg);
  });
};

Inout.post = function(req, res, next) {
  var permitted;

  if (req.body.permitted == 1) {
    permitted = req.body.permitted;
  } else {
    permitted = 0;
  }

  DB.Inout.build({
    "employee_id": req.body.employee_id,
    "authorized": req.body.authorized,
    "permitted": permitted
  }).save().on('success', function(inout) {
    // Send the news
    DB.News.build({
      name: 'Nueva Autorizaci&oacute;n de Salida',
      description: null,
      related_model: 'inout',
      related_model_id: inout.id
    }).save();

    res.send({ "id": inout.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Inout.registerOut = function(req, res, next) {
  var whereClause = { where: { id: req.params.id } },
      now = moment().format('DD/MM/YYYY - HH:mm');

  DB.Inout.find(whereClause).on('success', function(i) {
    if (i) {
      i.updateAttributes({
        out: now
      }).on('success', function() {
        res.send(now);
      }).on('error', function(err) {
        res.send(err);
      });
    }
  });
};

Inout.registerComeback = function(req, res, next) {
  var whereClause = { where: { id: req.params.id } },
      now = moment().format('DD/MM/YYYY - HH:mm');

  DB.Inout.find(whereClause).on('success', function(i) {
    if (i) {
      i.updateAttributes({
        comeback: now
      }).on('success', function() {
        res.send(now);
      }).on('error', function(err) {
        res.send(err);
      });
    }
  });
};

Inout.put = function(req, res, next) {
  DB.Inout.find({ where: { id: req.body.id } }).on('success', function(e) {
    if (e) {
      e.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Inout.delete = function(req, res, next) {
  DB.Inout.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(e) {
      res.send({ "id": e.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Inout;
