var DB, Everyone;

var News = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return News;
};

News.get = function(req, res, next) {
  DB.News.findAll(
    { where: ["deleted_at IS NULL"], limit: 20, order: 'created_at DESC' }
  ).on('success', function(news) {
    res.send(DB.dataToArray(news));
  });
};

News.post = function(req, res, next) {
  DB.News.build(req.body).save().on('success', function(news) {
    res.send({ "id": news.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

News.put = function(req, res, next) {
  res.send(true);
};

News.delete = function(req, res, next) {
  DB.News.find({ where: { id: req.params.id } }).on('success', function(n) {
    n.destroy().on('success', function(n) {
      res.send({ "id": n.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = News;
