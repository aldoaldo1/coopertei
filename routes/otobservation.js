var DB, Everyone;
var moment = require('moment');

var Otobservation = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Otobservation;
};

Otobservation.byOt = function(req, res, next) {
  	var ot_id = req.params.ot_id;
  	var q = "SELECT o.*, CONCAT(p.lastname, ', ', p.firstname) as person FROM otobservation o \
  		LEFT JOIN user u ON o.user_id = u.id \
  		LEFT JOIN employee e ON e.id = u.employee_id \
  		LEFT JOIN person p ON p.id = e.person_id \
  		WHERE o.ot_id = "+ot_id+" AND o.deleted_at IS NULL";

	console.log(q);

  	DB._.query(q, function(err, data){
  		res.send(data);
  	})
};

Otobservation.byId = function(req, res, next) {
  	var id = req.params.id;
  	var q = "SELECT o.*, CONCAT(p.lastname, ', ', p.firstname) as person, c.name as client FROM otobservation o \
  		INNER JOIN ot ON o.ot_id = ot.id \
  		INNER JOIN client c ON ot.client_id = c.id \
  		LEFT JOIN user u ON o.user_id = u.id \
  		LEFT JOIN employee e ON e.id = u.employee_id \
  		LEFT JOIN person p ON p.id = e.person_id \
  		WHERE o.id = "+id+" AND o.deleted_at IS NULL";

	console.log(q);

  	DB._.query(q, function(err, data){
  		res.send(data[0]);
  	})
};

Otobservation.put = function(req, res, next) {
  DB.Otobservation.find({ where: { id: req.params.id } }).on('success', function(p) {
    if (p) {
    	console.log(req.body)
      //delete username;
      //delete req.body.created_at;
      delete req.body.updated_at;
      var x = req.body.created_at
	  req.body.created_at = x[6]+x[7]+x[8]+x[9]+'-'+x[3]+x[4]+'-'+x[0]+x[1]
      

      p.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Otobservation.delete = function(req, res, next) {
  DB.Otobservation.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(p) {
      res.send({ "id": p.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Otobservation;

