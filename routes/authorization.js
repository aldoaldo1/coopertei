var moment = require('moment'),
    nodemailer = require('nodemailer'),
    getmac = require('getmac');
    require('dotenv').config;

var exec = require('child_process').exec;var execTest = require('child_process').exec;
var fs = require('fs');
var DB, Everyone, PATH;

var Authorization = function(db, everyone, path) {
  DB = db;
  Everyone = everyone;
  PATH = path;
  return Authorization;
};

Authorization.get = function(req, res, next) {
  var q = " \
    SELECT a.*, ot.number AS ot_number, c.name AS client, o.name AS otstate \
    FROM authorization a \
    LEFT JOIN ot ot ON a.ot_id = ot.id \
    LEFT JOIN client c ON a.client_id = c.id \
    LEFT JOIN otstate o ON a.otstate_id = o.id \
    WHERE a.otstate_id < 4 AND a.deleted_at IS NULL \
    ORDER BY a.otstate_id ASC \
  ";/*EMC INNER por LEFT */
  DB._.query(q, function(err, data) {
    var msg = [];
    data.forEach(function(a) {
      msg.push({
        "id": a.id,
        "req_info_sent_date": a.req_info_sent_date,
        "ot_number": a.ot_number,
        "ot_id": a.ot_id,
        "client": a.client,
        "client_id": a.client_id,
        "otstate": a.otstate,
        "otstate_id": a.otstate_id,
      });
    });
    res.send({data:msg});
  });
};

Authorization.post = function(req, res, next) {

  DB.Authorization.build(req.body).save().on('success', function(authorization) {
    // Send the news
    DB.News.build({
      name: 'Nueva Autorizaci&oacute;n',
      description: 'Se ha autorizado una O/T',
      related_model: 'authorization',
      related_model_id: authorization.id
    }).save();
    res.send({ "id": authorization.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Authorization.put = function(req, res, next) {
  DB.Authorization.find({ where: { id: req.body.id } }).on('success', function(a) {
    if (a) {
      req.body.created_at = DB.toMySqlDate(req.body.created_at.substr(0, 10));
      req.body.updated_at = DB.toMySqlDate(req.body.updated_at.substr(0, 10));
      a.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Authorization.setSessionOtId = function(req, res, next) {
  console.log(req.params)
  DB.Ot.find({ where: { number: req.params.ot_number } }).on('success', function(ot) {
    if (ot) {
      req.session.auth_selected_ot_id = ot.id;
      DB.Report.find({ where: { ot_id: ot.id } }).on('success', function(r) {
        if (r) {
          DB.Reporttask.findAll({ where: { report_id: r.id } }).on('success', function(reporttasks) {
            DB.Reportphoto.findAll({ where: {
              report_id: r.id,
              deleted_at: null
            } }).on('success', function(reportphotos) {
              var msg = {
                result: true,
                report_tasks: [],
                report_photos: []
              };
              if (reporttasks.length) {
                msg.report_tasks = reporttasks;
              }
              if (reportphotos.length) {
                msg.report_photos = reportphotos;
              }
              res.send(msg);
            });
          });
        } else {
          res.send({ result: false });
        }
      });
    } else {
      res.send({ result: false });
    }
  });
};

//ALTER TABLE  `ottask` ADD  `sent` BOOLEAN NOT NULL DEFAULT  '0' AFTER  `observation`
actualizarOtt = function(a){
  DB.Ottask.findAll({where:{ot_id: a}}).on('success',function(tasks){
    tasks.forEach(function(t){
      t.updateAttributes({sent: !0})
    })
  })

};

Authorization.saveRequirementsReport = function(req, res, next) {
  var ot_id = req.session.auth_selected_ot_id;
  actualizarOtt(ot_id)
  DB.Report.find({ where: { ot_id: ot_id } }).on('success', function(r) {
    if (r) {
      var q = "DELETE FROM reporttask WHERE report_id = " + r.id;
      DB._.query(q, function(err, data) {
        DB.Ottask.findAll({ where: { ot_id: ot_id } }).on('success', function(tasks) {
          tasks.forEach(function(t) {
            DB.Reporttask.build({
              report_id: r.id,
              ottask_id: t.id,
              observation: req.body['task_observation_' + t.id]
            }).save();
          });
          var qq = " \
    		    SELECT ot.*, c.email, e.name AS name_equipment,\
    		    c.name AS client_name, i.name AS intervention_name ,p.name AS plan_name\
    		    FROM ot\
    		    INNER JOIN client c ON ot.client_id = c.id\
    		    LEFT JOIN equipment e ON ot.equipment_id = e.id\
    		    LEFT JOIN intervention i ON i.id = ot.intervention_id\
    		    LEFT JOIN plan p ON p.id = ot.plan_id\
    		    WHERE ot.id = " + ot_id + " \
    		    ";/* ot_id antes era r.id*/
          DB._.query(qq, function(err, ot) {
            if (ot.length) {
              DB.Report.find({ where: { ot_id: ot[0].id } }).on('success', function(r) {
                // Get Reporttasks
                var q1 = " \
                  SELECT rt.*, ott.name AS name, ott.priority AS priority \
                  FROM reporttask rt \
                  LEFT JOIN ottask ott ON rt.ottask_id = ott.id \
                  WHERE rt.report_id = " + r.id + " AND ott.deleted_at is NULL \
                  ORDER BY ott.priority\
                  ";
                DB._.query(q1, function(error, tasks) {
                  // Build list
                  var html ='<h1> COOPERTEI Ltda. </h1><p>Leyenda06/09/13</p>'; 
              	  var date = moment().format('DD/MM/YYYY');
              	  var material_inform = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body style='font-family: arial'><div style='width:1000px; margin: 0 auto'><div style='float:left; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br /> INFORME DE REQUERIMIENTOS DE MATERIALES</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div><table width='1000px' border='1' align='center'><tr><th colspan='4' style='background-color:#999'><span style='font-size:12; font-weight:bold' >DATOS DEL CLIENTE</span></th><th align = 'left'; colspan='3'style='background-color:#FFF'><span style='font-size:10; font-weight:bold'>O/T Coopertei:"+ot[0].number+" </span></th></tr><tr><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>Nombre:"+ot[0].client_name+"</span></div></th><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>O/C:</span></div></th><td rowspan='2'><div align='center'><span style='font-size:12; font-weight:bold''>Proveedor</span><span style='font-size:12; font-weight:bold''>&nbsp;del Material</span></div></td><td width='179'> <div align='left'><span style='font-size:12; font-weight:bold''>Cliente</span> </div></td> <td width='89'> <span style='font-size:12; font-weight:bold''>X</span> </td></tr><tr><th height='24' colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>Equipo:&nbsp;"+ot[0].name_equipment+"</span></div></th><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>O/T Cliente:&nbsp;"+ot[0].client_number+"</span></div></th><td><div align='left'><span style='font-size:12; font-weight:bold'>Coopertei</span></div></td><td align='center'><span style='font-size:12; font-weight:bold''>&nbsp;</span></td></tr><tr><th colspan='7'><div align='left'><span style='font-size:12; font-weight:bold''>Tarea:"+ot[0].plan_name+"</span></div></th></tr></table><table width='1000px' border='1' align='center'><tr><td align='center'; width='300px'><span style='font-size:12; font-weight:bold''>MATERIAL</span></td><td align='center'; width='600px'><span style='font-size:12; font-weight:bold''>DETALLE</span></td><td align='center'; width='100px'><span style='font-size:12; font-weight:bold''>CANT</span></td></tr>";
                  var task_inform = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body><div style='width:1003px; margin: 0 auto' ><div style='float:left; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br />INFORME DE REQUERIMIENTOS DE TAREAS</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div><table width='1000' border='1' align='center'> <th width='1000' colspan='3' bgcolor='#EEEEEE' ><span style='font-size:19px; font-weight:bold'>DATOS DEL CLIENTE</span></th><tr><th colspan='2' align='left'> NOMBRE:&nbsp;"+ot[0].client_name+"</th><td><span style='font-size:16px; font-weight:bold'>O/C:</span></td></tr><tr><th colspan='2' align='left'>EQUIPO:&nbsp;"+ot[0].name_equipment+"</th><td><span style='font-size:16px; font-weight:bold'>O/T:&nbsp;"+ ot[0].client_number+"</span></td></tr><th width='1000' colspan='3' align='left'>MOTIVO DE LA INTEVERNCIÓN:&nbsp;"+ot[0].plan_name+"</th><tr><td align= 'center'; width='50px' bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold'>ITEM</span></td><td align= 'center';  width='450px' bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold; text-align:center'>TAREAS A REALIZAR</span></td><td align= 'center';  bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold'>OBSERVACIONES</span></td>";
              	  var contador = 1;
                  if (tasks.length) {
                    console.log(tasks.length)
                    var task_style = 'text-decoration:underline; font-weight:bold;';
                    tasks.forEach(function(t) {
                      console.log(t.id)
                      if(t.priority>0){
        			          task_inform +="</tr><tr><td align='center'>"+contador+"</td><td>"+t.name+"</td><td>"+t.observation+"</td></tr>";
        		          	  contador ++;
        	        	  }
                    });
                  } else {
                    html += 'La Órden de Trabajo  N&ordm;: '+ ot[0].client_number +' del Equipo ' + ot[0].name_equipment + ' id Coopertei:  ' + ot[0].number + ' (todav&iacute;a) no posee tareas.</li>';
                  }
                  var con = " \
              	    SELECT moe.*, mc.name AS category, u.name AS unit, mo.provider AS provider_name  \
              	    FROM materialorder mo\
              	    LEFT JOIN materialorderelement moe ON mo.id = moe.materialorder_id \
              	    LEFT JOIN materialcategory mc ON moe.materialcategory_id = mc.id \
              	    LEFT JOIN unit u ON moe.unit_id = u.id \
              	    WHERE mo.ot_id = " + ot[0].id + " AND moe.deleted_at IS null \
              	    AND moe.deleted_at IS NULL \
              	   ";
            	    var aq=0;
            	    var internalaq=0;
            	    DB._.query(con, function(error, e) {
            		    if(e.length){
            			    e.forEach(function(e){
            				    if(e.provider_name == 'Cliente'){
            					    aq++;
            					    var units = " ";    
            					    if(e.units != null){
            					        units = e.unit.split(" ");
            					    }
            					
              				    material_inform += "<tr><td width=300px><span >"+e.category+"</span></td><td width=600px><span >"+e.name +"</span></td><td width='100px'><span >"+ e.quantity + units[0] +"<span></td></tr>";/*AGREGUE e.unit*/

                        }
            				    if(e.provider_name == 'Coopertei'){
            					      internalaq++;
            					      var internal_material_inform ="<tr><td>"+e.quantity+"</td><td>"+e.category+"</td><td>"+e.name+"</td></tr>";
            			      }
            			    });
            		    };
                    // Get Reportphotos
                    DB.Reportphoto.findAll({
                      where: { report_id: r.id, deleted_at: null }
                    }).on('success', function(photos) {
                    // Send e-mail to Client
                    setTimeout( function(){ /*ENVIOMAIL*/
                      var transport = nodemailer.createTransport('SMTP', {
                	      service: 'SMTP',
                	      host: process.env.STMP_HOST,//'mail.coopertei.com.ar',
                        auth: {
                          user: process.env.STMP_USER,//'notificaciones@coopertei.com.ar',
                          pass: process.env.STMP_PASS//'CoopSys'
                        }
                      })
                    }, 20000);
                		for (var i=contador;i<34;i++){ 
                			task_inform +="<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                		}

                    var firma ="\
                    SELECT CONCAT (p.firstname, ' ' , p.lastname) AS name \
                    FROM user AS u \
                    INNER JOIN employee AS em ON em.id = u.employee_id \
                    INNER JOIN person AS p ON p.id = em.person_id \
                    WHERE u.id = '"+ req.session.user_id +"'\
                    ";
                    if (ot[0].report_sent_by != null){
                      firma ="\
                      SELECT CONCAT (p.firstname, ' ' , p.lastname) AS name \
                      FROM user AS u \
                      INNER JOIN employee AS em ON em.id = u.employee_id \
                      INNER JOIN person AS p ON p.id = em.person_id \
                      WHERE u.id = "+ ot[0].report_sent_by +"\
                      ";
                    }
                    DB._.query(firma, function(error, uf) {
		                  console.log(aq, "TEXT")
                  		if (!uf[0]){
                        uf[0] = {name: ''}
                      }
                      task_inform += "  <tr><th width='1000' colspan='3' bgcolor='#EEEEEE'><span style='font-size:18px;  font-weight:bold'>CONFORMIDAD DE LAS PARTES</span></th></tr><tr><th width='1000' colspan='2'><br /><br /><br /></th><th><br />"+uf[0].name+"<br /></th></tr><tr><th width='1000' colspan='2'>Firma y aclaración del Cliente</th><th> Firma y aclaración por Coopertei</th></tr></table><p align='right'> R-P2.4/0 <br /> Vigencia: 01/09/06</p></div></body></html>";
                  		for (var i=aq;i<28;i++){ 
                  			material_inform +="<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</span></td></tr>";
                  		}
                  		material_inform += "</table><table width='1000px' border='1' align='center'><tr><th colspan='7' style='background-color:#999'><span style='font-size:18px;  font-weight:bold'>CONFORMIDAD DE LAS PARTES</span></th>  </tr>  <tr>  <th colspan='4'><br /><br /><br />    <br /></th><th colspan='3'><br />"+uf[0].name+"<br />   <br /></th>  </tr>  <tr>  <th colspan='4'>Firma y aclaración del Cliente</th>  <th colspan='3'> Firma y aclaración por Coopertei</th></tr></table><p align='right'> R-P2.5/0 <br /> Vigencia: 01/09/06</p></div></body></html>";
                  		material_inform=task_inform+'<br><br><br><br><br><br><br>'+material_inform;
                    	
                      DB.Reportphoto.findAll({
                       	 where: { report_id: r.id, deleted_at: null }
                  	  }).on('success', function(photos) {
                        if (photos.length > 0){
                          material_inform += "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body style='font-family:arial; page-break-after: always;'><div style='width:1000px; margin: 0 auto'><br><br><br><br><br><br><br><div style='float:left; page-break-after: always;; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br /> INFORME DE REQUERIMIENTOS IMAGENES</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div>";var i=0;
                        }
                      	photos.forEach(function(ph) {
                      		i++;
                    			material_inform += "<img src=/srv/coopsys/app/public/uploads/"+ ph.path+" width=49% />";
                    			if( i % 2 == 0){
                    			  material_inform +="<br />";
                    			}else{
              			        material_inform +="&nbsp;&nbsp;&nbsp;";
                    			}
      		              });
                        material_inform += "</body></html>";  
                      	var htmlFileNameMaterial = "/tmp/material_inform"+ot[0].id+".html", pdfFileNameMaterial = "/tmp/material_inform"+ot[0].id+".pdf";
                      	var childre= exec('rm '+htmlFileNameMaterial, function(err, stdout, stderr) {
                      	  err? console.log("ERROR"):console.log("OKOKOK");
                      	})
                      	var childr= exec('rm '+pdfFileNameMaterial, function(err, stdout, stderr) {
                      	  err? console.log("ERROR"):console.log("OKOKOK");
                      	})	
                      	fs.writeFile(htmlFileNameMaterial, material_inform, function(err) {});
                      	var child= exec('xvfb-run -s"-screen 0 1024x768x24" wkhtmltopdf '+htmlFileNameMaterial+" "+pdfFileNameMaterial, function(err, stdout, stderr) {
                       			err ? console.log("ESTA CON ERROR"):console.log("no hubo error");
                      			console.log(stdout);	
                      	});
                      }).on('error', function(err) {
                        res.send(false);
                      });
                    }).on('error', function(err) {
                      res.send(false);
                    });
                  }).on('error', function(err) {
                    res.send(false);
                  });
                }).on('error', function(err) {
                  res.send(false);
                });  
              }).on('error', function(err) {
                res.send(false);
              });
            }).on('error', function(err) {
              res.send(false);
            });
          } else {
            res.send({ result: true, report_id: r.id });
          }
        });
          res.send({ result: true, report_id: r.id });
        });
      });
    } else {
      res.send({ result: false });
    }
  }); 

};

Authorization.addPhotoToReport = function(req, res, next) {
  console.log(req.session)
  console.log(req.session.auth_selected_ot_id)
  req.files.photos.forEach(function(ph) {
     DB.Report.find({ where: { ot_id: req.session.auth_selected_ot_id } }).on('success', function(r) {
      var path= ph.path.split('/').pop()
      DB.Reportphoto.build({
        report_id: r.id,
        path: path,
        name: ph.name
      }).save().on('success', function() {
        res.send(true);
        var array = __dirname.split('/')
        array.splice(array.length-1, 1 );
        var route= array.join('/')
        array.splice(array.length-1, 1 );
        var nconvert = array.join('/')
        var archivo= ' '+route+'/public/uploads/'+path
        var exc=''+nconvert+'/nconvert -overwrite -out jpeg -ratio -q 50 -o'+archivo+archivo
        console.log(exc)
        exec(exc, function(err, stdout, stderr) {
          if(err){
            console.log(err)
          }
        });
      }).on('error', function() {
        res.send(false);
      });
    });
  });
};

Authorization.delPhotofromReport = function(req, res, next) {
  DB.Reportphoto.find({ where: { id: req.params.photo_id } }).on('success', function(data) {  
    console.log(data.path)
    var child= exec('rm /srv/coopsys/public/uploads/'+data.path, function(err, stdout, stderr) {
      if(err){
        console.log("ESTA CON ERROR O NO EXISTE EL ARCHIVO")
      }
      var q = 'DELETE FROM reportphoto WHERE id='+data.id;
      DB._.query(q, function(err, data) {    		
        if(!err){
          res.send({ result: true, id: req.params.photo_id });
        }
      })
	  })
  }).on('error', function(error) { 
  res.send({ result: false, error: 'error' });
  })
};

Authorization.notifyClient = function(req, res, next) {
  var q = " \
    SELECT ot.*, c.email, e.name AS name_equipment, c.name AS client_name, i.name AS intervention_name ,p.name AS plan_name\
    FROM ot\
    INNER JOIN client c ON ot.client_id = c.id\
    LEFT JOIN equipment e ON ot.equipment_id = e.id\
    LEFT JOIN intervention i ON i.id = ot.intervention_id\
    LEFT JOIN plan p ON p.id = ot.plan_id\
    WHERE ot.id = " + req.params.ot_id + " \
  ";
  DB._.query(q, function(err, ot) {
    if (ot.length) {
      if (ot[0].report_sent_by == null){
        DB._.query('UPDATE ot SET report_sent_by = '+req.session.user_id+' WHERE id = '+ot[0].id);
      }
      DB.Report.find({ where: { ot_id: ot[0].id } }).on('success', function(r) {
        // Get Reporttasks
        var q1 = " \
          SELECT rt.*, ott.name AS name, ott.priority AS priority \
          FROM reporttask rt \
          LEFT JOIN ottask ott ON rt.ottask_id = ott.id \
          WHERE rt.report_id = " + r.id + " AND ott.deleted_at IS NULL AND ott.priority> 0\
	        ORDER BY ott.description\
        "; console.log(q1); 
        DB._.query(q1, function(error, tasks) {
          var html ='<h1> COOPERTEI Ltda. </h1><p>Leyenda</p>'; 
          var date = moment().format('DD/MM/YYYY');
          var firma ="\
        	SELECT CONCAT (p.firstname, ' ' , p.lastname) AS name \
        	FROM user AS u \
        	INNER JOIN employee AS em ON em.id = u.employee_id \
        	INNER JOIN person AS p ON p.id = em.person_id \
        	WHERE u.username = '"+ req.session.username +"'\
        	";
        	DB._.query(firma, function(error, uf) {
            var sftppath = 'em1.coopertei.com.ar/coopsys';
            if(process.env.ENV == 'dev'){
              sftppath = 'file:///run/user/1000/gvfs/sftp:host=servidor,user=root'
            }
        	  var material_inform = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body style='font-family: arial'><div style='width:1000px; margin: 0 auto'><div style='float:left; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br /> INFORME DE REQUERIMIENTOS DE MATERIALES</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div><table width='1000px' border='1' align='center'><tr><th colspan='4' style='background-color:#999'><span style='font-size:12; font-weight:bold' >DATOS DEL CLIENTE</span></th><th align = 'left'; colspan='3'style='background-color:#FFF'><span style='font-size:10; font-weight:bold'>O/T Coopertei:"+ot[0].number+" </span></th></tr><tr><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>Nombre:"+ot[0].client_name+"</span></div></th><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>O/C:</span></div></th><td rowspan='2'><div align='center'><span style='font-size:12; font-weight:bold''>Proveedor</span><span style='font-size:12; font-weight:bold''>&nbsp;del Material</span></div></td><td width='179'> <div align='left'><span style='font-size:12; font-weight:bold''>Cliente</span> </div></td> <td width='89'> <span style='font-size:12; font-weight:bold''>X</span> </td></tr><tr><th height='24' colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>Equipo:&nbsp;"+ot[0].name_equipment+"</span></div></th><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>O/T Cliente:&nbsp;"+ot[0].client_number+"</span></div></th><td><div align='left'><span style='font-size:12; font-weight:bold'>Coopertei</span></div></td><td align='center'><span style='font-size:12; font-weight:bold''>&nbsp;</span></td></tr><tr><th colspan='7'><div align='left'><span style='font-size:12; font-weight:bold''>Tarea:"+ot[0].plan_name+"</span></div></th></tr></table><table width='1000px' border='1' align='center'><tr><td align='center'; width='300px'><span style='font-size:12; font-weight:bold''>MATERIAL</span></td><td align='center'; width='600px'><span style='font-size:12; font-weight:bold''>DETALLE</span></td><td align='center'; width='100px'><span style='font-size:12; font-weight:bold''>CANT</span></td></tr>";
            var task_inform = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body><div style='width:1003px; margin: 0 auto' ><div style='float:left; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br />INFORME DE REQUERIMIENTOS DE TAREAS</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div><table width='1000' border='1' align='center'> <th width='1000' colspan='3' bgcolor='#EEEEEE' ><span style='font-size:19px; font-weight:bold'>DATOS DEL CLIENTE</span></th><tr><th colspan='2' align='left'> NOMBRE:&nbsp;"+ot[0].client_name+"</th><td><span style='font-size:16px; font-weight:bold'>O/C:</span></td></tr><tr><th colspan='2' align='left'>EQUIPO:&nbsp;"+ot[0].name_equipment+"</th><td><span style='font-size:16px; font-weight:bold'>O/T:&nbsp;"+ ot[0].client_number+"</span></td></tr><th width='1000' colspan='3' align='left'>MOTIVO DE LA INTEVERNCIÓN:&nbsp;"+ot[0].plan_name+"</th><tr><td align= 'center'; width='50px' bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold'>ITEM</span></td><td align= 'center';  width='450px' bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold; text-align:center'>TAREAS A REALIZAR</span></td><td align= 'center';  bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold'>OBSERVACIONES</span></td>";   
            var contador = 1;
            if (tasks.length) {
	  	        contador ++;
            }
            var con = " \
        	    SELECT moe.*, mc.name AS category, u.name AS unit, mo.provider AS provider_name  \
        	    FROM materialorder mo\
        	    LEFT JOIN materialorderelement moe ON mo.id = moe.materialorder_id \
        	    LEFT JOIN materialcategory mc ON moe.materialcategory_id = mc.id \
        	    LEFT JOIN unit u ON moe.unit_id = u.id \
        	    WHERE mo.ot_id = " + ot[0].id + " \
        	    AND moe.deleted_at IS NULL \
        	   ";
          	var aq=0;
          	var internalaq=0;
        	  DB._.query(con, function(error, e) {
          		if(e.length){
                e.forEach(function(e){
                  if(e.provider_name == 'Coopertei'){
                    internalaq++;
                    internal_material_inform +="<tr><td>"+e.quantity+"</td><td>"+e.category+"</td><td>"+e.name+"</td></tr>";
                  }
                  if(e.provider_name == 'Cliente'){
                    aq++;
                    material_inform += "<tr><td width=300px><span >"+e.category+"</span></td><td width=600px><span >"+e.name +"</span></td><td width='100px'><span >"+ e.quantity +"<span></td></tr>";
                  }
                });
              };
              DB.Reportphoto.findAll({
                where: { report_id: r.id, deleted_at: null }
              }).on('success', function(photos) {
              var transport = nodemailer.createTransport('SMTP', {
        	      service: 'SMTP',
        	      host: process.env.STMP_HOST,
                auth: {
                  user: process.env.STMP_USER,
                  pass: process.env.STMP_PASS
                }
              });
          		var attached_photos = [];
          		if(internalaq != 0){
          		  for(var i=internalaq;i<11;i++){
          				internal_material_inform += "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
          		  }
          		  internal_material_inform += "</table><p><span style='font-size:1px'></span></p><table width='100%' border='2'><tr><td width='auto'><div align='center'><strong>Posibles Proveedores</strong></div></td><td width='25,9%'><div align='center'><strong>Sugerido</strong></div></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table><p><span style='font-size:1px'></span></p><table width='100%' border='2'><td><div align='left'><strong>3.Condiciones de entrega</strong></div></td></table><p><span style='font-size:1px'></span></p><table width='100%' border='2'><tr><td><div align='center'><strong>Fecha de entrega solicitada</strong></div></td><td><div align='center'><strong>Lugar de entrega</strong></div></td><td><div align='center'><strong>Otras condiciones</strong></div></td></tr><tr><td>&nbsp;</td>  <td>&nbsp;</td>  <td>&nbsp;</td></tr>  </table><p><span style='font-size:1px'></span></p><table width='100%' border='2'><td><div align='left'><strong>4.Observaciones e información adicional</strong></div></td></table><p><span style='font-size:1px'></span></p><div style='border: 1px solid #000; width: 100%; height: 240px'><div align='left'>Una Observacion</div></div></div><p align='right' style='font-size:12px'>R-P 4.5/0<span align='right' style='font-size:8px'><br />Vigencia: 20/06/08</span></p></div></body></html>";
          			var internal_attached_photos = [];
          			internal_attached_photos.push({
                  fileName: "OT-"+ot[0].number+" Cliente: "+ot[0].client_number+" Equipo: "+ot[0].name_equipment+".odt",
                  contents: internal_material_inform
          			});
          			var internalMailOptions = {
            			from: process.env.STMP_USER,
            			to: process.env.STMP_SHOP,
            			bcc: process.env.STMP_USER,
            			subject: '[Coopertei] Pedido de Materiales de Orden de trabajo: '+  ot[0].client_number +' del Equipo ' + ot[0].name_equipment + ' id Coopertei:  ' + ot[0].number,
            			replyTo: process.env.STMP_USER,
            			html: html,
            			generateTextFromHTML: true,
            		 	attachments: internal_attached_photos
          	    };
          			transport.sendMail(internalMailOptions, function(error, response) {
          			  transport.close();
          			});		
          		
          		}		

          		for (var i=contador;i<24;i++){ 
                task_inform +="<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
              }
              task_inform += "  <tr><th width='1000' colspan='3' bgcolor='#EEEEEE'><span style='font-size:18px;  font-weight:bold'>CONFORMIDAD DE LAS PARTES</span></th></tr><tr><th width='1000' colspan='2'><br /><br /><br /></th><th><br />"+req.session.username+"<br /></th></tr><tr><th width='1000' colspan='2'>Firma y aclaración del Cliente</th><th> Firma y aclaración por Coopertei</th></tr></table><p align='right'> R-P2.4/0 <br /> Vigencia: 01/09/06</p></div></body></html>";
              for (var i=aq;i<24;i++){ 
                material_inform +="<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</span></td></tr>";
              }

              material_inform += "</table><table width='1000px' border='1' align='center'><tr><th colspan='7' style='background-color:#999'><span style='font-size:18px;  font-weight:bold'>CONFORMIDAD DE LAS PARTES</span></th>  </tr>  <tr>  <th colspan='4'><br /><br /><br />    br /></th><th colspan='3'><br />"+req.session.username+"<br /><br /></th>  </tr>  <tr>  <th colspan='4'>Firma y aclaración del Cliente</th>  <th colspan='3'> Firma y aclaración por Coopertei</th></tr></table><p align='right'> R-P2.5/0 <br /> Vigencia: 01/09/06</p></div></body></html>";
            
              var clientNumber = ot[0].client_number;
              clientNumber.replace('/', '');
              clientNumber.replace('/', '');
              attached_photos.push({
                fileName: "OT-"+ot[0].number+" Cliente: "+ot[0].client_number+" Equipo: "+ot[0].name_equipment+".pdf",
                filePath: "/tmp/material_inform"+ot[0].id+".pdf"
              });
              var to = ot[0].email;
              if(process.env.ENV == 'dev'){
                to = process.env.STMP_USER;
              }

              var mailOptions = {
                from: process.env.STMP_USER,
                to: to,
                bcc: process.env.STMP_USER,
                subject: '[Coopertei] Notificación de Órden de Trabajo: '+  ot[0].client_number +' del Equipo ' + ot[0].name_equipment + ' id Coopertei:  ' + ot[0].number,
                replyTo: process.env.STMP_USER,
                html: html,
                generateTextFromHTML: true,
                attachments: attached_photos
              };

              setTimeout(function(){
                transport.sendMail(mailOptions, function(error, response) {
                transport.close();
              }); },5000);

              DB.Authorization.find({ where: { ot_id: ot[0].id } }).on('success', function(a) {
                console.log('Fecha', a.req_info_sent_date)
                if (a.req_info_sent_date == null){
                  a.updateAttributes({req_info_sent_date: moment().format('DD/MM/YYYY')});
                }

                if (a) {
                  a.updateAttributes({
                    otstate_id: 2,
                    //req_info_sent_date: moment().format('DD/MM/YYYY')
                  }).on('success', function() {
                    DB.Ot.find({ where: { id: ot[0].id } }).on('success', function(ot) {
                      if (ot) {
                        ot.updateAttributes({ otstate_id: 2 }).on('success', function() {
                          res.send(true);
                        });
                      }
                    });
                  }).on('error', function(err) {
                    res.send(false);
                  });
                }
              }).on('error', function(err) {
                res.send(false);
              });            
            }).on('error', function(err) {
              res.send(false);
            });
          }).on('error', function(err) {
            res.send(false);
          });
        }).on('error', function(err) {
          res.send(false);
        });  
      }).on('error', function(err) {
        res.send(false);
      });
    }).on('error', function(err) {
      res.send(false);
    });
    } else {
      res.send(false);
    }
  });
};


Authorization.confirm = function(req, res, next) {
  var params = req.body
  console.log(params);

  
  DB.Authorization.find({ where: { ot_id: params.ot_id } }).on('success', function(a) {
    if (a) {
      q = 'SELECT * FROM materialorderelement moe \
          INNER JOIN materialorder mo ON moe.materialorder_id = mo.id \
          INNER JOIN ot ON mo.ot_id = ot.id \
          WHERE ot.id = '+params.ot_id+' AND moe.arrived IS NULL';

      console.log(q)
      DB._.query(q, function(err, data){
        var state;
        if (data.length > 0){
          state = 4;  
        }
        else{
          state = 5;
        }
        DB.Ot.find({where: {id: params.ot_id}}).on('success', function(ot){
          if (req.session.role_id == 6){
            setTimeout( function(){ /*ENVIOMAIL*/
              var transport = nodemailer.createTransport('SMTP', {
                service: 'SMTP',
                host: process.env.STMP_HOST,//'mail.coopertei.com.ar',
                auth: {
                  user: process.env.STMP_USER,//'notificaciones@coopertei.com.ar',
                  pass: process.env.STMP_PASS//'CoopSys'
                }
              })
              var html = '<div class="print hidden"> \
                  <h3 class="formtitle">Datos de la observacion</h3> \
                  <p><span><strong style="font-weight:800">IP: </strong>'+params.ip+'</span></p> \
                  <p><strong style="font-weight:800">MAC: </strong>'+params.mac+'</p> \
                  <p><strong style="font-weight:800">Fecha: </strong>'+moment(params.created_at).format('DD/MM/YYYY')+'</p> \
                  <p><strong style="font-weight:800">Observación: </strong>'+params.observation+'</p><br>\
              </div>';

              var internalMailOptions = {
                from: process.env.STMP_USER,
                to: process.env.TECNICA,
                bcc: process.env.STMP_USER,
                subject: '[Coopertei] Notificacion de O/T '+ot.number,
                replyTo: process.env.STMP_USER,
                html: html,
                generateTextFromHTML: true,
              };
              transport.sendMail(internalMailOptions, function(error, response) {
                transport.close();
              });
            }, 20000);

          }
          if(ot.otstate_id < 4){
            ot.updateAttributes({otstate_id: state})
          }
        })
        if (a.otstate_id < 4){
          a.updateAttributes({ otstate_id: state, ip: params.ip, mac: params.mac, user_id: req.session.user_id})
        };
        if (params.observation != ''){
          DB.Otobservation.create({
            observation: params.observation,
            ip: params.ip,
            mac: params.mac,
            isClient: (req.session.role_id == 6)? 1 : 0,  
            user_id: req.session.user_id,
            ot_id: params.ot_id,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
        res.send(true);
      })
    }
  });
};

Authorization.delete = function(req, res, next) {
  DB.Authorization.find({ where: { id: req.params.id } }).on('success', function(a) {
    a.destroy().on('success', function(a) {
      res.send({ "id": a.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

Authorization.preview = function(req, res, next) {
  var ot_id = req.params.ot_id
  DB.Report.find({ where: { ot_id: ot_id } }).on('success', function(r) {
    if (r) {
      DB.Ottask.findAll({ where: { ot_id: ot_id } }).on('success', function(tasks) {
        tasks.forEach(function(t) {
        });
        var qq = " \
          SELECT ot.*, c.email, e.name AS name_equipment, \
          c.name AS client_name, i.name AS intervention_name ,p.name AS plan_name\
          FROM ot\
          INNER JOIN client c ON ot.client_id = c.id\
          LEFT JOIN equipment e ON ot.equipment_id = e.id\
          LEFT JOIN intervention i ON i.id = ot.intervention_id\
          LEFT JOIN plan p ON p.id = ot.plan_id\
          WHERE ot.id = " + ot_id + " \
          ";/* ot_id antes era r.id*/
        DB._.query(qq, function(err, ot) {
          if (ot.length) {
            DB.Report.find({ where: { ot_id: ot[0].id } }).on('success', function(r) {
              // Get Reporttasks
              var q1 = " \
                SELECT rt.*, ott.name AS name, ott.priority AS priority \
                FROM reporttask rt \
                LEFT JOIN ottask ott ON rt.ottask_id = ott.id \
                WHERE rt.report_id = " + r.id + " AND ott.deleted_at is NULL \
                ORDER BY ott.priority\
                ";
              DB._.query(q1, function(error, tasks) {
                // Build list
                var html ='<h1> COOPERTEI Ltda. </h1><p>Leyenda06/09/13</p>'; 
                var date = moment().format('DD/MM/YYYY');
                var material_inform = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body style='font-family: arial'><div style='width:1000px; margin: 0 auto'><div style='float:left; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br /> INFORME DE REQUERIMIENTOS DE MATERIALES</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div><table width='1000px' border='1' align='center'><tr><th colspan='4' style='background-color:#999'><span style='font-size:12; font-weight:bold' >DATOS DEL CLIENTE</span></th><th align = 'left'; colspan='3'style='background-color:#FFF'><span style='font-size:10; font-weight:bold'>O/T Coopertei:"+ot[0].number+" </span></th></tr><tr><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>Nombre:"+ot[0].client_name+"</span></div></th><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>O/C:</span></div></th><td rowspan='2'><div align='center'><span style='font-size:12; font-weight:bold''>Proveedor</span><span style='font-size:12; font-weight:bold''>&nbsp;del Material</span></div></td><td width='179'> <div align='left'><span style='font-size:12; font-weight:bold''>Cliente</span> </div></td> <td width='89'> <span style='font-size:12; font-weight:bold''>X</span> </td></tr><tr><th height='24' colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>Equipo:&nbsp;"+ot[0].name_equipment+"</span></div></th><th colspan='2'><div align='left'><span style='font-size:12; font-weight:bold''>O/T Cliente:&nbsp;"+ot[0].client_number+"</span></div></th><td><div align='left'><span style='font-size:12; font-weight:bold'>Coopertei</span></div></td><td align='center'><span style='font-size:12; font-weight:bold''>&nbsp;</span></td></tr><tr><th colspan='7'><div align='left'><span style='font-size:12; font-weight:bold''>Tarea:"+ot[0].plan_name+"</span></div></th></tr></table><table width='1000px' border='1' align='center'><tr><td align='center'; width='300px'><span style='font-size:12; font-weight:bold''>MATERIAL</span></td><td align='center'; width='600px'><span style='font-size:12; font-weight:bold''>DETALLE</span></td><td align='center'; width='100px'><span style='font-size:12; font-weight:bold''>CANT</span></td></tr>";
                var task_inform = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body><div style='width:1003px; margin: 0 auto' ><div style='float:left; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br />INFORME DE REQUERIMIENTOS DE TAREAS</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div><table width='1000' border='1' align='center'> <th width='1000' colspan='3' bgcolor='#EEEEEE' ><span style='font-size:19px; font-weight:bold'>DATOS DEL CLIENTE</span></th><tr><th colspan='2' align='left'> NOMBRE:&nbsp;"+ot[0].client_name+"</th><td><span style='font-size:16px; font-weight:bold'>O/C:</span></td></tr><tr><th colspan='2' align='left'>EQUIPO:&nbsp;"+ot[0].name_equipment+"</th><td><span style='font-size:16px; font-weight:bold'>O/T:&nbsp;"+ ot[0].client_number+"</span></td></tr><th width='1000' colspan='3' align='left'>MOTIVO DE LA INTEVERNCIÓN:&nbsp;"+ot[0].plan_name+"</th><tr><td align= 'center'; width='50px' bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold'>ITEM</span></td><td align= 'center';  width='450px' bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold; text-align:center'>TAREAS A REALIZAR</span></td><td align= 'center';  bgcolor='#EEEEEE'><span style='font-size:18px; font-weight:bold'>OBSERVACIONES</span></td>";
                var contador = 1;
                if (tasks.length) {
                  console.log(tasks.length)
                  var task_style = 'text-decoration:underline; font-weight:bold;';
                  tasks.forEach(function(t) {
                    if(t.priority>0){
                      task_inform +="</tr><tr><td align='center'>"+contador+"</td><td>"+t.name+"</td><td>"+t.observation+"</td></tr>";
                        contador ++;
                    }
                  });
                } else {
                  html += 'La Órden de Trabajo  N&ordm;: '+ ot[0].client_number +' del Equipo ' + ot[0].name_equipment + ' id Coopertei:  ' + ot[0].number + ' (todav&iacute;a) no posee tareas.</li>';
                }
                var con = " \
                  SELECT moe.*, mc.name AS category, u.name AS unit, mo.provider AS provider_name  \
                  FROM materialorder mo\
                  LEFT JOIN materialorderelement moe ON mo.id = moe.materialorder_id \
                  LEFT JOIN materialcategory mc ON moe.materialcategory_id = mc.id \
                  LEFT JOIN unit u ON moe.unit_id = u.id \
                  WHERE mo.ot_id = " + ot[0].id + " AND moe.deleted_at IS null \
                  AND moe.deleted_at IS NULL \
                 ";
                var aq=0;
                var internalaq=0;
                DB._.query(con, function(error, e) {
                  if(e.length){
                    e.forEach(function(e){
                      if(e.provider_name == 'Cliente'){
                        aq++;
                        var units = " ";    
                        if(e.units != null){
                            units = e.unit.split(" ");
                        }
                    
                        material_inform += "<tr><td width=300px><span >"+e.category+"</span></td><td width=600px><span >"+e.name +"</span></td><td width='100px'><span >"+ e.quantity + units[0] +"<span></td></tr>";/*AGREGUE e.unit*/

                      }
                      if(e.provider_name == 'Coopertei'){
                          internalaq++;
                          var internal_material_inform ="<tr><td>"+e.quantity+"</td><td>"+e.category+"</td><td>"+e.name+"</td></tr>";
                      }
                    });
                  };
                  // Get Reportphotos
                  DB.Reportphoto.findAll({
                    where: { report_id: r.id, deleted_at: null }
                  }).on('success', function(photos) {
                  // Send e-mail to Client
                  for (var i=contador;i<34;i++){ 
                    task_inform +="<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
                  }
                
                  var firma ="\
                  SELECT CONCAT (p.firstname, ' ' , p.lastname) AS name \
                  FROM user AS u \
                  INNER JOIN employee AS em ON em.id = u.employee_id \
                  INNER JOIN person AS p ON p.id = em.person_id \
                  WHERE u.id = '"+ req.session.user_id +"'\
                  ";
                  if (ot[0].report_sent_by){
                    firma = "\
                    SELECT CONCAT (p.firstname, ' ' , p.lastname) AS name \
                    FROM user AS u \
                    INNER JOIN employee AS em ON em.id = u.employee_id \
                    INNER JOIN person AS p ON p.id = em.person_id \
                    WHERE u.id = '"+ ot[0].report_sent_by +"'\
                    ";
                  }
                  DB._.query(firma, function(error, uf) {
                    console.log(aq, "TEXT")
                    if (!uf[0]){
                      uf[0] = {name: ''}
                    }
                    task_inform += "  <tr><th width='1000' colspan='3' bgcolor='#EEEEEE'><span style='font-size:18px;  font-weight:bold'>CONFORMIDAD DE LAS PARTES</span></th></tr><tr><th width='1000' colspan='2'><br /><br /><br /></th><th><br />"+uf[0].name+"<br /></th></tr><tr><th width='1000' colspan='2'>Firma y aclaración del Cliente</th><th> Firma y aclaración por Coopertei</th></tr></table><p align='right'> R-P2.4/0 <br /> Vigencia: 01/09/06</p></div></body></html>";
                    for (var i=aq;i<28;i++){ 
                      material_inform +="<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</span></td></tr>";
                    }
                    material_inform += "</table><table width='1000px' border='1' align='center'><tr><th colspan='7' style='background-color:#999'><span style='font-size:18px;  font-weight:bold'>CONFORMIDAD DE LAS PARTES</span></th>  </tr>  <tr>  <th colspan='4'><br /><br /><br />    <br /></th><th colspan='3'><br />"+uf[0].name+"<br />   <br /></th>  </tr>  <tr>  <th colspan='4'>Firma y aclaración del Cliente</th>  <th colspan='3'> Firma y aclaración por Coopertei</th></tr></table><p align='right'> R-P2.5/0 <br /> Vigencia: 01/09/06</p></div></body></html>";
                    material_inform=task_inform+'<br><br><br><br><br><br><br>'+material_inform;
                    
                    DB.Reportphoto.findAll({
                       where: { report_id: r.id, deleted_at: null }
                    }).on('success', function(photos) {
                      if (photos.length > 0){
                        material_inform += "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN''http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>COOPERTEI</title></head><body style='font-family:arial; page-break-after: always;'><div style='width:1000px; margin: 0 auto'><br><br><br><br><br><br><br><div style='float:left; width:200px;height:112px' align='left'><img src='"+process.env.BASE_URL+"/images/coop.jpg' width='300px'/></div><div style='float:left;height:112px; width:600px' align='center'><h1 align='center'><h1 align='center'><br /> INFORME DE REQUERIMIENTOS IMAGENES</h1></div><div style='float:left; width:500px; text-align:left'><h2>FECHA:"+date+"</h2></div><div style='float:left; width:500px; text-align:right'><h2> N° O/T:&nbsp;"+ot[0].number+" </h2></div>";  
                      }
                      var i=0;
                      photos.forEach(function(ph) {
                        i++;
                        material_inform += "<img src="+process.env.BASE_URL+"/uploads/"+ ph.path+" width=49% />";
                        if( i % 2 == 0){
                          material_inform +="<br />";
                        }else{
                          material_inform +="&nbsp;&nbsp;&nbsp;";
                        }
                      });
                      material_inform += "</body></html>";  
                      var htmlFileNameMaterial = "/tmp/material_inform"+ot[0].id+".html", pdfFileNameMaterial = "/tmp/material_inform"+ot[0].id+".pdf";
                      var childre= exec('rm '+htmlFileNameMaterial, function(err, stdout, stderr) {
                        err? console.log("ERROR"):console.log("OKOKOK");
                      })
                      var childr= exec('rm '+pdfFileNameMaterial, function(err, stdout, stderr) {
                        err? console.log("ERROR"):console.log("OKOKOK");
                      })  
                      fs.writeFile(htmlFileNameMaterial, material_inform, function(err) {});
                      var child= exec('xvfb-run -s"-screen 0 1024x768x24" wkhtmltopdf '+htmlFileNameMaterial+" "+pdfFileNameMaterial, function(err, stdout, stderr) {
                          err ? console.log("ESTA CON ERROR"):console.log("no hubo error");
                      });
                      res.send(material_inform);
                    }).on('error', function(err) {
                      res.send(false);
                    });
                  }).on('error', function(err) {
                    res.send(false);
                  });
                }).on('error', function(err) {
                  res.send(false);
                });
              }).on('error', function(err) {
                res.send(false);
              });  
            }).on('error', function(err) {
              res.send(false);
            });
          }).on('error', function(err) {
            res.send(false);
          });
        }
      });
        //res.send({ result: true, report_id: r.id });
      });
    }
  }); 

};

Authorization.getData = function(req, res, next){
  getmac.getMac(function(err,macAddress){
    if (err)  throw err
    
    data = {
      ip: req.connection.remoteAddress,
      mac: macAddress,
    }
    res.send(data)
  })
}

module.exports = Authorization;
