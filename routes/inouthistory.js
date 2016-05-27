var DB, Everyone;

var Inouthistory = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Inouthistory;
};

Inouthistory.get = function(req, res, next) {
  var q = " \
    SELECT io.*, e.id AS employee_id, \
           CONCAT(p.lastname, ', ', p.firstname) AS employee \
    FROM `inout` io \
    LEFT JOIN employee e ON io.employee_id = e.id \
    LEFT JOIN person p ON e.person_id = p.id \
    WHERE io.comeback IS NOT NULL AND io.deleted_at IS NULL \
    ORDER BY io.out ASC \
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
        "comeback": io.comeback
      });
    });
    
    res.send({data:msg});
  });
};

module.exports = Inouthistory;

