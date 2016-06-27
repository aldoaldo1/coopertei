var async = require('async');
var DB, Everyone;

var Employee = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Employee;
};

Employee.get = function(req, res, next) {
console.log(req.session.area_id);
  var q;
  if(req.session.role_id < 0){console.log("con area");
  q = " \
    SELECT e.*, e.id AS id, \
           CONCAT(p.lastname, ', ', p.firstname) AS person, \
           CONCAT(p.lastname, ', ', p.firstname) AS name, \
           a.name AS area, \
           s1.name AS schedule_ini, s2.name AS schedule_end, \
           CONCAT(s1.name, ' - ', s2.name) AS schedule \
    FROM employee e \
    LEFT JOIN person p ON e.person_id = p.id \
    LEFT JOIN area a ON e.area_id = a.id \
    INNER JOIN schedule s1 ON e.schedule_ini_id = s1.id \
    INNER JOIN schedule s2 ON e.schedule_end_id = s2.id \
    WHERE e.deleted_at IS NULL \
    AND e.area_id = "+req.session.area_id+" \
  ";}else{console.log("sin area");
  q=" \
    SELECT e.*, e.id AS id, \
           CONCAT(p.lastname, ', ', p.firstname) AS person, \
           CONCAT(p.lastname, ', ', p.firstname) AS name, \
           a.name AS area, \
           s1.name AS schedule_ini, s2.name AS schedule_end, \
           CONCAT(s1.name, ' - ', s2.name) AS schedule \
    FROM employee e \
    LEFT JOIN person p ON e.person_id = p.id \
    LEFT JOIN area a ON e.area_id = a.id \
    INNER JOIN schedule s1 ON e.schedule_ini_id = s1.id \
    INNER JOIN schedule s2 ON e.schedule_end_id = s2.id \
    WHERE e.deleted_at IS NULL \
  ";}
  DB._.query(q, function(err, data) {
    res.send({data:data});
  });
};

Employee.getOne = function(req, res, next) {
  DB.Employee.findAll(DB.whereID(req.params.id)).on('success', function(x) {
    res.send(DB.dataToArray(x));
  });
};

Employee.post = function(req, res, next) {
  DB.Employee.build({
    "payroll_number": req.body.payroll_number,
    "person_id": req.body.person_id,
    "area_id": req.body.area_id,
    "schedule_ini_id": req.body.schedule_ini_id,
    "schedule_end_id": req.body.schedule_end_id,
    "intern": req.body.intern
  }).save().on('success', function(employee) {
    // Send the news
    DB.News.build({
      name: 'Nuevo Empleado',
      description: 'El Empleado con Legajo Nº "' + employee.payroll_number + '" ha sido creado',
      related_model: 'employee',
      related_model_id: employee.id
    }).save();

    res.send({ "id": employee.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Employee.put = function(req, res, next) {
  DB.Employee.find({ where: { id: req.params.id } }).on('success', function(e) {
    if (e) {
      e.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Employee.tasksProductivity = function(req, res, next) {
  var e_ids = req.body.employee_ids,
      ids = '',
      tasks_per_employee = [];

  if (!e_ids.length) {
    res.send({ result: true, tasks_per_employee: [] });
    return;
  }

  e_ids.forEach(function(id) {
    ids += "'" + id.toString() + "',";
  });
  ids = ids.substr(0, ids.length - 1);

  var q = " \
    SELECT otr.*, CONCAT(p.lastname, ', ', p.firstname) AS name \
    FROM ottaskresource otr \
    INNER JOIN employee e ON otr.employee_id = e.id \
    INNER JOIN person p ON e.person_id = p.id \
    WHERE otr.employee_id IN (" + ids + ") \
  ";

  DB._.query(q, function(error, data) {
    if (data.length) {
      for (var i = 0; i < e_ids.length; i += 1) {
        var name, tasks = [];

        data.forEach(function(t) {
          if (t.employee_id == e_ids[i]) {
            name = t.name;
            tasks.push(t);
          } else {
            name = '';
          }
        });

        tasks_per_employee.push({
          employee: name,
          tasks: tasks
        });
      }

      res.send({ result: true, tasks_per_employee: tasks_per_employee });
    } else {
      res.send({ result: true, tasks_per_employee: [] });
    }
  });
};

Employee.delete = function(req, res, next) {
  DB.Employee.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(e) {
      res.send({ "id": e.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Employee;
