var DB, Everyone;

var Materialreception = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Materialreception;
};

Materialreception.get = function(req, res, next) {
  DB.Materialreception.findAll(
    { where: ["deleted_at IS NULL"]}
  ).on('success', function(materialreception) {
    res.send(DB.dataToArray(materialreception));
  });
};

Materialreception.post = function(req, res, next) {
  DB.Materialreception.build(req.body).save().on('success', function(materialreception) {
    res.send({ "id": materialreception.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Materialreception.byElements = function(req, res, next) {
  var q = " \
    SELECT moe.name AS matname ,mc.name as mccat ,u.username AS user, m.date AS date , m.quantity  AS quantity , m.observation AS observation, m.remito AS remito\
    FROM materialreception AS m \
    LEFT JOIN materialorderelement moe ON moe.id = m.materialorderelement_id\
    LEFT JOIN materialcategory mc ON mc.id = moe.materialcategory_id \
    LEFT JOIN user u ON u.id= m.user_id \
    WHERE m.materialorderelement_id = " + req.params.order_id + " AND m.deleted_at IS NULL \
    "; 
  DB._.query(q, function(err, r) {
    res.send(r);
  });
};


Materialreception.put = function(req, res, next) {
  res.send(true);
};

Materialreception.delete = function(req, res, next) {
  DB.Materialreception.find({ where: { id: req.params.id } }).on('success', function(n) {
    n.destroy().on('success', function(n) {
      res.send({ "id": n.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Materialreception;
