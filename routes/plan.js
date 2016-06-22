var moment = require('moment'),
     util = require('util'),
    async = require('async');
var DB, Everyone;

var Plan = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Plan;
};

Plan.get = function(req, res, next) {
  var q1 = " \
    SELECT p.* \
    FROM plan p \
    WHERE p.deleted_at IS NULL \
    ORDER BY p.name ASC \
  ";
  DB._.query(q1, function(err, data) {
    var queries = [], msg = [];

    data.forEach(function(p) {
      queries.push(function(fn) {
        var tasks = [];  
	DB._.query("SELECT * FROM taskplan WHERE deleted_at IS NULL AND plan_id = " + p.id , function(err, data){	
          data.forEach(function(tp) {
            tasks.push(tp.task_id);
          });
          fn(null, {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "task_id": tasks.toString()
          });
        });
      });
    });
    async.series(queries, function(err, results) {
      res.send({data:results});
    });
  });
};

Plan.getTasks = function(req, res, next){
  DB.Taskplan.findAll({where: {plan_id: Number(req.params.id), deleted_at: null}}).on('success', function(result){
    res.send(result)
  })
}

Plan.getOne = function(req, res, next) {
  DB.Plan.findAll(DB.whereID(req.params.id)).on('success', function(x) {
    res.send(DB.dataToArray(x));
  });
};


Plan.post = function(req, res, next) {
  DB.Plan.build({
    "name": req.body.name,
    "description": req.body.description
  }).save().on('success', function(plan) {
    var task_count = Number(req.body.task_count);
    for (var i = 0; i <= task_count; i++) {
      var id = Number(eval('req.body.task_id_'+i));
      var eta = Number(eval('req.body.eta_'+i));
      DB.Taskplan.build({
          "plan_id": plan.id,
          "task_id": id,
          "eta": eta
        }).save();
    };
    /*if (Array.isArray(req.body.task_id)){
      req.body.task_id.forEach(function(id, pos) {
        DB.Taskplan.build({
          "plan_id": plan.id,
          "task_id": id
        }).save();
      });
    }
    else{
      DB.Taskplan.build({
          "plan_id": plan.id,
          "task_id": req.body.task_id
        }).save();
    }*/
    res.send({ "id": plan.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Plan.put = function(req, res, next) {
  DB.Plan.find({ where: { id: req.params.id } }).on('success', function(p) {
    if (p) {
      p.updateAttributes({
        "name": req.body.name,
        "description": req.body.description
      }).on('success', function() {
        /*var q = " \
          DELETE FROM taskplan \
          WHERE plan_id = " + req.params.id + " \
        ";
        console.log(q)
        DB._.query(q, function(err, data) {*/
          var task_count = Number(req.body.task_count);
          var ids = []
          var etas = []
          for (var i = 0; i <= task_count; i++) {
            var id = Number(eval('req.body.task_id_'+i));
            var eta = Number(eval('req.body.eta_'+i));
            ids.push(id)
            etas.push(eta);
          }  
          console.log(ids)
          DB.Taskplan.findAll({where:{plan_id: p.id}}).on('success', function(tasks){
            tasks.forEach(function(task){
              console.log(task.task_id)
              if (ids.indexOf(task.task_id) >= 0) {
                console.log('estoy aca')
                task.updateAttributes({eta: eta[ids.indexOf(task.task_id)]})
              }
              else{
                console.log('tambien aca')
                task.updateAttributes({deleted_at: moment().format('YYYY-MM-DD')})
              }
            })
          })
          res.send(req.body);
        //});
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Plan.delete = function(req, res, next) {
  DB.Plan.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.updateAttributes({deleted_at: moment().format('YYYY-MM-DD')}).on('success', function(p) {
      res.send({ "id": p.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Plan;
