var moment = require('moment');
var DB, Everyone;

var Otconcludereport = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Otconcludereport;
};

Otconcludereport.get = function(req, res, next) {
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

Otconcludereport.betweenDates = function(req, res, next){
	var start = req.params.start,
		end = req.params.end;
	console.log(req.params)

	var where = "WHERE conclusion_date >= '"+start+"' AND conclusion_date <= '"+end+"'";
	if (req.params.client != 0){
		where += " AND ot.client_id = "+req.params.client;	
	}
	if (req.params.tag != 0){
		where += " AND ot.equipment_id = "+req.params.tag;
	}
	if (req.params.rework != 0){
		where += " AND ot.reworked_number = "+req.params.rework;
	}


	var q = "SELECT ot.id, ot.number, ot.reworked_number AS reworked, ot.created_at AS reception, ot.delivery, ot.conclusion_date, e.name AS equipment, i.name AS intervention, c.name AS client, os.name AS state, p.name AS plan, os.name AS otstate FROM ot \
		LEFT JOIN intervention i ON i.id = ot.intervention_id \
		LEFT JOIN equipment e ON e.id = ot.equipment_id \
		LEFT JOIN client c ON c.id = ot.client_id \
		LEFT JOIN otstate os ON os.id = otstate_id \
		LEFT JOIN plan p ON p.id = ot.plan_id \
		"+where+" \
		ORDER BY conclusion_date DESC";

	console.log(q)

	DB._.query(q, function(err, ots) {
		ots.forEach(function(os){
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
			if (os.conclusion_date){
				if (!isNaN(os.conclusion_date.getTime())){
					os.conclusion_date = moment(os.conclusion_date).format('DD/MM/YYYY')
				}
				else{
					os.conclusion_date = ''
				}
			}
			else{
				os.conclusion_date = ''
			}
		})
		res.send({data:ots});
	});	
}

module.exports = Otconcludereport;

