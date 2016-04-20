var DB, Everyone;

var Schedule = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Schedule;
};

Schedule.get = function(req, res, next) {
  DB.Schedule.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(schedules) {
    res.send(DB.dataToArray(schedules));
  });
};

module.exports = Schedule;

