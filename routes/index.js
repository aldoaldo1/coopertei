var Auth = require('../auth.js'),
    async = require('async'),
    moment = require('moment');

var DB, Everyone;

var Index = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Index;
};

Index.get = function(req, res, next) {
  var role_per_template = [null, 'vigilance', 'operator', 'supervisor', 'admin', 'sysadmin', 'client', 'boss'];

  var getAllFrom = function(table) {
    return "SELECT * FROM " + table + " WHERE deleted_at IS NULL";
  };

  async.parallel(
  {
    provinces: function(fn) {
      DB._.query(getAllFrom('province'), function(err, data) {
        fn(err, data);
      });
    },
    cities: function(fn) {
      DB._.query(getAllFrom('city'), function(err, data) {
        fn(err, data);
      });
    },
    roles: function(fn) {
      DB._.query(getAllFrom('role'), function(err, data) {
        fn(err, data);
      });
    },
    permissions: function(fn) {
      DB._.query(getAllFrom('permission'), function(err, data) {
        fn(err, data);
      });
    },
    areas: function(fn) {
      DB._.query(getAllFrom('area'), function(err, data) {
        fn(err, data);
      });
    }
  },
  function(errors, results) {
    //req.session['datasets'] = results;

    res.render(role_per_template[req.session.role_id], {
      session: req.session,
      date: moment().format('DD/MM/YYYY - hh:mm:ss')
    });
  });
};

module.exports = Index;
