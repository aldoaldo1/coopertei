var moment = require('moment');
var DB, Everyone;

var Alert = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Alert;
};

Alert.get = function(req, res, next) {
  var q = " \
    SELECT ot.*, e.name AS equipment, c.name AS client, i.name AS intervention \
    FROM ot \
    INNER JOIN equipment e ON ot.equipment_id = e.id \
    INNER JOIN client c ON ot.client_id = c.id \
    INNER JOIN intervention i ON ot.intervention_id = i.id \
    WHERE DATEDIFF(ot.delivery, CURDATE()) < 5 AND ot.deleted_at IS NULL \
    ORDER BY ot.delivery ASC \
  ";

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(ot) {
      var delivery = moment(ot.delivery).format('YYYY-MM-DD'),
          yesterday = moment().subtract('d', 1).format('YYYY-MM-DD'),
          today = moment().format('YYYY-MM-DD'),
          tomorrow = moment().add('d', 1).format('YYYY-MM-DD'),
          fontWeight = "bold", color = "black";

      if (delivery === today) {
        color = "orange";
      } else if (delivery === tomorrow) {
        color = "darkgreen";
      } else if (delivery === yesterday) {
        color = "red";
      }

      msg.push({
        "id": ot.id,
        "number": ot.number,
        "equipment": ot.equipment,
        "delivery": moment(ot.delivery).format('DD/MM/YYYY'),
        "created_at": moment(ot.created_at).format('DD/MM/YYYY'),
        "workshop_suggestion": ot.workshop_suggestion,
        "client_suggestion": ot.client_suggestion,
        "client_id": ot.client_id,
        "client": ot.client,
        "intervention_id": ot.intervention_id,
        "intervention": ot.intervention,
        "plan_id": ot.plan_id,
        "fontWeight": fontWeight,
        "color": color
      });
    });

    res.send({data:msg});
  });
};

module.exports = Alert;
