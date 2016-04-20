var moment = require('moment');
var DB, Everyone;

var Alerttask = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Alerttask;
};

Alerttask.get = function(req, res, next) {
  var q = " \
    SELECT ott.*, ot.number AS number, \
           e.name AS equipment, c.name AS client, i.name AS intervention \
    FROM ottask ott \
    INNER JOIN ot ON ott.ot_id = ot.id \
    INNER JOIN equipment e ON ot.equipment_id = e.id \
    INNER JOIN client c ON ot.client_id = c.id \
    INNER JOIN intervention i ON ot.intervention_id = i.id \
    WHERE DATEDIFF(ott.due_date, CURDATE()) < 5 AND ott.deleted_at IS NULL \
    AND ott.area_id = " + req.session.area_id + " \
    ORDER BY ott.due_date ASC \
  ";

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(ott) {
      var due_date = moment(ott.due_date).format('YYYY-MM-DD'),
          yesterday = moment().subtract('d', 1).format('YYYY-MM-DD'),
          today = moment().format('YYYY-MM-DD'),
          tomorrow = moment().add('d', 1).format('YYYY-MM-DD'),
          fontWeight = "bold", color = "black";

      if (due_date === today) {
        color = "orange";
      } else if (due_date === tomorrow) {
        color = "darkgreen";
      } else if (due_date === yesterday) {
        color = "red";
      }

      msg.push({
        "id": ott.id,
        "number": ott.number,
        "name": ott.name,
        "description": ott.description,
        "equipment": ott.equipment,
        "due_date": moment(ott.due_date).format('DD/MM/YYYY'),
        "created_at": moment(ott.created_at).format('DD/MM/YYYY'),
        "workshop_suggestion": ott.workshop_suggestion,
        "client_suggestion": ott.client_suggestion,
        "client_id": ott.client_id,
        "client": ott.client,
        "intervention_id": ott.intervention_id,
        "intervention": ott.intervention,
        "plan_id": ott.plan_id,
        "fontWeight": fontWeight,
        "color": color
      });
    });

    res.send(msg);
  });
};

module.exports = Alerttask;
