var moment = require('moment');
var DB, Everyone;

var Otstatereport = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Otstatereport;
};

Otstatereport.get = function(req, res, next) {
	var q = 'SELECT ot.id, ot.number, ot.reworked_number AS reworked, ot.created_at AS reception, ot.delivery, e.name AS equipment, i.name AS intervention, c.name AS client, os.name AS state, p.name AS plan, os.name AS otstate FROM ot \
		INNER JOIN intervention i ON i.id = ot.intervention_id \
		INNER JOIN equipment e ON e.id = ot.equipment_id \
		INNER JOIN client c ON c.id = ot.client_id \
		INNER JOIN otstate os ON os.id = otstate_id \
		INNER JOIN plan p ON p.id = ot.plan_id \
		ORDER BY ot.otstate_id DESC';
	DB._.query(q, function(err, otstate) {
		otstate.forEach(function(os){
			os.reception ? os.reception = moment(os.reception).format('DD/MM/YYYY') : '';
			if (os.delivery){
				if (!isNaN(os.delivery.getTime())){
					os.delivery = moment(os.delivery).format('DD/MM/YYYY')
				}
				else{
					os.delivery = ''
				}
			}
			else{
				os.delivery = ''
			}
		})
		res.send({data:otstate});
	});
};

Otstatereport.byState = function(req, res, next){
	var otstate_id = req.params.otstate_id
	console.log(otstate_id);
	var q = 'SELECT ot.id, ot.number, ot.reworked_number AS reworked, ot.created_at AS reception, ot.delivery, e.name AS equipment, i.name AS intervention, c.name AS client, os.name AS state, p.name AS plan, os.name AS otstate FROM ot \
		INNER JOIN intervention i ON i.id = ot.intervention_id \
		INNER JOIN equipment e ON e.id = ot.equipment_id \
		INNER JOIN client c ON c.id = ot.client_id \
		INNER JOIN otstate os ON os.id = otstate_id \
		INNER JOIN plan p ON p.id = ot.plan_id \
		WHERE otstate_id = '+otstate_id+' \
		ORDER BY ot.otstate_id DESC';
	DB._.query(q, function(err, otstate) {
		otstate.forEach(function(os){
			os.reception = moment(os.reception).format('DD/MM/YYYY');
			if (os.delivery){
				if (!isNaN(os.delivery.getTime())){
					os.delivery = moment(os.delivery).format('DD/MM/YYYY')
				}
				else{
					os.delivery = ''
				}
			}
			else{
				os.delivery = ''
			}
		})
		res.send({data:otstate});
	});	
}

module.exports = Otstatereport;

