var DB, Everyone;

var Material = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Material;
};

Material.get = function(req, res, next) {
  var q = " \
    SELECT m.*, u.name AS unit, mc.name AS materialcategory \
    FROM material m \
    INNER JOIN unit u ON m.unit_id = u.id \
    INNER JOIN materialcategory mc ON m.materialcategory_id = mc.id \
    WHERE m.deleted_at IS NULL \
  ";
  
  DB._.query(q, function(err, data) {
    res.send(data);
  });
};


Material.byOt = function(req, res, next) {
  var q = " \
    SELECT mo.provider AS proveedor ,  mc.name AS categoria ,  moe.name as nombre, CONCAT(moe.quantity,u.name) AS unidades  \
    FROM materialorder mo\
    LEFT JOIN materialorderelement moe ON mo.id = moe.materialorder_id \
    LEFT JOIN materialcategory mc ON moe.materialcategory_id = mc.id \
    LEFT JOIN unit u ON moe.unit_id = u.id \
    WHERE mo.ot_id = " + req.params.id + " \
    AND moe.deleted_at IS NULL \
    ORDER BY mo.provider ASC\
    ";
  DB._.query(q, function(err, materials) {
    res.send(materials);
  });
};

Material.post = function(req, res, next) {
  DB.Material.build({
    "id": req.body.id,
    "name": req.body.name,
    "stock": req.body.stock,
    "unit_id": req.body.unit_id,
    "materialcategory_id": req.body.materialcategory_id
  }).save().on('success', function(material) {
    DB.News.build({
      name: 'Nuevo Material',
      description: 'El Material "' + material.name + '" ha sido creado',
      related_model: 'material',
      related_model_id: material.id
    }).save();
    
    res.send({ "id": material.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Material.put = function(req, res, next) {
  DB.Material.find({ where: { id: req.body.id } }).on('success', function(m) {
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

Material.delete = function(req, res, next) {
  DB.Material.find({ where: { id: req.params.id } }).on('success', function(p) {
    var hora =moment().format("YYYY-MM-DD HH:mm:ss");
    moe.updateAttributes({
     "deleted_at": hora
     }).on('success', function(mo) {   
     res.send({ result: true, arrived: mo.arrived })
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Material;

