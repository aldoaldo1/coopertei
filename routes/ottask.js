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
  console.log(q)
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
  var q, new_task_position = null;

  if (req.body.selected_row_position > 0) {
    q = " \
      UPDATE ottask \
      SET position = position + 1 \
      WHERE position > " + req.body.selected_row_position + " \
      AND ot_id = " + req.body.ot_id + " \
      AND deleted_at IS NULL \
    ";
    new_task_position = parseInt(req.body.selected_row_position) + 1;
  } else {
    q = " \
      SELECT MAX(position) AS max_position \
      FROM ottask \
      WHERE ot_id = " + req.body.ot_id + " AND deleted_at IS NULL \
    ";
  }
 DB._.query(q, function(err, result) {
    var pos;

    if (new_task_position !== null) {
      pos = new_task_position;
    } else {
      pos = parseInt(result[0].max_position) + 1;
    }
    var dp= req.body.description.split(":::")
    DB.Ottask.build({
      name: req.body.name,
      sent:0,
      description: dp[0],
      due_date: moment().format('YYYY-MM-DD'),
      position: pos,
      priority: dp[1],
      area_id: dp[2],
      completed: 0,
      completed_date: null,
      materials_tools: null,
      reworked: 0,
      derived_to: 0,
      observation: null,
      ot_id: req.body.ot_id
    }).save().on('success', function() {
      res.send(true);
    }).on('error', function(err) {
      res.send(false);
    });
  });
};

Ottask.rework = function(req, res, next) {
  DB.Ottask.find({ where: { id: req.params.task_id } }).on('success', function(t) {
    if (t) {
      q = " \
        UPDATE ottask \
        SET position = position + 1 \
        WHERE position > " + req.params.position + " \
        AND ot_id = " + t.ot_id + " \
        AND deleted_at IS NULL \
      ";
      DB._.query(q, function(err, result) {
        DB.Ottask.build({
          name: t.name,
          sent: 0,
          priority: t.priority,
          description: t.description,
          due_date: t.due_date,
          position: parseInt(req.params.position) + 1,
          area_id: t.area_id,
          completed: 0,
          completed_date: null,
          materials_tools: null,
          reworked: 0,
          derived_to: 0,
          observation: null,
          ot_id: t.ot_id
        }).save().on('success', function(new_ottask) {
          t.updateAttributes({
            reworked: new_ottask.id
          }).on('success', function() {
            res.send(true);
          });
        }).on('error', function(err) {
          res.send(false);
        });
      });
    }
  });
};

Ottask.complete = function(req, res, next) {
  id=req.params.task_id.split( "**");
  DB.Ottask.find({ where: { id: /*req.params.task_id*/id[0] } }).on('success', function(t) {
    if(id[1]!="error"){
    if (t) {
      t.updateAttributes({
        completed: !t.completed,
        completed_date: moment().format('YYYY-MM-DD'),
      }).on('success', function() {
        if (!t.completed === false) {
          DB.Ot.find({ where: { id: t.ot_id }}).on('success', function(ot) {
            for (var i = 1; i <= 5; i += 1) {
              // Only for entries where employee was selected
              if (parseInt(req.body['toggle_task_employee_' + i]) > 0) {
              var impr;
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
        res.send(true);
      }).on('error', function(err) {
        res.send(false);
      });
      }
      }else {
    if (t) {
      t.updateAttributes({
        completed: t.completed,
        completed_date: moment().format('YYYY-MM-DD')
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
