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
				os.delivery = new Date(os.delivery)
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

	var q = "SELECT sum(otr.employee_hours)+sum(otr.employee_minutes)/60 as hours, c.id, c.name AS client, \
		COUNT(DISTINCT ot.number) as ot_count, \
		COUNT(DISTINCT ott.id) AS ottask_count \
		FROM client c\
		INNER JOIN ot ON c.id = ot.client_id \
		INNER JOIN ottask ott ON ott.ot_id = ot.id \
		LEFT JOIN ottaskresource otr ON otr.ottask_id = ott.id \
		WHERE completed_date >= '"+start+"' AND completed_date <= '"+end+"' \
		GROUP BY c.id ORDER BY ott.created_at";

	console.log(q)

	DB._.query(q, function(err, data) {
		data.forEach(function(t){
			if (t.hours){
				var minutes = Number(t.hours.split('.')[1]) * 60
				t.hours = t.hours.split('.')[0] +':'+ String(minutes)[0]+(String(minutes)[1] ? String(minutes)[1] : 0);
			}
		})
		res.send({data:data});
	});	
}

Otresourcereport.byClientAndOT = function(req, res, next){
	var client_id = req.params.client_id;
	var start = req.params.start;
	var end = req.params.end;

	var q = "SELECT sum(otr.employee_hours)+sum(otr.employee_minutes)/60 as hours, ot.id, ot.number, COUNT(DISTINCT ott.id) as ottask_count, c.name AS client FROM client c \
		INNER JOIN ot ON c.id = ot.client_id \
		INNER JOIN ottask ott ON ott.ot_id = ot.id \
		LEFT JOIN ottaskresource otr ON otr.ottask_id = ott.id \
		LEFT JOIN equipment e ON e.id = ot.equipment_id \
		WHERE c.id = "+client_id+" AND completed_date >= '"+start+"' AND completed_date <= '"+end+"' \
		GROUP BY ot.number ORDER BY ott.created_at";

	console.log(q)

	DB._.query(q, function(err, otstate) {
		otstate.forEach(function(os){
			if (os.hours){
				var minutes = Number(os.hours.split('.')[1]) * 60
				os.hours = os.hours.split('.')[0] +':'+ String(minutes)[0]+(String(minutes)[1] ? String(minutes)[1] : 0);
			}
		})
		res.send({data:otstate});
	});	
}

Otresourcereport.byEmployee = function(req, res, next){
	var start = req.params.start;
	var end = req.params.end;

	var q = "SELECT sum(otr.employee_hours)+sum(otr.employee_minutes)/60 as hours, p.id, p.firstname, p.lastname from ottaskresource otr \
			INNER JOIN employee e ON otr.employee_id = e.id \
			INNER JOIN person p ON e.person_id = p.id \
			WHERE otr.created_at >= '"+start+"' AND otr.created_at <= '"+end+"' \
			GROUP BY e.id";

	console.log(q)

	DB._.query(q, function(err, data){
		data.forEach(function(e){
			e.employee = e.firstname+' '+e.lastname;
			if (e.hours){
				var minutes = Number(e.hours.split('.')[1]) * 60
				e.hours = e.hours.split('.')[0] +':'+ String(minutes)[0]+(String(minutes)[1] ? String(minutes)[1] : 0);
			}
		})
		res.send({data:data});
	});
}

Otresourcereport.byArea = function(req, res, next){
	var start = req.params.start;
	var end = req.params.end;

	var q = "SELECT sum(otr.employee_hours)+sum(otr.employee_minutes)/60 as hours, a.id, a.name as area from ottaskresource otr\
			INNER JOIN employee e ON otr.employee_id = e.id\
			INNER JOIN area a ON e.area_id = a.id\
			WHERE otr.created_at >= '"+start+"' AND otr.created_at <= '"+end+"' \
			GROUP BY a.id";

			console.log(q)

	DB._.query(q, function(err, data){
		data.forEach(function(e){
			if (e.hours){
				var minutes = Number(e.hours.split('.')[1]) * 60
				e.hours = e.hours.split('.')[0] +':'+ String(minutes)[0]+(String(minutes)[1] ? String(minutes)[1] : 0);
			}
		})
		res.send({data:data});
	});
}

Otresourcereport.otTaskReport = function(req, res, next){
	var start = req.params.start;
	var end = req.params.end;
	var filterBy = req.params.filterBy;

	var q = "SELECT sum(otr.employee_hours)+(otr.employee_minutes)/60 as hours, ot.id, ot.number, p.firstname, p.lastname, a.name as area, c.name as client, ot.delivery, ot.created_at, ot.agreedstart, ot.agreedend, ot.conclusion_date, eq.name as equipment, i.name as intervention, pl.name as plan, ot.remitoentrada, ot.remitosalida, ots.name as otstate, ott.name as ottask, ott.priority, ott.due_date, ott.completed, ott.completed_date, ott.reworked, ott.eta, otr.materials_tools from ottaskresource otr\
			INNER JOIN employee e ON otr.employee_id = e.id\
			INNER JOIN person p ON e.person_id = p.id\
			INNER JOIN area a ON e.area_id = a.id\
			INNER JOIN ottask ott ON otr.ottask_id = ott.id\
			INNER JOIN ot ON  ott.ot_id = ot.id\
			INNER JOIN otstate ots ON ot.otstate_id = ots.id\
			INNER JOIN client c ON ot.client_id = c.id\
			LEFT JOIN plan pl on ot.plan_id = pl.id\
			LEFT JOIN equipment eq ON ot.equipment_id = eq.id\
			LEFT JOIN intervention i ON ot.intervention_id = i.id\
			WHERE "+filterBy+" >= '"+start+"' AND "+filterBy+" <= '"+end+"' \
			GROUP BY otr.id";

	console.log(q)

	DB._.query(q, function(err, data){
		data.forEach(function(t){
			if (t.delivery){
				t.delivery = new Date(t.delivery)
				if (!isNaN(t.delivery.getTime())){
					t.delivery = moment(t.delivery).format('DD/MM/YYYY')
				}
				else{
					t.delivery = ''
				}
			}
			else{
				t.delivery = ''
			}	
			if (t.conclusion_date){
				t.conclusion_date = new Date(t.conclusion_date)
				if (!isNaN(t.conclusion_date.getTime())){
					t.conclusion_date = moment(t.conclusion_date).format('DD/MM/YYYY')
				}
				else{
					t.conclusion_date = ''
				}
			}
			else{
				t.conclusion_date = ''
			}
			if (t.agreedstart){
				t.agreedstart = new Date(t.agreedstart)
				if (!isNaN(t.agreedstart.getTime())){
					t.agreedstart = moment(t.agreedstart).format('DD/MM/YYYY')
				}
				else{
					t.agreedstart = ''
				}
			}
			else{
				t.agreedstart = ''
			}
			if (t.agreedend){
				t.agreedend = new Date(t.agreedend)
				if (!isNaN(t.agreedend.getTime())){
					t.agreedend = moment(t.agreedend).format('DD/MM/YYYY')
				}
				else{
					t.agreedend = ''
				}
			}
			else{
				t.agreedend = ''
			}
			if (t.hours){
				var minutes = Number(t.hours.split('.')[1]) * 60
				t.hours = t.hours.split('.')[0] +':'+ String(minutes)[0]+(String(minutes)[1] ? String(minutes)[1] : 0);
			}
			t.employee = t.firstname+' '+t.lastname;
			t.created_at = moment(t.created_at).format('DD/MM/YYYY')
		})
		res.send({data:data})
	})
}

Otresourcereport.materialReport = function(req, res, next){
	var start = req.params.start;
	var end = req.params.end;
	var filterBy = req.params.filterBy;

	var q = "SELECT ot.id, ot.number, c.name as client, ot.delivery, ot.created_at, ot.agreedstart, ot.agreedend, ot.conclusion_date, mo.provider, mo.date, moe.name, moe.quantity, moe.arrived, moe.created_at, mc.name as category, u.name as unit, moe.arrivaldate, p.firstname, p.lastname, mr.created_at, mr.quantity, mr.remito from materialorderelement moe\
			INNER JOIN materialorder mo ON moe.materialorder_id = mo.id\
			INNER JOIN ot ON ot.id = mo.ot_id\
			INNER JOIN client c ON c.id = ot.client_id\
			INNER JOIN materialcategory mc ON mc.id = moe.materialcategory_id\
			INNER JOIN unit u ON moe.unit_id = u.id\
			INNER JOIN materialreception mr ON mr.materialorderelement_id = moe.id\
			INNER JOIN user ON mr.user_id = user.id\
			INNER JOIN employee ON user.employee_id = employee.id\
			INNER JOIN person p ON employee.person_id = p.id\
			WHERE "+filterBy+" >= '"+start+"' AND "+filterBy+" <= '"+end+"' \
			GROUP BY moe.id";
			console.log(q)

	DB._.query(q, function(err, data){
		data.forEach(function(t){
			if (t.delivery){
				t.delivery = new Date(t.delivery)
				if (!isNaN(t.delivery.getTime())){
					t.delivery = moment(t.delivery).format('DD/MM/YYYY')
				}
				else{
					t.delivery = ''
				}
			}
			else{
				t.delivery = ''
			}	
			if (t.conclusion_date){
				t.conclusion_date = new Date(t.conclusion_date)
				if (!isNaN(t.conclusion_date.getTime())){
					t.conclusion_date = moment(t.conclusion_date).format('DD/MM/YYYY')
				}
				else{
					t.conclusion_date = ''
				}
			}
			else{
				t.conclusion_date = ''
			}
			if (t.agreedstart){
				t.agreedstart = new Date(t.agreedstart)
				if (!isNaN(t.agreedstart.getTime())){
					t.agreedstart = moment(t.agreedstart).format('DD/MM/YYYY')
				}
				else{
					t.agreedstart = ''
				}
			}
			else{
				t.agreedstart = ''
			}
			if (t.agreedend){
				t.agreedend = new Date(t.agreedend)
				if (!isNaN(t.agreedend.getTime())){
					t.agreedend = moment(t.agreedend).format('DD/MM/YYYY')
				}
				else{
					t.agreedend = ''
				}
			}
			else{
				t.agreedend = ''
			}
			t.employee = t.firstname+' '+t.lastname;
			t.created_at = moment(t.created_at).format('DD/MM/YYYY')
		})
		res.send({data:data})
	})
}

module.exports = Otresourcereport;

