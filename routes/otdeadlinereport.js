var moment = require('moment');
var DB, Everyone;

var Otdeadlinereport = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Otdeadlinereport;
};

Otdeadlinereport.get = function(req, res, next) {
	var q = 'SELECT ot.id, ot.number, ot.reworked_number AS reworked, ot.created_at AS reception, ot.delivery, e.name AS equipment, i.name AS intervention, c.name AS client, os.name AS state, p.name AS plan, os.name AS otstate FROM ot \
 		INNER JOIN intervention i ON i.id = ot.intervention_id \
		INNER JOIN equipment e ON e.id = ot.equipment_id \
		INNER JOIN client c ON c.id = ot.client_id \
		INNER JOIN otstate os ON os.id = otstate_id \
		INNER JOIN plan p ON p.id = ot.plan_id \
		ORDER BY ot.otstate_id DESC';
	DB._.query(q, function(err, ots) {
		ots.forEach(function(os){
			os.reception ? os.reception = moment(os.reception).format('DD/MM/YYYY') : '';
			if (os.delivery){
				os.delivery = new Date(os.delivery);
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
		res.send({data:ots});
	});
};

Otdeadlinereport.betweenDates = function(req, res, next){
	var start = req.params.start,
		end = req.params.end;
	console.log(start, end)
	var q = "SELECT ot.id, ot.number, ot.created_at AS reception, i.name as intervention, p.name as plan, ots.name as otstate, ot.reworked_number as reworked, e.name AS equipment, c.name AS client, ott.name AS ottask, ott.completed_date AS completed, ott.due_date AS delivery FROM ottask ott \
		INNER JOIN ot ON ott.ot_id = ot.id  \
		INNER JOIN equipment e ON e.id = ot.equipment_id \
		INNER JOIN client c ON c.id = ot.client_id \
		INNER JOIN otstate ots ON ot.otstate_id = ots.id\
		LEFT JOIN intervention i ON ot.intervention_id = i.id\
		LEFT JOIN plan p ON ot.plan_id = p.id\
		WHERE due_date >= '"+start+"' AND due_date <= '"+end+"' \
		ORDER BY ott.created_at"; 

	console.log(q)

	DB._.query(q, function(err, ots) {
		ots.forEach(function(os){
			console.log(os.delivery, start)
			console.log(start < os.delivery)
			os.delivery = moment(os.delivery).format('DD/MM/YYYY');
			if (os.completed){
				os.completed = new Date(os.completed)
				if (!isNaN(os.completed.getTime())){
					os.completed = moment(os.completed).format('DD/MM/YYYY')
				}
				else{
					os.completed = ''
				}
			}
			else{
				os.completed = ''
			}
		})
		res.send({data:ots});
	});		
}

module.exports = Otdeadlinereport;

