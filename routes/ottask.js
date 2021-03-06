var moment = require('moment');
var DB, Everyone;

var Ottask = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Ottask;
};

Ottask.byOt = function(req, res, next) {
  var q = " \
    SELECT * \
    FROM ottask \
    WHERE ot_id = " + req.params.id + " AND deleted_at IS NULL \
    ORDER BY priority ASC \
  "; 
  DB._.query(q, function(err, tasks) {
    res.send(tasks);
  });
};

Ottask.getOne = function(req, res, next) {
  var q = " \
    SELECT * \
    FROM ottask \
    WHERE id = " + req.params.id + " AND deleted_at IS NULL \
  "; 
  DB._.query(q, function(err, task) {
    console.log(task)
    res.send(task);
  });
};

Ottask.byOtNumber = function(req, res, next) {
  var q = " \
    SELECT ott.* \
    FROM ottask ott \
    LEFT JOIN ot ON ott.ot_id = ot.id \
    WHERE ot.number = " + req.params.ot_number + " \
    ORDER BY ott.position ASC\
    ";
  DB._.query(q, function(err, tasks) {
    res.send(tasks);
  });
};

Ottask.resources = function(req, res, next) {
  var q = " \
    SELECT otr.*, CONCAT(p.lastname, ', ', p.firstname) AS employee \
    FROM ottaskresource otr \
    INNER JOIN employee e ON otr.employee_id = e.id \
    INNER JOIN person p ON e.person_id = p.id \
    WHERE otr.ottask_id = " + req.params.ottask_id + " \
    AND otr.deleted_at is NULL \
  ";

  DB._.query(q, function(error, data) {
    if (data) {
      res.send({ result: true, resources: data });
    } else {
      res.send({ result: false, error: error });
    }
  });
};

Ottask.add = function(req, res, next) {
  var q, new_task_position = 1;
  var params = req.body
  var diference;
  var missing = 0;
  if (params.materials_missing == 'true'){
    missing = 1;
  }
  DB._.query("SELECT MAX(position) AS position FROM ottask WHERE ot_id = "+params.ot_id+" AND (priority <= "+params.priority+")", function(err, position){
    var pos = 1
    if (position.length > 0){
      pos = position[0].position;  
    }
    DB._.query("UPDATE ottask SET position = position + 1 WHERE position >= "+pos+" AND ot_id = "+params.ot_id+" AND deleted_at IS NULL");
    if(params.reprogramTask == 'true'){
      if (params.type == 'par'){
        DB._.query('SELECT MAX(eta) AS max FROM ottask WHERE ot_id = '+params.ot_id+' AND priority = '+params.priority, function(err, max){
          diference = Number(params.eta) - Number(max[0].max);
          if (diference > 0){
            DB._.query('UPDATE ottask SET due_date = DATE_ADD(due_date, INTERVAL '+diference+' DAY) WHERE ot_id = '+params.ot_id+' AND priority > '+params.priority);
          }
        })
      }
      else{
        DB._.query('UPDATE ottask SET due_date = DATE_ADD(due_date, INTERVAL '+params.eta+' DAY) WHERE ot_id = '+params.ot_id+' AND priority >= '+params.priority);
      }
    }
    var q_start = '';
    if (params.priority > 1){
      q_start = 'SELECT MAX(due_date) AS start FROM ottask WHERE ot_id = '+params.ot_id+' AND priority < '+params.priority;
    }
    else{
      q_start = 'SELECT created_at AS start, agreedstart FROM ot where id = '+params.ot_id;
    }
    DB._.query(q_start, function(err, start){
      var startDay = start[0].start
      if (start[0].agreedstart != null){
        startDay = start[0].agreedstart
      }
      var dp= req.body.description.split(":::")
      console.log(missing, ' falta')
      DB.Ottask.build({
        name: params.name,
        sent:0,
        description: dp[0],
        due_date: moment(startDay).add('days', params.eta).format('YYYY-MM-DD'),
        position: pos,
        priority: params.priority,
        area_id: dp[2],
        completed: 0,
        completed_date: null,
        materials_tools: null,
        reworked: 0,
        derived_to: 0,
        observation: null,
        ot_id: params.ot_id,
        eta: params.eta,
        materials_missing: missing,
      }).save().on('success', function(data) {
        DB.Reporttask.build({
          report_id:data.ot_id,
          ottask_id:data.id,
          observation: '',
        }).save();
        if (params.type == 'seq'){
          DB._.query("SELECT priority FROM ottask WHERE ot_id = "+params.ot_id+" AND priority = "+params.priority , function(err, e){
            if (e.length > 0) {
              DB._.query("UPDATE ottask SET priority = priority + 1 WHERE priority >= "+params.priority+" AND id != "+data.id+" AND ot_id = "+params.ot_id)
            };
          })
        }
        var delay;
        if (params.type == 'par'){
          delay = diference
        }
        else{
          delay = params.eta;
        }
        console.log(delay)
        if(params.reprogram == 'true'){
          DB.Otdelay.create({
            delay: delay,
            delay_id: req.body.delay_id,
            ot_id: req.body.ot_id,
            observation: req.body.observation
          })
          DB.Ot.find({where:{id: params.ot_id}}).on('success', function(ot){
          var query = 'SELECT due_date AS deadline FROM ottask WHERE ot_id = '+params.ot_id+' ORDER BY priority DESC, eta DESC LIMIT 1';
            DB._.query(query, function(err, deadline){
              if (deadline[0]){
                ot.updateAttributes({delivery:deadline[0].deadline}).on('success', function(){
                  res.send(deadline[0].deadline);
                })
              }else{
                res.send(true);
              }
            })
          })
        }
        else{
          res.send(true)
        }
      }).on('error', function(err) {
        res.send(false, err);
      });
    })
  })
};

Ottask.rework = function(req, res, next) {
  var params = req.body;
  var type;
  var diference;
  DB._.query('SELECT * FROM ottask WHERE ot_id = '+params.ot_id+' AND priority = '+params.priority, function(err, data){
    if (data.length > 1){
      type = 'par';
    }
    else{
      type = 'seq';
    }
    DB.Ottask.find({ where: { id: params.id } }).on('success', function(t) {
      if (t) {
        if(params.reprogramTask == 'true'){
          if (type == 'par'){
            DB._.query('SELECT MAX(eta) AS max FROM ottask WHERE ot_id = '+params.ot_id+' AND priority = '+t.priority, function(err, max){
              diference = Number(params.eta) - Number(max[0].max);
              if (diference > 1){
                DB._.query('UPDATE ottask SET due_date = DATE_ADD(due_date, INTERVAL '+diference+' DAY) WHERE ot_id = '+params.ot_id+' AND id != '+t.id+' AND priority > '+params.priority);
              }
            })
          }
          else{
            diference = Number(params.eta) - Number(t.eta);
            if (diference > 0){
              console.log(diference)
              DB._.query('UPDATE ottask SET due_date = DATE_ADD(due_date, INTERVAL '+diference+' DAY) WHERE ot_id = '+params.ot_id+' AND id != '+t.id+' AND priority >= '+params.priority);
            }
          }
        }
        console.log(params.reprogram)
        var delay;
        if (type == 'par'){
          delay = diference
        }
        else{
          delay = Number(params.eta);
        }
        if(params.reprogram == 'true'){
          console.log({
            delay: delay,
            delay_id: params.delay_id,
            ot_id: params.ot_id,
            observation: params.explaination
          })
          DB._.query('INSERT INTO otdelay (delay, delay_id, ot_id, observation, created_at, updated_at) VALUES ("'+delay+'", "'+params.delay_id+'", "'+params.ot_id+'", "'+params.explaination+'", NOW(), NOW())')
          DB.Ot.find({where:{id: params.ot_id}}).on('success', function(ot){
          var query = 'SELECT due_date AS deadline FROM ottask WHERE ot_id = '+params.ot_id+' ORDER BY priority DESC, eta DESC LIMIT 1';
            DB._.query(query, function(err, deadline){
              if (deadline[0]){
                ot.updateAttributes({delivery:deadline[0].deadline})
              }
            })
          })
        }
        var q_start = '';
        console.log('prioridad', params.priority)
        if (params.priority > 1){
          q_start = 'SELECT MAX(due_date) AS start FROM ottask WHERE ot_id = '+params.ot_id+' AND priority < '+params.priority;
          console.log(q_start)
        }
        else{
          q_start = 'SELECT created_at AS start FROM ot where id = '+params.ot_id;
        }
        DB._.query(q_start, function(err, start){
          console.log(err, start)
          var startDay = start[0].start
          DB.Ottask.build({
            name: t.name,
            sent: 0,
            priority: t.priority,
            description: t.description,
            due_date: moment(startDay).add('days', params.eta).format('YYYY-MM-DD'),
            position: parseInt(req.params.position) + 1,
            area_id: t.area_id,
            completed: 0,
            completed_date: null,
            materials_tools: null,
            reworked: 0,
            eta: params.eta,
            derived_to: 0,
            observation: null,
            ot_id: t.ot_id
          }).save().on('success', function(new_ottask) {
            if (type == 'seq'){
              DB._.query("SELECT * FROM ottask WHERE ot_id = "+params.ot_id+" AND priority = "+params.priority , function(err, e){
                console.log(e)
                if (e.length > 0) {
                  DB._.query("UPDATE ottask SET priority = priority + 1 WHERE priority >= "+params.priority+" AND id != "+params.id+" AND id != "+new_ottask.id+" AND ot_id = "+params.ot_id)
                };
              })
            }
            t.updateAttributes({
              reworked: new_ottask.id
            })
            res.send(true)
          }).on('error', function(err) {
            res.send(false);
          });
        })
      
      }
    });
  })
};

Ottask.complete = function(req, res, next) {
  console.log(req.body)
  id=req.params.task_id.split( "**");
  DB.Ottask.find({ where: { id: id[0] } }).on('success', function(t) {
    if(id[1]!="error"){
    if (t) {
      var date
      if (t.completed){
        date = null
      }else{
        date = moment().format('YYYY-MM-DD')
      }
      t.updateAttributes({
        completed: !t.completed,
        completed_date: date
      }).on('success', function() {
        if (!t.completed === false) {
          DB.Ot.find({ where: { id: t.ot_id }}).on('success', function(ot) {
            for (var i = 1; i <= 5; i += 1) {
              // Only for entries where employee was selected
              if (parseInt(req.body['toggle_task_employee_' + i]) > 0) {
                console.log(req.body['toggle_task_employee_'+i])
                var impr;
                console.log({
                  ottask_id: t.id,
                  employee_id: req.body['toggle_task_employee_' + i],
                  employee_hours: req.body['toggle_task_schedule_' + i + '_h'],
                  employee_minutes: req.body['toggle_task_schedule_' + i + '_m'],
                  materials_tools: impr
                  })
                req.body['seleccion_' + i]? impr=req.body['seleccion_' + i].toString():impr=" ";
                DB.Ottaskresource.build({
                  ottask_id: t.id,
                  employee_id: req.body['toggle_task_employee_' + i],
                  employee_hours: req.body['toggle_task_schedule_' + i + '_h'],
                  employee_minutes: req.body['toggle_task_schedule_' + i + '_m'],
                  materials_tools: impr
                  }).save();
              }
            }
            var q = "SELECT name FROM equipment e WHERE e.deleted_at IS NULL AND id = "+ot.equipment_id+"";
            DB._.query(q, function(err, data) {            
              console.log(data)
              DB.News.build({
                name: 'Tarea Completada',
                description: '<span class="italic">"' + t.name + '"</span> del Equipo <a href="#">' + data[0].name + '</a>',
                related_model: 'ottask',
                related_model_id: t.id
              }).save();
              
             }) 
            DB.Clientnotification.find({ where: {
              related_model: 'ottask',
              related_model_id: t.id,
            }}).on('success', function(cn) {
              if (!cn && ot && ot.notify_client) {
                DB.Clientnotification.build({
                  name: 'Tarea completada',
                  description: t.name + ': ' + t.description,
                  related_model: 'ottask',
                  related_model_id: t.id,
                  ot_number: ot.number,
                  client_id: ot.client_id
                }).save();
              }
            }).on('error', function(err) {
              DB.Clientnotification.build({
                name: 'Tarea completada',
                description: t.name + ': ' + t.description,
                related_model: 'ottask',
                related_model_id: t.id,
                ot_number: ot.number,
                client_id: ot.client_id
              }).save();
            });
          });
        }
        DB.Ottask.findAll({where:{completed: 0, ot_id: t.ot_id}}).on('success', function(ott){
          if(ott.length == 0){
            DB.Ot.find({where:{id: t.ot_id}}).on('success', function(ot){
              ot.updateAttributes({ready:new Date()})
            })
          }
        })
        res.send(true);
      }).on('error', function(err) {
        res.send(false);
      });
      }
      }else {
    if (t) {
      t.updateAttributes({
        completed: t.completed,
        //completed_date: moment().format('YYYY-MM-DD')
      }).on('success', function() {
        if (t.completed === false) {
          DB.Ot.find({ where: { id: t.ot_id } }).on('success', function(ot) {
            for (var i = 1; i <= 5; i += 1) {
              // Only for entries where employee was selected
              var impr;
	      req.body['seleccion_' + i]? impr=req.body['seleccion_' + i].toString():impr=" ";
              if (parseInt(req.body['toggle_task_employee_' + i]) > 0) {
                DB.Ottaskresource.build({
                  ottask_id: t.id,
                  employee_id: req.body['toggle_task_employee_' + i],
                  employee_hours: req.body['toggle_task_schedule_' + i + '_h'],
                  employee_minutes: req.body['toggle_task_schedule_' + i + '_m'],
                  materials_tools: impr
                  }).save();
              }
            }
            var q = "SELECT name FROM equipment e WHERE e.deleted_at IS NULL AND id = "+ot.equipment_id;
            DB._.query(q, function(err, data) {              
              DB.News.build({
                name: 'Tarea completada',
                description: '<span class="italic">"' + t.name + '"</span> del Equipo <a href="#">N&ordm; ' + data[0].name+ '</a>',
                related_model: 'ottask',
                related_model_id: t.id
              }).save();
            })
            DB.Clientnotification.find({ where: {
              related_model: 'ottask',
              related_model_id: t.id,
            }}).on('success', function(cn) {
              if (!cn && ot && ot.notify_client) {
                DB.Clientnotification.build({
                  name: 'Tarea En Proceso',
                  description: t.name + ': ' + t.description,
                  related_model: 'ottask',
                  related_model_id: t.id,
                  ot_number: ot.number,
                  client_id: ot.client_id
                }).save();
              }
            }).on('error', function(err) {
              DB.Clientnotification.build({
                name: 'Tarea En Proceso',
                description: t.name + ': ' + t.description,
                related_model: 'ottask',
                related_model_id: t.id,
                ot_number: ot.number,
                client_id: ot.client_id
              }).save();
            });
          });
        }
        DB.Ottask.findAll({where:{completed: 0, ot_id:t.ot_id}}).on('success', function(ott){
          if(ott.length == 0){
            DB.Ot.find({where:{id: t.ot_id}}).on('success', function(ot){
              ot.updateAttributes({ready:new Date()})
            })
          }
        })
        res.send(true);
      }).on('error', function(err) {
        res.send(false);
      });
      
      
      }
    }
  });
};

Ottask.put = function(req, res, next) {
  DB.Ottask.find({ where: { id: req.params.id } }).on('success', function(t) {
    if (t) {
      req.body.due_date = moment(DB.flipDateMonth(req.body.due_date)).format('YYYY-MM-DD');
      if (req.body.completed_date){
        req.body.completed_date = moment(DB.flipDateMonth(req.body.completed_date)).format('YYYY-MM-DD');
      }
      t.updateAttributes(req.body).on('success', function(x) {
        res.send(x);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Ottask.delete = function(req, res, next) {
  DB.Ottask.find({where:{ id: req.params.id}}).on('success', function(ott){
    DB._.query('DELETE FROM reporttask WHERE ottask_id = '+ott.id);
    if(ott.completed==1||ott.sent){
      if(req.session.role_id>3){
        DB.deleteById(req, res, DB.Ottask);
      }else{
        res.send({a: ott, 
                  b:!1
        })
      }
    }else{
      DB.deleteById(req, res, DB.Ottask);
    }
  })
};

module.exports = Ottask;