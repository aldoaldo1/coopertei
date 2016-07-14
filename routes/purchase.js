var moment = require('moment');

var Purchase = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Purchase;
};

Purchase.get = function(req, res, next) {
  var q = " \
    SELECT moe.*, mc.name as category, ot.number AS ot_number, ot.equipment_id AS tag_id, \
           e.name AS tag, ott.name AS ottask \
    FROM materialorderelement moe \
    INNER JOIN materialorder mo ON  moe.materialorder_id = mo.id \
    INNER JOIN materialcategory mc ON mc.id = moe.materialcategory_id \
    LEFT JOIN ot ON mo.ot_id = ot.id \
    LEFT JOIN equipment e ON ot.equipment_id = e.id \
    LEFT JOIN ottask ott ON mo.ottask_id = ott.id \
    WHERE mo.deleted_at IS NULL AND mo.history IS NULL and mo.provider = 'Coopertei'\
    ORDER BY mo.date DESC \
    ";
    console.log(q)
  DB._.query(q, function(err, data) {
    var elements = [];
    data.forEach(function(el){
      var date = (el.arrivaldate) ? moment(el.arrivaldate).format('DD/MM/YYYY') : ''; 
      elements.push({
        id: el.id,
        ot: el.ot_number,
        name: el.name,
        category: el.category,
        quantity: el.quantity,
        arrivaldate: date,
        tag: el.tag
      })
    })
    res.send({data:elements});
  });
};

Purchase.put = function(req, res, next){
  console.log(req.body)
  DB.Materialorderelement.find({ where: { id: req.params.id } }).on('success', function(e) {
    if (e) {
      delete req.body.created_at;
      delete req.body.updated_at;
      
      var date = req.body.arrivaldate; 
      date = date.split('/')[2]+'-'+date.split('/')[1]+'-'+date.split('/')[0];
                    
      e.updateAttributes({arrivaldate: new Date(date)}).on('success', function() {
        console.log('heraldo')
        res.send(true);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};


 
module.exports = Purchase;