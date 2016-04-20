var DB, Everyone;

var Profile = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Profile;
};

Profile.get = function(req, res, next) {
  var q = " \
    SELECT u.*, e.*, p.*, \
           u.password AS password1, u.password AS password2, \
           a.name AS area, r.name AS role, \
           CONCAT(p.firstname, ' ', p.lastname) AS employee \
    FROM user u \
    LEFT JOIN role r ON u.role_id = r.id \
    LEFT JOIN employee e ON u.employee_id = e.id \
    LEFT JOIN person p ON e.person_id = p.id \
    LEFT JOIN area a ON e.area_id = a.id \
    WHERE u.deleted_at IS NULL AND u.id = " +req.session.user_id+ "\
  ";
  DB._.query(q, function(err, data) {
    res.send(data);
  });
};

Profile.put = function(req, res, next) {
  var data = req.body;
  
  DB.User.find(DB.whereID(req.session.user_id)).on('success', function(u) {
    DB.Employee.find(DB.whereID(u.employee_id)).on('success', function(e) {
      if (e) {
        DB.Person.find(DB.whereID(e.person_id)).on('success', function(p) {
          if (p) {
            p.updateAttributes({
              firstname: data.firstname,
              lastname: data.lastname,
              phone: data.phone,
              email: data.email
            }).on('success', function() {
              res.send(req.body);
            }).on('error', function(err) {
              res.send(false);
            });
          }
        });
      }
    });
  });
};

Profile.changePassword = function(req, res, next) {
  var pass1 = req.body.password1,
      pass2 = req.body.password2;
  
  if (pass1 === pass2) {
    DB.User.find(DB.whereID(req.session.user_id)).on('success', function(u) {
      if (u) {
        u.updateAttributes({ password: pass1 }).on('success', function() {
          res.send(req.body);
        }).on('error', function(err) {
          res.send(false);
        });
      }
    });
  }
};

module.exports = Profile;

