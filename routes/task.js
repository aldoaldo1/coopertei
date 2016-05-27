var DB, Everyone;

var Task = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Task;
};

Task.get = function(req, res, next) {
  var q = " \
    SELECT t.*, a.name AS area \
    FROM task t \
    INNER JOIN area a ON t.area_id = a.id \
    WHERE t.deleted_at IS NULL \
    ORDER BY t.id ASC \
    "; /*t.name*/
  DB._.query(q, function(err, tasks) {
    if (tasks) {
      res.send({data:tasks});
    } else {
      res.send(false);
    }
  });
};


Task.post = function(req, res, next) {
  DB.Task.build(req.body).save().on('success', function(task) {
    res.send({ "id": task.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Task.put = function(req, res, next) {
  DB.Task.find({ where: { id: req.body.id } }).on('success', function(t) {
    if (t) {
      t.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Task.delete = function(req, res, next) {
  DB.Task.find({ where: { id: req.params.id } }).on('success', function(t) {
    t.destroy().on('success', function(t) {
      res.send({ "id": t.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Task;
