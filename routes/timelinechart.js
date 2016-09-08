var moment = require('moment');
var DB, Everyone;

var Timelinechart = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Timelinechart;
};

Timelinechart.get = function(req, res, next) {
	var ot_id = req.params.ot_id
	var startDay;
	var data = [];
	var query = 'SELECT ott.*, otr.id as worked FROM ottask ott\
				LEFT JOIN ottaskresource otr ON otr.ottask_id = ott.id\
				WHERE ott.ot_id = '+ot_id+'\
				GROUP BY ott.id ORDER BY priority ASC';
				console.log(query)
	DB._.query(query, function(err, tasks){
	//DB.Ottask.findAll({where: {ot_id : ot_id}, order:[['priority ASC',]]}).on('success', function(tasks){
		DB.Ot.find({where: {id: ot_id}}).on('success', function(ot){
			if (ot.agreedstart) {
				startDay = new Date(ot.agreedstart);
				data.push([
					moment(startDay).format('YYYY/MM/DD'),
					null,
					'Inicio Pactado',
					'milestone'
				]);
			}else{
				startDay= new Date(ot.created_at);
				data.push([
					moment(startDay).format('YYYY/MM/DD'),
					null,
					'Fecha de inauguración',
					'milestone'
				])
			};
			if(ot.agreedend){
				data.push([
					moment(ot.agreedend).format('YYYY/MM/DD'),
					null,
					'Entrega pactada',
					'milestone'
				])
			}
			if(ot.conclusion_date){
				data.push([
					moment(ot.conclusion_date).format('YYYY/MM/DD'),
					null,
					'Entrega/Retiro',
					'milestone'
				])
			}
			var priority = 0;
			var max_due_date = startDay;
			var max_completed_date = startDay;
			var totalDelay = 0;
			var currentDelay = 0;
			var due_date, completed_date;
			var priority_completed = true;
			var uncompleted_count = 0;
			tasks.forEach(function(task){
				console.log(task.priority, task.worked)
				var taskclass = '';
				due_date = addDays(task.due_date, totalDelay);
				completed_date = new Date(task.completed_date);
				currentDelay = 0;
				if (task.priority != 1){
					//Aqui se produce la iteracion al comienzo de cada etapa
					if (task.priority != priority){
						if (priority_completed){
							last_completed = priority
						}else{
							uncompleted_count++;
						}
						startDay = addDays(new Date(), 1)
						if (priority_completed){
							startDay = addDays(max_due_date, 1);
							if (max_completed_date > max_due_date){
								startDay = addDays(max_completed_date, 1)
							}
						}
						else {
							if (uncompleted_count >= 2){
								startDay = addDays(max_due_date, 1);
							}	
							if (uncompleted_count && max_due_date < new Date()){
								startDay = addDays(new Date(), 1);
							}
							else{
								startDay = addDays(max_due_date, 1);
							}
						}
						if (max_completed_date > max_due_date && priority_completed){
							console.log(max_due_date)
							currentDelay = diffBetweenDates(max_completed_date, max_due_date)
							totalDelay += currentDelay
							data.push([
								moment(addDays(max_due_date, 1)).format('YYYY/MM/DD'),
								moment(addDays(max_due_date, currentDelay + 1)).format('YYYY/MM/DD'), 
								'Demora etapa '+priority, 
								'exceeded',
							])
						}
						if(!priority_completed && max_due_date < new Date()){
							currentDelay = diffBetweenDates(new Date(), max_due_date);
							totalDelay += currentDelay
							data.push([
								moment(addDays(max_due_date, 1)).format('YYYY/MM/DD'),
								'now', 
								'Demora etapa '+priority,
								'exceeded'
							])
						}
						priority_completed = task.completed;
					}
					else{
						
					}
				}
				else{
					due_date = new Date(task.due_date)	
				}
				if (due_date == null){
					due_date = moment(startDay).add('days', task.eta)
				}
				if (task.completed){
					taskclass = 'completed';
				}
				else{
					if (uncompleted_count == 0 && task.worked != null){
						taskclass = 'in_progress'
					}
				}
				if(task.materials_missing){
					taskclass = 'materials_missing'
				}
				var task_delay = totalDelay + 1;
				if (task.eta > 0) {
					data.push([moment(startDay).format('YYYY/MM/DD'), moment(addDays(task.due_date, task_delay)).format('YYYY/MM/DD'), task.name, taskclass]);
				}else{
					data.push([moment(startDay).format('YYYY/MM/DD'), null, task.name, taskclass]);
				};
				//Actualizo valores
				console.log(max_due_date, currentDelay)
				max_due_date = addDays(max_due_date, currentDelay)
				if (addDays(due_date, currentDelay) > max_due_date){
					max_due_date = addDays(due_date, currentDelay); 
				}
				if (completed_date > max_completed_date){
					max_completed_date = completed_date;
				}
				if (!task.completed){
					priority_completed = false;
				}
				if(task.completed){
					last_completed = task.priority;
				}
				priority = task.priority;
			})
			DB.Ottask.findAll({where: {ot_id: ot_id, completed: 0, deleted_at: null}}).on('success', function(completed){
				if(completed.length == 0){
					data.push([
						moment(addDays(max_due_date, 1)).format('YYYY/MM/DD'),
						null,
						'Terminado',
						'milestone'
					])
				}
				if(req.session.role_id == 6){
					DB.Client.find({where: {user_id: req.session.user_id}}).on('success', function(c){
						if (ot.client_id == c.id){
							res.send(data)
						}
						else{
							res.send(false);
						}
					})
				}
				else{
					res.send(data);
				}
			})
		})
	})

};

diffBetweenDates = function(from, to){
	from = new Date(from);
	to = new Date(to);
	var diff = from.getTime() - to.getTime();
	return Math.round(diff/(1000 * 60 * 60 * 24));
}
addDays = function(date, days){
	date = new Date(date);
	date.setDate(date.getDate() + days);
	return date;
}
Timelinechart.delays = function(req, res, next){
	ot_id = req.params.ot_id;
	q = 'SELECT od.observation, od.delay, d.reason FROM otdelay od\
		INNER JOIN delay d ON od.delay_id = d.id\
		WHERE od.ot_id = '+ot_id;
	DB._.query(q, function(err, data){
		DB.Ot.find({where: {id: ot_id}}).on('success', function(ot){
			if(ot){
				if(req.session.role_id == 6){
					DB.Client.find({where: {user_id: req.session.user_id}}).on('success', function(c){
						if (ot.client_id == c.id){
							res.send(data)
						}
						else{
							res.send(false);
						}
					})
				}
				else{
					res.send(data);
				}
			}
		})
	})	
}
module.exports = Timelinechart;
