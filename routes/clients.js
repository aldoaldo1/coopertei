var moment = require('moment'),
    async = require('async');
var DB, Everyone;

var Clients = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Clients;
};

Clients.getOts = function(req, res, next) {
  DB.Client.find({ where: { user_id: req.session.user_id } }).on('success', function(c) {
    if (c) {
      var q = " \
        SELECT ot.*, c.name AS client, e.name AS equipment, i.name AS intervention, \
               p.name AS plan, s.name AS state \
        FROM ot \
        LEFT JOIN client c ON ot.client_id = c.id \
        LEFT JOIN equipment e ON ot.equipment_id = e.id \
        LEFT JOIN intervention i ON ot.intervention_id = i.id \
        LEFT JOIN plan p ON ot.plan_id = p.id \
        LEFT JOIN otstate s ON ot.otstate_id = s.id \
        WHERE c.id = " + c.id + " AND ot.otstate_id <> 6 AND ot.deleted_at IS NULL \
        ORDER BY ot.delivery ASC";
      DB._.query(q, function(err, data) {
        var msg = [];
	moment
        data.forEach(function(ot) {
          msg.push({
            "id": ot.id,
            "number": ot.number,
            "equipment_id": ot.equipment_id,
            "equipment": ot.equipment,
            "delivery": ot.delivery ? moment(ot.delivery).format('DD/MM/YYYY') : null,
            "created_at": moment(ot.created_at).format('DD/MM/YYYY'),
            "workshop_suggestion": ot.workshop_suggestion,
            "client_suggestion": ot.client_suggestion,
            "client_id": ot.client_id,
            "client": ot.client,
            "intervention_id": ot.intervention_id,
            "intervention": ot.intervention,
            "plan_id": ot.plan_id,
            "plan": ot.plan,
            "reworked_number": ot.reworked_number,
            "otstate_id": ot.otstate_id,
            "state": ot.state,
            "actions": null
          });
        });

        res.send(msg);
      });
    } else {
      res.send([]);
    }
  }).on('error', function(error) {
    res.send({ result: false, error: error });
  });
};

Clients.getEvents = function(req, res, next) {
  var q1 = " \
    SELECT * \
    FROM ottask \
    WHERE ot_id = " + req.params.ot_id + " AND deleted_at IS NULL \
  ";

  DB._.query(q1, function(err, tasks) {
    var q2 = "SELECT * FROM ot WHERE id = " + req.params.ot_id;

    DB._.query(q2, function(err, ot) {
      res.send({
        ot: ot,
        tasks: tasks
      });
    });
  });
};

Clients.authorizeOt = function(req, res, next) {
  DB.Ot.find({ where: { id: req.params.ot_id } }).on('success', function(ot) {
    if (ot) {
      ot.otstate_id = 5;

      ot.updateAttributes(ot).on('success', function() {
        DB.Authorization.find({ where: { ot_id: ot.id } }).on('success', function(a) {
          a.updateAttributes({ otstate_id: 5 }).on('success', function() {
            res.send(true);
          });
        });
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

module.exports = Clients;
