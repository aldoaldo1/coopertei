var moment = require('moment');
var DB, Everyone;

var Authorizationhistory = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Authorizationhistory;
};

Authorizationhistory.get = function(req, res, next) {
  var q = " \
    SELECT a.*, ot.number AS ot_number, c.name AS client, o.name AS otstate, u.username, CONCAT(p.lastname, ', ', p.firstname) AS person \
    FROM authorization a \
    INNER JOIN ot ot ON a.ot_id = ot.id \
    INNER JOIN client c ON a.client_id = c.id \
    INNER JOIN otstate o ON a.otstate_id = o.id \
    LEFT JOIN user u ON a.user_id = u.id \
    LEFT JOIN employee e ON u.employee_id = e.id \
    LEFT JOIN person p ON e.person_id = p.id \
    WHERE ot.otstate_id >= 5 AND a.deleted_at IS NULL \
    ORDER BY ot.otstate_id ASC \
  ";

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(a) {
      msg.push({
        "id": a.id,
        "req_info_sent_date": a.req_info_sent_date,
        "ot_number": a.ot_number,
        "ot_id": a.ot_id,
        "client": a.client,
        "client_id": a.client_id,
        "employee": a.person,
        "otstate": a.otstate,
        "otstate_id": a.otstate_id,
        "username": a.username,
        "ip": a.ip,
        "mac": a.mac
      });
    });

    res.send({data:msg});
  });
};

module.exports = Authorizationhistory;
