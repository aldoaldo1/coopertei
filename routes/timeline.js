var DB, Everyone;

var Timeline = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Timeline;
};

Timeline.get = function(req, res, next) {
  res.render('timeline.html', { layout: false });
};

module.exports = Timeline;

