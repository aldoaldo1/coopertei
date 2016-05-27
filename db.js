var fs = require('fs'),
    mysql = require('mysql'),
    mysqlqueue = require('mysql-queues'),
    Sequelize = require('sequelize'),
    _ = require('underscore'),
    moment = require('moment');
    require('dotenv').config();

module.exports = function() {
  var env = process.env;
  var DB_HOST = process.env.DB_HOST, //'localhost',
      DB_PORT = process.env.DB_PORT, //'/var/run/mysqld/mysqld.sock',
      DB_USER = process.env.DB_USER, //'root',
      DB_PASS = process.env.DB_PASS, //'Emc#362',
      DB_NAME = process.env.DB_NAME; //'coopertei';

  // ORM

  var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    logging: console.log,
    define: { timestamps: true, paranoid: true, underscored: true, freezeTableName: true }
  });
  
  // Basic client

  var DB = {
    _: mysql.createClient({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME
    }),

    whereID: function(id) {
      return { where: ["id = ? AND deleted_at IS NULL", id] };
    },

    flipDateMonth: function(date) {
      var x = date.substr(0, 10);
      return x[3]+x[4]+x[5]+x[0]+x[1]+x[2]+x[6]+x[7]+x[8]+x[9] + date.substr(10, date.length);
    },

    toMySqlDate: function(humandate) {
      if (humandate === null) {
        return null;
      }

      var x = new Date(humandate),
          date = '';

      date += x.getFullYear();
      date += '-';
      date += (x.getDate() < 10 ? '0' : '') + x.getDate();
      date += '-';
      date += ((x.getMonth()+1) < 10 ? '0' : '') + (x.getMonth()+1);

      return date;
    },

    toHumanDate: function(mysqldate) {
      if (mysqldate === null) {
        return null;
      }

      var x = new Date(mysqldate),
          date = '';

      x.setHours(x.getHours() + 3); // GMT correction

      date += (x.getDate() < 10 ? '0' : '') + x.getDate();
      date += '/';
      date += ((x.getMonth()+1) < 10 ? '0' : '') + (x.getMonth()+1);
      date += '/';
      date += x.getFullYear();
      date += ' ';
      date += (x.getHours() < 10 ? '0' : '') + x.getHours();
      date += ':';
      date += (x.getMinutes() < 10 ? '0' : '') + x.getMinutes();
      date += ':';
      date += (x.getSeconds() < 10 ? '0' : '') + x.getSeconds();

      return date;
    },

    dataToArray: function(data) {
      var arr = [];

      data.forEach(function(record, i) {
        arr[i] = {};
        record.attributes.forEach(function(attr) {
          arr[i][attr] = record[attr];
        });
      });

      return arr;
    },

    deleteById: function(req, res, entity) {
      entity.find({ where: { id: req.params.id } }).on('success', function(x) {
        x.destroy().on('success', function(x) {
          res.send({a: x, b: !0});
        }).on('error', function(error) {
          res.send(error);
        });
      }).on('error', function(error) {
        res.send(error);
      });
    },

    // TOFIX: This should live in a Functions module, which doesn't exist now
    objectSize: function(obj) {
      var size = 0, key;

      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          size++;
        }
      }

      return size;
    }
  };

  // Models

  var modelFiles = fs.readdirSync(__dirname + '/models');
  var model, Model;

  modelFiles.forEach(function(val, index, array) {
    model = val.split('.')[0];
    Model = model.charAt(0).toUpperCase() + model.slice(1);

    DB[Model] = sequelize.import(__dirname + '/models/' + model + '.js');
  });

  DB.City.belongsTo(DB.Province);

  DB.Employee.belongsTo(DB.Person);
  DB.Employee.belongsTo(DB.Area);

  DB.User.belongsTo(DB.Employee);
  DB.User.belongsTo(DB.Role);
  DB.User.belongsTo(DB.Area);

  DB.Client.belongsTo(DB.City);
  DB.Client.belongsTo(DB.User);

  DB.Clientnotification.belongsTo(DB.Client);

  DB.Equipment.belongsTo(DB.Intervention);
  DB.Equipment.belongsTo(DB.Client);

  DB.Plan.hasMany(DB.Taskplan);

  DB.Task.hasMany(DB.Taskplan);
  DB.Task.belongsTo(DB.Area);

  DB.Ottask.belongsTo(DB.Ot);
  DB.Ottask.belongsTo(DB.Area);

  DB.Ottaskemployee.belongsTo(DB.Employee);
  DB.Ottaskemployee.belongsTo(DB.Ottask);

  DB.Ottaskresource.belongsTo(DB.Ottask);

  DB.Ot.belongsTo(DB.Client);
  DB.Ot.belongsTo(DB.Equipment);
  DB.Ot.belongsTo(DB.Intervention);
  DB.Ot.belongsTo(DB.Plan);
  DB.Ot.belongsTo(DB.Otstate);

  DB.Authorization.belongsTo(DB.Client);
  DB.Authorization.belongsTo(DB.Ot);
  DB.Authorization.belongsTo(DB.Otstate);

  DB.Report.belongsTo(DB.Ot);
  DB.Report.belongsTo(DB.Client);

  DB.Reportphoto.belongsTo(DB.Report);

  DB.Reporttask.belongsTo(DB.Report);
  DB.Reporttask.belongsTo(DB.Ottask);

  DB.Materialorder.belongsTo(DB.Ot);
  DB.Materialorder.belongsTo(DB.Ottask);

  DB.Materialorderelement.belongsTo(DB.Materialorder);
  DB.Materialorderelement.belongsTo(DB.Materialcategory);
  DB.Materialorderelement.belongsTo(DB.Unit);

  DB.Inout.belongsTo(DB.Employee);

  // Structure
  var mq = mysqlqueue(DB._, false);  
/*
  sequelize.drop().on('success', function() {
    sequelize.sync().on('success', function() {

      var mq = mysqlqueue(DB._, false);
      
      // Import Provinces and Cities
      var q = DB._.createQueue(),
          pdc = __dirname + '/pc_bsas.sql';

      fs.readFileSync(pdc).toString().split('\n').forEach(function(line) {
        q.query(line);
      });
      q.execute();

      // Import everything else
      require(__dirname + '/db_build.js')(DB);
    });
  });
*/
  return DB;
};
