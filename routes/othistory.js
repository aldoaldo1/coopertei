var moment = require('moment');
var DB, Everyone;

var Othistory = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Othistory;
};

Othistory.get = function(req, res, next) {
  var q = " \
    SELECT ot.*, c.name AS client, e.name AS equipment, i.name AS intervention, \
           p.name AS plan, s.name AS state \
    FROM ot \
    LEFT JOIN client c ON ot.client_id = c.id \
    LEFT JOIN equipment e ON ot.equipment_id = e.id \
    LEFT JOIN intervention i ON ot.intervention_id = i.id \
    LEFT JOIN plan p ON ot.plan_id = p.id \
    LEFT JOIN otstate s ON ot.otstate_id = s.id \
    WHERE otstate_id >= 6 AND ot.deleted_at IS NULL \ \
    ORDER BY ot.delivery ASC"; 				

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(ot) {
    var a;
      if((ot.delivery != '0000-00-00 00:00:00') && (ot.delivery) ){
        a=moment(ot.delivery).format('DD/MM/YYYY')
        if((a ==  "NaN/NaN/NaN") || (a ==  NaN/NaN/NaN))
          a = "SIN CARGAR";
      }else
        a= "SIN CARGAR";
      msg.push({
        "id": ot.id,
        "number": ot.number,
	      "remitoentrada": ot.remitoentrada,
	      "remitosalida": ot.remitosalida,
        "client_number": ot.client_number,
        "equipment_id": ot.equipment_id,
        "equipment": ot.equipment,
        "delivery": a,
        "created_at": moment(ot.created_at).format('DD/MM/YYYY'),
        "salida": moment(ot.updated_at).format('DD/MM/YYYY'),
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
        "state": ot.state
      });
    });
    res.send(msg);
  });
};

module.exports = Othistory;
