var moment = require('moment'),
    async = require('async');
var DB, Everyone;
var exec = require('child_process').exec;
var execTest = require('child_process').exec;

var Ot = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Ot;
};

Ot.nextNumber = function(req, res, next) {
  DB._.query("SELECT MAX(number) AS n FROM ot", function(err, data) {
    res.send({ n: data[0].n + 1 });
  });
};

Ot.inaugurate = function(req, res, next) {
if(req.body.client_id > 0){
  function createOt(equipment_new) {
    var equipment_id = req.body.equipment_id;

    if (equipment_new != null) {
      equipment_id = equipment_new.id;
    }
  DB._.query("SELECT MAX(number) + 1 AS n FROM ot", function(err, data) {
    DB.Ot.build({
      number: data[0].n,
      client_number: 0,
      client_id: req.body.client_id,
      equipment_id: equipment_id,
      delivery: null,
      intervention_id: 0,
      workshop_suggestion: null,
      client_suggestion: null,
      plan_id: 0,
      reworked_number: 0,
      notify_client: 0,
      otstate_id: 1
    }).save().on('success', function(ot) {
      async.parallel(
      {
        authorization: function(fn) {
          DB.Authorization.build({
            ot_id: ot.id,
            client_id: req.body.client_id,
            req_info_sent_date: null,
            otstate_id: 1
          }).save().on('success', function() {
            fn(null, data);
          });
        },
        report: function(fn) {
          DB.Report.build({
            ot_id: ot.id,
            ot_number: ot.number,
            client_id: req.body.client_id
          }).save().on('success', function() {
            fn(null, data);
          });
        }
      },
      function(err, results) {
        //Send the news
        //Agregar lo del equipo
        var q = "SELECT name FROM equipment e WHERE e.deleted_at IS NULL AND id = "+ot.equipment_id;
        DB._.query(q, function(err, data) {   
          DB.News.build({
            name: 'Nueva O/T',
            description: 'El equipo<a href="#">' + data[0].name + '</a> ha sido inaugurada en Vigilancia',
            related_model: 'ot',
            related_model_id: ot.id
          }).save();
          res.send({ result: true, ot_number: data[0].n });
        })
      });
    }).on('error', function(error) {
      res.send({ result: false, error: error });
    });
  });
}
  if (req.body.equipment_new) {
    DB.Equipment.build({
      name: req.body.equipment_new,
      intervention_id: req.body.intervention_id,
      client_id: req.body.client_id
    }).save().on('success', function(e) {
      createOt(e);
    });
  } else {
    createOt(null);
  };
  }else{ res.send(faclse);}
};


Ot.get = function(req, res, next) {
  var where = 'otstate_id <> 6';
  if (req.session.role_id == 1){
    where = 'otstate_id = 1'
  }
  var q = " \
    SELECT ot.*, c.name AS client, e.name AS equipment, i.name AS intervention, \
           p.name AS plan, s.name AS state, GROUP_CONCAT(od.observation SEPARATOR ';') AS delaytext, GROUP_CONCAT(d.reason SEPARATOR ';') AS delay \
    FROM ot \
    LEFT JOIN otdelay od ON od.ot_id = ot.id \
    LEFT JOIN delay d ON od.delay_id = d.id \
    LEFT JOIN client c ON ot.client_id = c.id \
    LEFT JOIN equipment e ON ot.equipment_id = e.id \
    LEFT JOIN intervention i ON ot.intervention_id = i.id \
    LEFT JOIN plan p ON ot.plan_id = p.id \
    LEFT JOIN otstate s ON ot.otstate_id = s.id \
    WHERE "+where+" AND ot.deleted_at IS NULL \
    GROUP BY ot.number \
    ORDER BY ot.delivery ASC";						
  console.log(q)
  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(ot) {
      var otdelay = []
      var delayfield = '';
      index = 0;
      if (ot.delay){
        ot.delay.split(';').forEach(function(delay){
          otdelay.push({
            reason: delay,
            observation: ot.delaytext.split(';')[index],
          })
          delayfield+= '<p><span>'+delay+'</span><br/>'+ot.delaytext.split(';')[index]+'</p>'
          index++;
        })
      }
      msg.push({
        id: ot.id,
        ot_number: "Ot_"+ot.number,
	      remitoentrada: ot.remitoentrada,
	      remitosalida: ot.remitosalida,
        number: ot.number,
        client_number: ot.client_number,
        equipment_id: ot.equipment_id,
        equipment_new: ot.equipment,
        equipment: ot.equipment,
        delivery: ot.delivery ? moment(ot.delivery).format('DD/MM/YYYY') : "Sin DEFINIR",
        created_at: moment(ot.created_at).format('DD/MM/YYYY'),
        agreedstart: ot.agreedstart ? moment(ot.agreedstart).format('DD/MM/YYYY') : '',
        agreedend: ot.agreedend ? moment(ot.agreedend).format('DD/MM/YYYY') : '',
        ready: ot.ready ? moment(ot.ready).format('DD/MM/YYYY') : '',
        workshop_suggestion: ot.workshop_suggestion,
        client_suggestion: ot.client_suggestion,
        client_id: ot.client_id,
        client: ot.client,
        intervention_id: ot.intervention_id,
        intervention: ot.intervention,
        plan_id: ot.plan_id,
        plan: ot.plan,
        reworked_number: ot.reworked_number,
        notify_client: ot.notify_client,
        showtimeline: ot.showtimeline,
        showdelays: ot.showdelays,
        otstate_id: ot.otstate_id,
        state: ot.state,
        delay: delayfield
      });
    });
    res.send({data:msg});
  });
};

Ot.getOne = function(req, res, next) {
  DB.Ot.findAll(DB.whereID(req.params.id)).on('success', function(x) {
    res.send(DB.dataToArray(x));
  });
};

Ot.findByEquipmentAndClient = function(req, res, next) {
  if (req.params.equipment_id && req.params.client_id) {
    DB.Ot.findAll({ where: {
      equipment_id: req.params.equipment_id,
      client_id: req.params.client_id
    } }).on('success', function(ots) {
      if (ots) {
        res.send({ result: true, ots: ots });
      }
    }).on('error', function(error) {
      res.send({ result: false, error: error });
    });
  }
};

Ot.conclude = function(req, res, next) {
  DB.Ot.find({ where: { id: req.params.ot_id } }).on('success', function(ot) {
    if (ot) {
      var q = " \
        UPDATE ot \
        SET otstate_id = 6, \
	          remitosalida= '"+(req.body.remito || '')+"', \
            conclusion_date = NOW(), \
            conclusion_motive = '" + (req.body.motive || '') + "', \
            conclusion_observation = '" + (req.body.observation || '') + "', \
            updated_at= '"+moment().format("YYYY-MM-DD HH:MM:SS")+"'  \
        WHERE id = " + req.params.ot_id + " \
      ";//UPDATE  `ot` SET  `updated_at` =  '2014-01-30 10:45:11' WHERE  `ot`.`id` =1;
      console.log(q)
      DB._.query(q, function(err, data) {
          var que= "\
             UPDATE materialorder \
             SET history = 1 \
             WHERE ot_id = "+ req.params.ot_id +"\
             ";
          DB._.query(que, function(errq, dataq) {
		        DB.Ot.find({ where: { id: req.params.ot_id } }).on('success', function(ot) {
		          DB.Authorization.find({ where: { ot_id: ot.id } }).on('success', function(a) {
		            if (a) {
		              a.updateAttributes({ otstate_id: 6 }).on('success', function() {
                  var q = "SELECT name FROM equipment e WHERE e.deleted_at IS NULL AND id = "+ot.equipment_id;
                    DB._.query(q, function(err, data) {
                      var description = 'La OT n° '+ot.number+' ha sido conclu$iacute;da sin TAG';
                      if (data){
                        description = 'El equipo <href="#">Nº ' + data[0].name + '</a> ha sido conclu&iacute;do';
                      }		              
		                  DB.News.build({
		                    name: 'O/T Finalizada',
		                    description: description,
		                    related_model: 'ot',
		                    related_model_id: ot.id
		                  }).save().on('success', function() {
		                    res.send({ result: true });
		                  }).on('error', function(err) {
		                    res.send({ result: false, error: err });
		                  });
		                })
		              });
		            }
		          });
        	  });
          }).on('error', function(err) {
        res.send({ result: false, error: err });
       });
      }).on('error', function(err) {
        res.send({ result: false, error: err });
      });
    }
  });
};

Ot.reprogram = function(req, res, next){
  DB.Ot.find({where: {id: req.params.id}}).on('success', function(ot){
    var diffDays = 0;
    if (ot.delivery){
      prev = ot.delivery;
      var a = moment(prev);
      var b = moment(req.body.newDate);
      diffDays = b.diff(a, 'days');
    }
    ot.updateAttributes({
      delivery: moment(req.body.newDate).format('YYYY-MM-DD')
    })
    
    DB.Otdelay.create({
      delay: diffDays,
      ot_id: req.params.id,
      delay_id: req.body.delay_id,
      observation: req.body.observation
    })
  })
  res.send(true);
}

Ot.update = function(req, res, next) {
  DB.Authorization.find({where: {ot_id: req.params.ot_id}}).on('success',function(auth){
    if(auth){
      auth.updateAttributes({client_id: req.body.client_id})
    }
  })
  DB.Ot.find({ where: { id: req.params.ot_id } }).on('success', function(ot) { 
    var agreedstart = null;
    var agreedend = null;
    var ready = null;
    var x = req.body.agreedstart
    agreedstart = x[3]+x[4]+'-'+x[0]+x[1]+'-'+x[6]+x[7]+x[8]+x[9];
    x = req.body.agreedend;
    agreedend = x[3]+x[4]+'-'+x[0]+x[1]+'-'+x[6]+x[7]+x[8]+x[9];
    x = req.body.ready;
    ready = x[6]+x[7]+x[8]+x[9]+'-'+x[3]+x[4]+'-'+x[0]+x[1];
    if(ot){
      DB._.query("SELECT id FROM plan WHERE id = "+ot.plan_id+" AND deleted_at IS NULL", function(err, plan){
      if(ot.plan_id == req.body.plan_id || (plan.length == 0 && req.body.plan_id == '')){
      //Actualizo Todo menos plan de tareas
        var equipment;
        if(req.body.equipment_new){
          DB.Equipment.build({
            name: req.body.equipment_new,
            intervention_id: req.body.intervention_id,
            client_id: req.body.client_id
          }).save().on('success', function(e) {
            qe="\
            	UPDATE ot\
              SET remitoentrada = '"+req.body.remitoentrada+"',\
              client_number = '"+req.body.client_number+"',\
              client_id = '"+req.body.client_id+"',\
              equipment_id = '"+e.id+"',\
              agreedstart = '"+agreedstart+"',\
              agreedend = '"+agreedend+"',\
              ready = '"+ready+"',\
              intervention_id = '"+req.body.intervention_id+"',\
              workshop_suggestion = '"+req.body.workshop_suggestion+"',\
              client_suggestion = '"+req.body.client_suggestion+"',\
              reworked_number = '"+req.body.reworked_number+"',\
              showtimeline = '"+req.body.showtimeline+"',\
              showdelays = '"+req.body.showdelays+"',\
              notify_client = '"+req.body.notify_client+"'\
              WHERE id = " + req.params.ot_id + "\
              ";
            DB._.query(qe, function(errq, data) {
              res.send({ result: true });
            }).on('error', function(err) {
              res.send({ result: false, error: err });
            });
          });
        }else{
          qe="\
            UPDATE ot\
            SET remitoentrada = '"+req.body.remitoentrada+"',\
            client_number = '"+req.body.client_number+"',\
            client_id = '"+req.body.client_id+"',\
            equipment_id = '"+req.body.equipment_id+"',\
            agreedstart = '"+agreedstart+"',\
            agreedend = '"+agreedend+"',\
            ready = '"+ready+"',\
            intervention_id = '"+req.body.intervention_id+"',\
            workshop_suggestion = '"+req.body.workshop_suggestion+"',\
            client_suggestion = '"+req.body.client_suggestion+"',\
            reworked_number = '"+req.body.reworked_number+"',\
            showtimeline = '"+req.body.showtimeline+"',\
            showdelays = '"+req.body.showdelays+"',\
            notify_client = '"+req.body.notify_client+"'\
            WHERE id = " + req.params.ot_id + "\
            ";
          DB._.query(qe, function(errq, data) {
    	      res.send({ result: true });
          }).on('error', function(err) {
              res.send({ result: false, error: err });
          });
        };
      }else{
        delete_query = 'DELETE FROM otdelay WHERE ot_id = '+ot.id;
        DB._.query(delete_query, function(err, data){})
        //Actualizo Todo
        ot.updateAttributes({
          remitoentrada: req.body.remitoentrada,
  	      client_number: req.body.client_number,
  	      client_id: req.body.client_id,
  	      agreedstart: agreedstart,
          agreedend: agreedend,
          ready: ready,
  	      intervention_id: req.body.intervention_id,
  	      workshop_suggestion: req.body.workshop_suggestion,
  	      client_suggestion: req.body.client_suggestion,
  	      reworked_number: req.body.reworked_number,
          showdelays: req.body.showdelays,
          showtimeline: req.body.showtimeline,
  	      notify_client: req.body.notify_client,
  	      plan_id: req.body.plan_id,
        }).on('success', function() {
          async.parallel(
          {
            tasks: function(fn) {
              DB._.query('DELETE FROM reporttask WHERE report_id = '+ot.id);
              var q1 = "DELETE FROM ottask WHERE ot_id = " + ot.id;
              DB._.query(q1, function(err, data) {
                var q2 = " \
                  SELECT tp.*, t.* \
                  FROM taskplan tp \
                  INNER JOIN task t ON tp.task_id = t.id \
                  WHERE tp.deleted_at IS NULL AND tp.plan_id = " + req.body.plan_id;
                DB._.query(q2, function(err, tasks) {
                  if (tasks && tasks.length){
                    var position = 1;
                    var priority = 1;
                    tasks.forEach(function(t) {
                    var q3 = 'SELECT SUM(max) AS eta FROM (SELECT MAX(tp.eta) AS max FROM taskplan tp INNER JOIN task t ON tp.task_id = t.id WHERE tp.plan_id = '+req.body.plan_id+' AND t.priority < '+t.priority+' GROUP BY t.priority) AS aux';
                      DB._.query(q3, function(err, max){
                        var startDay = moment(ot.created_at);
                        if (req.body.agreedstart){
                          startDay = moment(agreedstart);
                        }
                        if (max[0].eta){
                          startDay.add('days', Number(max[0].eta) + Number(t.eta));
                        }
                        else{
                          startDay.add('days', Number(t.eta));
                        }
                        DB.Ottask.build({
                          name: t.name,
                          sent: 0,                      
                          priority: t.priority,
                          description: t.description,
                          position: position,
                          due_date: moment(startDay).format('YYYY-MM-DD'),
                          area_id: t.area_id,
                          completed: 0,
                          reworked: 0,
                          derived_to: 0,
                          ot_id: ot.id,
                          eta: t.eta
                        }).save().on('success', function(rt){
                          console.log(rt)
                          DB.Reporttask.build({
                            report_id: rt.ot_id,
                            ottask_id: rt.id,
                            observation: '',
                          }).save()
                        });
                        position += 1;
                        if (max[0].eta) {
                          startDay.subtract('days', Number(max[0].eta) + Number(t.eta)).format('YYYY-MM-DD')
                        }
                        else{
                          startDay.subtract('days', Number(t.eta)).format('YYYY-MM-DD')
                        };
                      })
                    });
                  }
                });
              });
            }
          });
          res.send({ result: true });
        });
      }
    })
   }
  });
};

Ot.updateDate = function(req, res, next){
  DB.Ot.find({where:{id: req.params.id}}).on('success', function(ot){
  var query = 'SELECT due_date AS deadline FROM ottask WHERE ot_id = '+ot.id+' ORDER BY priority DESC, eta DESC LIMIT 1';
    DB._.query(query, function(err, deadline){
      if (deadline[0]){
        console.log(deadline[0].deadline)
        ot.updateAttributes({delivery:deadline[0].deadline})
      }
    })
  })
  res.send(true)
}

Ot.post = function(req, res, next) {
if(req.body.client_id > 0){
   var agreedstart = null;
   var agreedend = null;
   var ready = null;
   var x = req.body.agreedstart
    agreedstart = x[3]+x[4]+'-'+x[0]+x[1]+'-'+x[6]+x[7]+x[8]+x[9];
    x = req.body.agreedend;
    agreedend = x[3]+x[4]+'-'+x[0]+x[1]+'-'+x[6]+x[7]+x[8]+x[9];
    x = req.body.ready;
    ready = x[6]+x[7]+x[8]+x[9]+'-'+x[3]+x[4]+'-'+x[0]+x[1];
    function createOt(equipment_new) {
    var equipment_id = req.body.equipment_id;
    if (equipment_new !== null) {
      equipment_id = equipment_new.id;
    }
    DB._.query("SELECT MAX(number) AS n FROM ot", function(err, data) {   		
      DB.Ot.build({
	      number: (data[0].n +1),								
        client_number: req.body.client_number || 0,
        client_id: req.body.client_id,
        equipment_id: equipment_id,
        agreedstart: agreedstart,
        agreedend: agreedend,
        ready: ready,
        intervention_id: req.body.intervention_id,
        workshop_suggestion: req.body.workshop_suggestion,
        client_suggestion: req.body.client_suggestion,
        plan_id: req.body.plan_id,
        reworked_number: req.body.reworked_number || 0,
        notify_client: req.body.notify_client,
        showtimeline: req.body.showtimeline,
        showdelays: req.body.showdelays,
        remitoentrada: req.body.remitoentrada,
        otstate_id: 1
      }).save().on('success', function(ot) {
        async.parallel(
        {
          tasks: function(fn) {
            DB._.query('DELETE FROM reporttask WHERE report_id = '+ot.id);
            var q1 = "DELETE FROM ottask WHERE ot_id = " + ot.id;
            DB._.query(q1, function(err, data) {
              var q2 = " \
                SELECT tp.*, t.* \
                FROM taskplan tp \
                INNER JOIN task t ON tp.task_id = t.id \
                WHERE tp.deleted_at IS NULL AND tp.plan_id = " + req.body.plan_id;
              DB._.query(q2, function(err, tasks) {
                if (tasks && tasks.length){
                  var position = 1;
                  var priority = 1;
                  tasks.forEach(function(t) {
                  var q3 = 'SELECT SUM(max) AS eta FROM (SELECT MAX(tp.eta) AS max FROM taskplan tp INNER JOIN task t ON tp.task_id = t.id WHERE tp.plan_id = '+req.body.plan_id+' AND t.priority < '+t.priority+' GROUP BY t.priority) AS aux';
                    DB._.query(q3, function(err, max){
                      var startDay = moment(ot.created_at);
                      if (req.body.agreedstart){
                        startDay = moment(agreedstart);
                      }
                      if (max[0].eta){
                        startDay.add('days', Number(max[0].eta) + Number(t.eta));
                      }
                      else{
                        startDay.add('days', Number(t.eta));
                      }
                      DB.Ottask.build({
                        name: t.name,
                        sent: 0,                      
                        priority: t.priority,
                        description: t.description,
                        position: position,
                        due_date: moment(startDay).format('YYYY-MM-DD'),
                        area_id: t.area_id,
                        completed: 0,
                        reworked: 0,
                        derived_to: 0,
                        ot_id: ot.id,
                        eta: t.eta
                      }).save().on('success', function(rt){
                        console.log(rt)
                        DB.Reporttask.build({
                          report_id: rt.ot_id,
                          ottask_id: rt.id,
                          observation: '',
                        }).save()
                      });
                      position += 1;
                      if (max[0].eta) {
                        startDay.subtract('days', Number(max[0].eta) + Number(t.eta)).format('YYYY-MM-DD')
                      }
                      else{
                        startDay.subtract('days', Number(t.eta)).format('YYYY-MM-DD')
                      };
                    })
                  });
                }
              });
            });
            fn(null, data);
          },
          authorization: function(fn) {
            DB.Authorization.build({
              ot_id: ot.id,
              client_id: req.body.client_id,

              req_info_sent_date: null,
              otstate_id: 1
            }).save().on('success', function() {
              fn(null, data);
            });
          },
          report: function(fn) {
            DB.Report.build({
              ot_id: ot.id,
              ot_number: ot.number,
              client_id: req.body.client_id
            }).save().on('success', function() {
              fn(null, data);
            });
          }
        },
        function(err, results) {
          var q = "SELECT name FROM equipment e WHERE e.deleted_at IS NULL AND id = "+ot.equipment_id;
          DB._.query(q, function(err, data) { 
            var description = 'La OT n° '+ot.number+' ha sido inagurada sin TAG';
            if (data){
              description = 'El equipo <a href="#">' + data[0].name + '</a> ha sido inaugurado'
            }
            DB.News.build({
              name: 'Nueva O/T',
              description: description,
              related_model: 'ot',
              related_model_id: ot.id
            }).save();
            res.send({ "id": ot.id });
          })
        });
      }).on('error', function(err) {
        res.send(false);
      });
    });
  }

  if (req.body.equipment_new) {
    DB.Equipment.build({
      name: req.body.equipment_new,
      intervention_id: req.body.intervention_id,
      client_id: req.body.client_id
    }).save().on('success', function(e) {
      createOt(e);
    });
  } else {
    createOt(null);
  } } else { res.send(false);}
};

Ot.put = function(req, res, next) {
  var ot_delivery = moment(DB.flipDateMonth(req.body.delivery)).format('YYYY-MM-DD');
  function updateOt(equipment_new) {
    var equipment_id = req.body.equipment_id;
    if (equipment_new !== null) {
      req.body.equipment_id = equipment_new.id;
    }
  DB.Ot.find({ where: { id: req.body.id } }).on('success', function(ot) {
    if (ot) {
      var current_plan_id = ot.plan_id;
      req.body.delivery = ot_delivery;
      delete req.body.created_at;
      if (req.body.agreedstart == 'NaN-NaN-NaN'){
        req.body.agreedstart = null
      }
      if (req.body.agreedend == 'NaN-NaN-NaN'){
        req.body.agreedend = null
      }
      ot.updateAttributes(req.body).on('success', function() {
        async.parallel(
        {
          tasks: function(fn) {
            var q1 = "DELETE FROM ottask WHERE ot_id = " + ot.id;

            DB._.query(q1, function(err, data) {
              var q2 = " \
                SELECT tp.*, t.* \
                FROM taskplan tp \
                INNER JOIN task t ON tp.task_id = t.id \
                WHERE tp.plan_id = " + ot.plan_id;
              DB._.query(q2, function(err, tasks) {
                if (tasks && tasks.length) {
                  var position = 1;
                  tasks.forEach(function(t) {
                    DB.Ottask.build({
                      name: t.name,
                      sent: 0,
                      description: t.description,
                      due_date: ot_delivery,
                      position: position,
                      area_id: t.area_id,
                      completed: 0,
                      reworked: 0,
                      derived_to: 0,
                      ot_id: ot.id
                    }).save().on('success', function(rt){
                      DB.Reporttask.build({
                        ot_id: t.ot_id,
                        id: rt.id,
                        observation: '',
                      })
                    });
                    position += 1;
                  });
                }
              });
            });
            fn(null, ot);
          }
        },
        function(err, results) {
          res.send({ "id": ot.id });
        });
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
  }
    if (req.body.equipment_new) {
    DB.Equipment.build({
      name: req.body.equipment_new,
      intervention_id: req.body.intervention_id,
      client_id: req.body.client_id
    }).save().on('success', function(e) {
      updateOt(e);
    });
  } else {
    updateOt(null);
  }
};

Ot.delete = function(req, res, next) {
  DB.Ot.find({ where: { id: req.params.id } }).on('success', function(ot) {
    ot.destroy().on('success', function(ot) {
      res.send({ "id": ot.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Ot;
