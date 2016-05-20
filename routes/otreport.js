var moment = require('moment');
var DB, Everyone;

var Otreport = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Otreport;
};

Otreport.get = function(req, res, next){
	console.log('estoy aca')
	DB._.query('SELECT client.name, MONTH(otr.updated_at) as month, SUM(otr.employee_hours)+SUM(otr.employee_minutes)/60 AS horas_hombre, COUNT(ot.id) count_ot AS ot FROM ottaskresource AS otr INNER JOIN ottask AS ott ON otr.ottask_id=ott.id INNER JOIN ot AS ot ON ott.ot_id=ot.id INNER JOIN client AS client ON ot.client_id=client.id WHERE otr.deleted_at IS NULL AND ott.deleted_at IS NULL AND ot.deleted_at is null AND YEAR(otr.updated_at)=2015 GROUP BY client.name, MONTH(otr.updated_at) ORDER BY client.name, MONTH(otr.updated_at)', function(err, data){
		
		var currentClient;
		var msg = [];
		var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		console.log(data);
		data.forEach(function(dato, index){
			var monthData = {
				horasHombre : dato.horas_hombre,
				ots: dato.count_ot
			}
			if (dato.cliente == currentClient){
				switch (dato.month){
					case 1:
						record.enero = monthData
						break;
					case 2:
						record.febrero = monthData;
						break;
					case 3:
						record.marzo = monthData;	
						break;
					case 4:
						record.abril = monthData;
						break;
					case 5:
						record.mayo = monthData;
						break;
					case 6:
						record.junio = monthData;
						break;
				}
			}
			else{
				msg.push
				currentClient = dato.cliente;
				record.nombre = dato.cliente;
			}
		})
		res.send(true);
	})
}

module.exports = Otreport;	


/*SELECT client.name, SUM(otr.employee_hours)+SUM(otr.employee_minutes)/60 AS horas_hombre, COUNT(ot.id) AS ot FROM ottaskresource AS otr INNER JOIN ottask AS ott ON otr.ottask_id=ott.id INNER JOIN ot AS ot ON ott.ot_id=ot.id INNER JOIN client AS client ON ot.client_id=client.id WHERE otr.deleted_at IS NULL AND ott.deleted_at IS NULL AND ot.deleted_at is null AND YEAR(otr.updated_at)=2015 GROUP BY client.name, MONTH(otr.updated_at) ORDER BY client.name, MONTH(otr.updated_at);*/
