var DB, Everyone;

var Query = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Query;
};

Query.post = function(req, res, next) {
  res.send([{}]);
};

module.exports = Query;
