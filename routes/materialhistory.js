var DB, Everyone;

var Materialhistory = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Materialhistory;
};

Materialhistory.get = function(req, res, next) {
  var q = " \
    SELECT mo.*, ot.number AS ot_number, ot.equipment_id AS tag_id, \
           e.name AS tag, ott.name AS ottask \
    FROM materialorder mo \
    LEFT JOIN ot ON mo.ot_id = ot.id \
    LEFT JOIN equipment e ON ot.equipment_id = e.id \
    LEFT JOIN ottask ott ON mo.ottask_id = ott.id \
    WHERE mo.deleted_at IS NULL AND mo.history = 1\
    ORDER BY mo.date DESC \
    ";/*    SELECT moe.*, mc.name AS category, u.name AS unit \
    FROM materialorderelement moe \
    LEFT JOIN materialcategory mc ON moe.materialcategory_id = mc.id \
    LEFT JOIN unit u ON moe.unit_id = u.id \
    LEFT JOIN materialorder mo ON mo.id = moe.materialorder_id\
    WHERE mo.history = 1 AND mo.deleted_at IS NULL \
    AND moe.deleted_at IS NULL \
  \
    SELECT moe.*, mc.name AS category, u.name AS unit \
    FROM materialorderelement moe \
    LEFT JOIN materialcategory mc ON moe.materialcategory_id = mc.id \
    LEFT JOIN unit u ON moe.unit_id = u.id \
    WHERE moe.materialorder_id = " + req.params.order_id + " \
    AND moe.deleted_at IS NULL \
  \*/
  DB._.query(q, function(err, data) {
    res.send(data);
  });
};

Materialhistory.post = function(req, res, next) {
  DB.Materialhistory.build({
    "id": req.body.id,
    "name": req.body.name,
    "stock": req.body.stock,
    "unit_id": req.body.unit_id,
    "materialcategory_id": req.body.materialcategory_id
  }).save().on('success', function(material) {
    // Send the news
    DB.News.build({
      name: 'Nuevo Materialhistory',
      description: 'El Materialhistory "' + material.name + '" ha sido creado',
      related_model: 'material',
      related_model_id: material.id
    }).save();
    
    res.send({ "id": material.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Materialhistory.put = function(req, res, next) {
  DB.Materialhistory.find({ where: { id: req.body.id } }).on('success', function(m) {
    if (m) {
      req.body.created_at = DB.toMySqlDate(req.body.created_at.substr(0, 10));
      req.body.updated_at = DB.toMySqlDate(req.body.updated_at.substr(0, 10));
      
      m.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Materialhistory.delete = function(req, res, next) {
  DB.Materialhistory.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(p) {
      res.send({ "id": p.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Materialhistory;

