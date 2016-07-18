var DB, Everyone;

var Otstatereport = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Otstatereport;
};

Otstatereport.get = function(req, res, next) {
	q = 'SELECT ot.*, i.name, c.name, os.name, p.name FROM ot \
		INNER JOIN intervention i ON i.id = ot.intervention_id \
		INNER JOIN client c ON c.id = ot.client_id \
		INNER JOIN otstate os ON os.id = otstate_id \
		INNER JOIN plan p ON p.id = ot.plan_id \
		ORDER BY ot.otstate_id DESC';
	console.log(q)
  DB._.query(q, function(err, otstate) {
    res.send({data:otstate});
  });
};

module.exports = Otstatereport;

