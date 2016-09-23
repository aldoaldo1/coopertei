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
        SELECT ot.*, c.name AS client, e.name AS equipment, i.name AS intervention, s.name as otstate\
        FROM ot \
        LEFT JOIN client c ON ot.client_id = c.id \
        LEFT JOIN equipment e ON ot.equipment_id = e.id \
        LEFT JOIN intervention i ON ot.intervention_id = i.id \
        LEFT JOIN otstate s ON ot.otstate_id = s.id \
        WHERE c.id = " + c.id + " AND (ot.otstate_id <> 6 OR conclusion_date > DATE_SUB(NOW(), INTERVAL 7 DAY)) AND ot.deleted_at IS NULL \
        ORDER BY ot.delivery ASC";
      console.log(q)
      DB._.query(q, function(err, data) {
        var msg = [];
	moment
        data.forEach(function(ot) {
          
          msg.push({
            "id": ot.id,
            "number": ot.number,
            "ot_client": ot.client_number,
            "equipment": ot.equipment,
            "intervention": ot.intervention,
            "otstate": ot.otstate,
            "otstate_id": ot.otstate_id,
            "agreedstart": ot.agreedstart ? moment(ot.agreedstart).format('DD/MM/YYYY') : 'Sin definir',
            "agreedend": ot.agreedend ? moment(ot.agreedend).format('DD/MM/YYYY') : 'Sin definir',
            "ready": ot.ready ? moment(ot.ready).format('DD/MM/YYYY') : 'Sin definir',
            "accion": null,
            "showtimeline": ot.showtimeline
          });
        });

        res.send({data:msg});
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

module.exports = Clients;
