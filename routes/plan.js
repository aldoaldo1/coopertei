var util = require('util'),
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
	DB._.query("SELECT * FROM taskplan WHERE plan_id = " + p.id , function(err, data){	
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
    req.body.task_id.forEach(function(id, pos) {
      DB.Taskplan.build({
        "plan_id": plan.id,
        "task_id": id
      }).save();
    });
    
    res.send({ "id": plan.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Plan.put = function(req, res, next) {
  DB.Plan.find({ where: { id: req.body.id } }).on('success', function(p) {
    if (p) {
      p.updateAttributes({
        "name": req.body.name,
        "description": req.body.description
      }).on('success', function() {
        var q = " \
          DELETE FROM taskplan \
          WHERE plan_id = " + req.body.id + " \
        ";
        
        DB._.query(q, function(err, data) {
          if (util.isArray(req.body.task_id)) {
            req.body.task_id.forEach(function(id, pos) {
              DB.Taskplan.build({
                "task_id": id,
                "plan_id": req.body.id
              }).save();
            });
          } else {
            DB.Taskplan.build({
              "task_id": req.body.task_id,
              "plan_id": req.body.id
            }).save();
          }
          
          res.send(req.body);
        });
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Plan.delete = function(req, res, next) {
  DB.Plan.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(p) {
      res.send({ "id": p.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Plan;
