var moment = require('moment'),
    async = require('async');
var DB, Everyone;

var Materialorder = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Materialorder;
};

Materialorder.get = function(req, res, next) {
  var q = " \
    SELECT mo.*, ot.number AS ot_number, ot.equipment_id AS tag_id, \
           e.name AS tag, ott.name AS ottask \
    FROM materialorder mo \
    LEFT JOIN ot ON mo.ot_id = ot.id \
    LEFT JOIN equipment e ON ot.equipment_id = e.id \
    LEFT JOIN ottask ott ON mo.ottask_id = ott.id \
    WHERE mo.deleted_at IS NULL AND mo.history IS NULL\
    ORDER BY mo.date DESC \
    ";
  DB._.query(q, function(err, data) {
    res.send({data:data});
  });
};

Materialorder.elements = function(req, res, next) {
  var q = " \
    SELECT moe.*, mc.name AS category, u.name AS unit \
    FROM materialorderelement moe \
    LEFT JOIN materialcategory mc ON moe.materialcategory_id = mc.id \
    LEFT JOIN unit u ON moe.unit_id = u.id \
    WHERE moe.materialorder_id = " + req.params.order_id + " \
    AND moe.deleted_at IS NULL \
  ";
  DB._.query(q, function(error, data) {
    if (data) {
      res.send({ result: true, elements: data });
    } else {
      res.send({ result: false, error: error });
    }
  });
};

Materialorder.post = function(req, res, next) {
console.log(req.body)
console.log(req.params)
  var q_els = DB.objectSize(req.body.materials) / 4;
  DB.Ot.find({ where: { number: req.body.ot_number } }).on('success', function(ot) {
    if (ot) {
      DB.Materialorder.find({where:{ot_id: ot.id, ottask_id: req.body.ottask_id,provider:req.body.provider}}).on('success', function(mo){
      if(mo){
            for (var i = 1; i <= q_els; i += 1) {
               var description = '';
              if (req.body.materials['material_element_' + i]) {
                description += req.body.materials['material_element_' + i] + ' ';
              };
              if (req.body.materials['externaldiameter_' + i]) {
                description += 'Øe: ' + req.body.materials['externaldiameter_' + i] + ' ';
              };
              if (req.body.materials['internaldiameter_' + i]) {
                description += 'Øi: ' + req.body.materials['internaldiameter_' + i] + ' ';
              };
              if (req.body.materials['width_' + i]) {
                description += 'Ancho: ' + req.body.materials['width_' + i] + ' ';
              };
              if (req.body.materials['height_' + i]) {
                description += 'Alto: ' + req.body.materials['height_' + i] + ' ';
              };
              if (req.body.materials['longitude_' + i]) {
                description += 'Longitud: ' + req.body.materials['longitude_' + i] + ' ';
              };
              if (req.body.materials['thickness' + i]) {
                description += 'Espesor: ' + req.body.materials['thickness' + i] + ' ';
              };

              if(req.body.materials['material_category_' + i]||req.body.materials['material_element_' + i]||req.body.materials['material_quantity_' + i]||req.body.materials['material_unit_' + i]){ 
                DB.Materialorderelement.build({
                  materialorder_id: mo.id,
                  materialcategory_id: req.body.materials['material_category_' + i],
                  name: description,//req.body.materials['material_element_' + i],
                  quantity: req.body.materials['material_quantity_' + i],
                  unit_id: req.body.materials['material_unit_' + i],
                }).save()
               }
            }
           res.send({ result: true, "id": mo.id })
      }else{
         DB.Materialorder.build({
            ot_id: ot.id,
            ottask_id: req.body.ottask_id,
            provider: req.body.provider,
            date: moment().format('DD/MM/YYYY')
          }).save().on('success', function(mo) {
            // Create all material order's elements
            async.parallel(
            {
              elements: function(fn) {
                for (var i = 1; i <= q_els; i += 1) {
               if(req.body.materials['material_category_' + i]||req.body.materials['material_element_' + i]||req.body.materials['material_quantity_' + i]||req.body.materials['material_unit_' + i]){ 
                    DB.Materialorderelement.build({
                      materialorder_id: mo.id,
                      materialcategory_id: req.body.materials['material_category_' + i],
                      name: req.body.materials['material_element_' + i],
                      quantity: req.body.materials['material_quantity_' + i],
                      unit_id: req.body.materials['material_unit_' + i],
                    }).save();
                   }
                }
                fn(null, q_els);
              }
            },
            function(err, results) {
              // Send the news
              var q = "SELECT name FROM equipment e WHERE e.deleted_at IS NULL AND id = "+ot.equipment_id;
              DB._.query(q, function(err, data) {   
                DB.News.build({
                  name: 'Pedido de Materiales',
                  description: 'Nuevo pedido para el equipo <a href="#">Nº ' +
                               data[0].name + '</a> ha sido inaugurado',
                  related_model: 'materialorder',
                  related_model_id: mo.id
                }).save();
                res.send({ result: true, "id": mo.id });
              })              
            });
          }).on('error', function(err) {
            res.send(false);
          });
        } 
      })
    } else {
      res.send(false);
    }
  });
};

Materialorder.put = function(req, res, next) {
  DB.Materialorder.find({ where: { id: req.body.id } }).on('success', function(mo) {
    if (mo) {
      req.body.created_at = DB.toMySqlDate(req.body.created_at.substr(0, 10));
      req.body.updated_at = DB.toMySqlDate(req.body.updated_at.substr(0, 10));
      mo.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Materialorder.arrival = function(req, res, next) {  
  DB.Materialorderelement.find({
    where: { id: req.params.element_id }
    ,include: [{model: DB.MaterialCategory}]
  }).on('success', function(moe) {
    if (moe) {
     var hora =moment().format("YYYY-MM-DD HH:mm:ss");
     var humanDate = moment().format("DD/MM/YYYY");
     var remiobs = req.params.observation.split("::");
     if(req.params.quantity != 0){
      qe= '\
     INSERT INTO materialreception (date, created_at, updated_at, deleted_at, user_id, materialorderelement_id,quantity,remito,observation) VALUES ("'+humanDate+'","'+hora+'"," '+hora+'", NULL, "'+req.session.user_id+'" , '+moe.id+', '+req.params.quantity +",'"+remiobs[0]+"','"+remiobs[1]+"')";
     DB._.query(qe);     console.log("CREO NUEVA RECEPCION CON TODOS SUS DATOS");
     DB.Materialorder.find({ where: { id: moe.materialorder_id } }).on('success', function(mo) {
        DB.Ot.find({where: {id: mo.ot_id }}).on('success',function(ot){
          var q = "SELECT name FROM equipment e WHERE e.deleted_at IS NULL AND id = "+ot.equipment_id;
          var q2= "SELECT name FROM materialCategory m WHERE m.id = "+moe.materialcategory_id;
          DB._.query(q, function(err, data) {   
            DB._.query(q2, function(err2, data2) {   
              if(data){
                if(data2){          
                  DB.News.build({
                    name: 'Recepcion de materiales',
                    description: 'El equipo <a href="#">' + data[0].name + '</a> Recibió '+data2[0].name +"("+moe.name+")",
                    related_model: 'ot',
                    related_model_id: ot.id
                  }).save();
                }else{
                  DB.News.build({
                    name: 'Recepcion de materiales',
                    description: 'El equipo <a href="#">' + data[0].name + '</a> Recibió Materiales',
                    related_model: 'ot',
                    related_model_id: ot.id
                  }).save();              
                }
              }
            }) 
          })     
        })
       DB.Ottask.findAll({where : {ot_id: mo.ot_id}}).on('success', function(ott){ 
       		if(ott){
		       ott.forEach(function(task){
		          if(task.name == "Recepción parcial de Materiales"){
		           /*CAMBIAR TAREASELECCIONADA POR LA TAREA QUE ES*/
		         	 task.updateAttributes({
             		      		 completed: 1,
             		      		 completed_date: moment().format('YYYY-MM-DD')
             		      		 }).on('success', function() {
             		      		      console.log("ACTUALIZA LA OT! poniendo 'V' en la qe corresponda");

             		      		 });
		          }

		        }); 
		       }; 
     sum =" \
       SELECT SUM(quantity) AS total\
       FROM materialreception \
       WHERE materialorderelement_id = "+ moe.id;
       DB._.query(sum, function(error, data) {
       if (data) {
         console.log("Cantidad Pedida=", moe.quantity,"Recibido = ",data[0].total);
         if(moe.quantity <= data[0].total){
           moe.updateAttributes({
	          "arrived": 1,//moe.arrived!,
	          "updated_at": hora,
	           }).on('success', function(moU) {   
	           console.log("arrived = 1" );  
		    res.send({ result: true, arrived: moU.arrived });
          });
      }else{
     		moe.updateAttributes({
		     "arrived": 0,
		     "updated_at": hora,
		      }).on('success', function(moU) {   
		       res.send({ result: true, arrived: moU.arrived });
	      });
      };
      } else {
        res.send({ result: false, error: error });
      }
	      		     });
		});
     });
   };
   }
  }).on('error', function(error) {
    res.send({ result: false, error: error });
  });
};

Materialorder.delete = function(req, res, next) {
  DB.Materialorder.find({ where: { id: req.params.id } }).on('success', function(mo) {
    mo.destroy().on('success', function(mo) {
      res.send({ "id": mo.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

Materialorder.elementdelete = function(req, res, next) {
 console.log(req.params.id);
  console.log("req.params.id");
DB.Materialorderelement.find({ where: { id: req.params.id } }).on('success', function(moe) {
 var hora =moment().format("YYYY-MM-DD HH:mm:ss");
 console.log(req.params.id);
 moe.updateAttributes({
   "deleted_at": hora,
   "updated_at": hora,
 }).on('success', function(mo) {   
     res.send({ result: true, arrived: mo.arrived });
 });
}).on('error', function(error) {
    res.send(error);
  });
};

Materialorder.elementUpdate = function(req, res, next) {
DB.Materialorderelement.find({ where: { id: req.params.id } }).on('success', function(moe) {
 var name = req.params.name.replace("$","/"); 
 var hora =moment().format("YYYY-MM-DD HH:mm:ss");
 moe.updateAttributes({
     "updated_at": hora,
     "name": name,
     "quantity": req.params.quantity
 }).on('success', function(mo) {   
     res.send({ result: true, arrived: mo.arrived });
 });
 }).on('error', function(error) {
    res.send(error);
  });
}
 
 
 
module.exports = Materialorder;
