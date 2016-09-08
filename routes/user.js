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
    res.send({data:data});
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
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
      var string_length = 8;
      var randomstring = '';
      for (var i=0; i<string_length; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          randomstring += chars.substring(rnum,rnum+1);
      }
      DB.User.build({
        username: req.body.username,
        password: randomstring,
        employee_id: req.body.employee_id,
        role_id: req.body.role_id,
        area_id: req.body.area_id
      }).save().on('success', function(user) {
        res.send({ result: true, "pass": randomstring });
      }).on('error', function(err) {
        res.send(false);
      });
    }
  }).on('error', function(err) {
    res.send(false);
  });
};

User.put = function(req, res, next) {
  DB.User.find({ where: { id: req.params.id } }).on('success', function(u) {
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

User.getClients = function(req, res, next) {
  var q = " \
    SELECT u.id, u.username as name \
    FROM user u \
    WHERE u.deleted_at IS NULL AND u.role_id = 6 \
  ";

  DB._.query(q, function(err, data) {
    res.send(data);
  });
}
User.generatePass = function(req, res, next){
  var user_id = req.params.user_id;
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 8;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum,rnum+1);
  }
  DB.User.find({where: {id: user_id}}).on('success', function(u){
    u.updateAttributes({password: randomstring})
    res.send(randomstring);
  })
}

module.exports = User;
