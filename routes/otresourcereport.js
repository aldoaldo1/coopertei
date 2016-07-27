var moment = require('moment');
var DB, Everyone;

var Otresourcereport = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Otresourcereport;
};

Otresourcereport.get = function(req, res, next) {
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

Otresourcereport.byClient = function(req, res, next){
	var start = req.params.start;
	var end = req.params.end;

	var q = "SELECT sum(otr.employee_hours)+sum(otr.employee_minutes)/60 as hours, c.name AS client, COUNT(ott.id), (SELECT COUNT(*) FROM ot WHERE client_id = c.id AND completed_date >= '"+start+"' AND completed_date <= '"+end+"') AS ot_count FROM client c\
		INNER JOIN ot ON c.id = ot.client_id \
		INNER JOIN ottask ott ON ott.ot_id = ot.id \
		LEFT JOIN ottaskresource otr ON otr.ottask_id = ott.id \
		WHERE completed_date >= '"+start+"' AND completed_date <= '"+end+"' \
		GROUP BY c.id ORDER BY ott.created_at";

	console.log(q)

	DB._.query(q, function(err, otstate) {
		otstate.forEach(function(os){
			if (os.delivery){
				if (!isNaN(os.delivery.getTime())){
					os.delivery = moment(os.delivery).format('DD/MM/YYYY')
				}
				else{
					os.delivery = ''
				}
			}
			else{
				os.delivery	 = ''
			}
			if (os.reception){
				if (!isNaN(os.reception.getTime())){
					os.reception = moment(os.reception).format('DD/MM/YYYY')
				}
				else{
					os.reception = ''
				}
			}
			else{
				os.reception = ''
			}
		})
		res.send({data:otstate});
	});	
}

Otresourcereport.byClientAndOT = function(req, res, next){
	var client_id = req.params.client_id;
	var ot_id = req.params.ot_id;
	var start = req.params.start;
	var end = req.params.end;

	var q = "SELECT sum(otr.employee_hours)+sum(otr.employee_minutes)/60 as hours, ot.id, ot.number, ot.created_at AS reception, e.name AS equipment, c.name AS client, ott.name AS ottask, ott.completed_date AS completed, ott.due_date AS delivery FROM client c\
		INNER JOIN ot ON c.id = ot.client_id \
		INNER JOIN ottask ott ON ott.ot_id = ot.id \
		LEFT JOIN ottaskresource otr ON otr.ottask_id = ott.id \
		LEFT JOIN equipment e ON e.id = ot.equipment_id \
		WHERE c.id = "+client_id+" AND ot.id = "+ot_id+" AND completed_date >= '"+start+"' AND completed_date <= '"+end+"' \
		ORDER BY ott.created_at GROUP BY ott.name";

	console.log(q)

	DB._.query(q, function(err, otstate) {
		otstate.forEach(function(os){
			if (os.delivery){
				if (!isNaN(os.delivery.getTime())){
					os.delivery = moment(os.delivery).format('DD/MM/YYYY')
				}
				else{
					os.delivery = ''
				}
			}
			else{
				os.delivery	 = ''
			}
			if (os.reception){
				if (!isNaN(os.reception.getTime())){
					os.reception = moment(os.reception).format('DD/MM/YYYY')
				}
				else{
					os.reception = ''
				}
			}
			else{
				os.reception = ''
			}
		})
		res.send({data:otstate});
	});	
}

module.exports = Otresourcereport;