var DB, Everyone;

var User = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return User;
};

User.get = function(req, res, next) {
  var q = " \
    SELECT u.*, r.name AS role, a.name AS area, \
           CONCAT(p.firstname, ' ', p.lastname) AS employee \
    FROM user u \
    LEFT JOIN employee e ON u.employee_id = e.id \
    LEFT JOIN role r ON u.role_id = r.id \
    LEFT JOIN area a ON u.area_id = a.id \
    LEFT JOIN person p ON e.person_id = p.id \
    WHERE u.deleted_at IS NULL \
  ";

  DB._.query(q, function(err, data) {
    res.send(data);
  });
};

User.currentAreaId = function(req, res, next) {
  DB.User.find({ where: { id: req.session.user_id } }).on('success', function(u) {
    res.send({
      result: true,
      area_id: u.area_id || 0
    });
  });
};

User.post = function(req, res, next) {
  DB.User.find({ where: { username: req.body.username } }).on('success', function(u) {
    if (u) {
      res.send({ result: false, error: 'Usuario existente' });
    } else {
      DB.User.build({
        username: req.body.username,
        password: req.body.username,
        employee_id: req.body.employee_id,
        role_id: req.body.role_id,
        area_id: req.body.area_id
      }).save().on('success', function(user) {
        res.send({ result: true, "user": user });
      }).on('error', function(err) {
        res.send(false);
      });
    }
  }).on('error', function(err) {
    res.send(false);
  });
};

User.put = function(req, res, next) {
  DB.User.find({ where: { id: req.body.id } }).on('success', function(u) {
    if (u) {
      delete req.body.created_at;
      delete req.body.updated_at;

      u.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

User.delete = function(req, res, next) {
  DB.User.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(p) {
      res.send({ "id": p.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = User;
