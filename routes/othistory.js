var moment = require('moment');
var DB, Everyone;

var Othistory = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Othistory;
};

Othistory.get = function(req, res, next) {
  var q = " \
    SELECT ot.*, c.name AS client, e.name AS equipment, i.name AS intervention, \
           p.name AS plan, s.name AS state, GROUP_CONCAT(od.observation SEPARATOR ';') AS delaytext, GROUP_CONCAT(d.reason SEPARATOR ';') AS delay \
    FROM ot \
    LEFT JOIN otdelay od ON od.ot_id = ot.id \
    LEFT JOIN delay d ON od.delay_id = d.id \
    LEFT JOIN client c ON ot.client_id = c.id \
    LEFT JOIN equipment e ON ot.equipment_id = e.id \
    LEFT JOIN intervention i ON ot.intervention_id = i.id \
    LEFT JOIN plan p ON ot.plan_id = p.id \
    LEFT JOIN otstate s ON ot.otstate_id = s.id \
    WHERE otstate_id >= 6 AND ot.deleted_at IS NULL  \
    GROUP BY ot.number \
    ORDER BY ot.delivery ASC";   

  DB._.query(q, function(err, data) {
    var msg = [];

    data.forEach(function(ot) {
    var a;
      var otdelay = []
      var delayfield = '';
      index = 0;
      if (ot.delay){
        ot.delay.split(';').forEach(function(delay){
          otdelay.push({
            reason: delay,
            observation: ot.delaytext.split(';')[index],
          })
          delayfield+= '<p><span>'+delay+'</span><br/>'+ot.delaytext.split(';')[index]+'</p>'
          index++;
        })
      }

      if((ot.delivery != '0000-00-00 00:00:00') && (ot.delivery) ){
        a=moment(ot.delivery).format('DD/MM/YYYY')
        if((a ==  "NaN/NaN/NaN") || (a ==  NaN/NaN/NaN))
          a = "SIN CARGAR";
      }else
        a= "SIN CARGAR";
      msg.push({
        "id": ot.id,
        "number": ot.number,
	      "remitoentrada": ot.remitoentrada,
	      "remitosalida": ot.remitosalida,
        "client_number": ot.client_number,
        "equipment_id": ot.equipment_id,
        "equipment": ot.equipment,
        "delivery": a,
        "created_at": moment(ot.created_at).format('DD/MM/YYYY'),
        "salida": moment(ot.updated_at).format('DD/MM/YYYY'),
        "agreedstart": ot.agreedstart ? moment(ot.agreedstart).format('DD/MM/YYYY') : '',
        "agreedend": ot.agreedend ? moment(ot.agreedend).format('DD/MM/YYYY') : '',
        "conclusion_date": ot.conlusion_date ? moment(ot.conclusion_date).format('DD/MM/YYYY') : '',
        "workshop_suggestion": ot.workshop_suggestion,
        "client_suggestion": ot.client_suggestion,
        "client_id": ot.client_id,
        "client": ot.client,
        "intervention_id": ot.intervention_id,
        "intervention": ot.intervention,
        "plan_id": ot.plan_id,
        "plan": ot.plan,
        "reworked_number": ot.reworked_number,
        "otstate_id": ot.otstate_id,
        "state": ot.state,
        "delay": delayfield,
      });
    });
    res.send({data:msg});
  });
};

module.exports = Othistory;
