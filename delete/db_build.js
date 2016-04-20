var async = require('async'),
    moment = require('moment');

module.exports = function(DB) {

var StaticData = {

Provinces: ['Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'C&oacute;rdoba',
            'Corrientes', 'Entre R&iacute;os', 'Formosa', 'Jujuy', 'La Pampa',
            'La Rioja', 'Mendoza', 'Misiones', 'Neuqu&eacute;n',
            'R&iacute;o Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
            'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucum&aacute;n'],

Cities: ['AZUL', 'PUAN', 'LA MATANZA', 'TIGRE', '25 DE MAYO', 'TRENQUE LAUQUEN', '9 DE JULIO', 'LANUS', 'LA PLATA', 'MONTE', 'PEHUAJO', 'SAN ISIDRO', 'PERGAMINO', 'ALBERTI', 'CHASCOMUS', 'ESTEBAN ECHEVERRIA', 'MERCEDES', 'BAHIA BLANCA', 'MERLO', 'JUNIN', 'GUAMINI', 'LUJAN', 'LEANDRO N.ALEM', 'MATANZA', 'GENERAL PAZ', 'SAN VICENTE', 'CAÑUELAS', 'ALMIRANTE BROWN', 'CNL.DE MARINA  L.ROSALES', 'BARADERO', 'SAAVEDRA', 'BRANDSEN', 'GENERAL SARMIENTO', 'TAPALQUE', 'SALADILLO', 'MAGDALENA', 'GONZALES CHAVES', 'GENERAL PINTO', 'NAVARRO', 'DAIREAUX', 'LOBOS', 'CORONEL DORREGO', 'ADOLFO ALSINA', 'COLON', 'GENERAL ARENALES', 'LINCOLN', 'VILLARINO', 'VICENTE LOPEZ', 'BARTOLOME MITRE', 'EXALTACION DE LA CRUZ', 'SALTO', 'BRAGADO', 'ZARATE', 'AVELLANEDA', 'AYACUCHO', 'SAN ANDRES DE GILES', 'TANDIL', 'RIVADAVIA', 'PATAGONES', 'GRL.VIAMONTE', 'CNL.DE MARINA LEONARDO ROSALES', 'BALCARCE', 'TRES ARROYOS', 'GENERAL VILLEGAS', 'LOMAS DE ZAMORA', 'BERISSO', 'JUAREZ', 'GRL.PUEYRREDON', 'CORONEL SUAREZ', 'ESCOBAR', 'CARLOS CASARES', 'CHIVILCOY', 'BERAZATEGUI', 'QUILMES', 'TORQUINST', '3 DE FEBRERO', 'OLAVARRIA', 'PELLEGRINI', 'GENERAL BELGANO', 'FLORENCIO VARELA', 'SALLIQUELO', 'CNL.DE MARINA L.ROSALES', 'MAR CHIQUITA', 'GENERAL PUEYRREDON', 'CAMPANA', 'GRL.SARMIENTO', 'ROJAS', 'SARMIENTO', 'CARMEN DE ARECO', 'PILA', 'TRES DE FEBRERO', 'MORON', 'CASTELLI', 'CHACABUCO', 'GENERAL VIAMONTE', 'RAUCH', 'GENERAL BELGRANO', 'TORNQUIST', 'NECOCHEA', 'MARCOS PAZ', 'CARLOS TEJEDOR', 'SAN PEDRO', 'GENERAL ALVARADO', 'SAN NICOLAS', 'HIPOLITO YRIGOYEN', 'LAS FLORES', 'CORONEL PRINGLES', 'GENERAL SAN MARTIN', 'BENITO JUAREZ', 'SAN CAYETANO', 'ADOLFO GONZALES CHAVES', 'DOLORES', 'SAN ANTONIO', 'LOBERIA', 'RAMALLO', 'GENERAL ALVEAR', 'ENSENADA', 'TORDILLO', 'GENERAL GUIDO', 'GENERAL LAS HERAS', 'GENERAL JUAN MADARIAGA', 'GENERAL LA MADRID', 'GENERAL LAVALLE', 'GENERAL RODRIGUEZ', 'GENERAL VLLEGAS', 'ADOLFO GONZALEZ CHAVES', 'CORONEL DE MARINA L.ROSALES', 'BOLIVAR', 'SAN FERNANDO', 'CAPITAN SARMIENTO', 'ROQUE PEREZ', 'MORENO', 'LAPRIDA', 'MAIPU', 'ECHEVERRIA', 'PILAR', 'CORONEL DE MARINA L. ROSALES', 'SUIPACHA', 'SAN ANTONIO DE ARECO', 'BARAZATEGUI', 'ALSINA', 'LEANDRO N. ELEM', 'GRL.SAN MARTIN'],

Modules: ['&Oacute;rdenes de Trabajo', 'Materiales', 'Clientes', 'Personal', 'Consultas',
          'Perfil', 'Panel de Control'],

Roles: ['Vigilancia', 'Operador', 'Supervisor',
        'Administrador', 'Administrador de Sistema', 'Cliente'],

Units: ['mm. (mil&iacute;metros)', 'cm. (cent&iacute;metros)', 'mt. (metros)',
        'm2. (metros cuadrados)', 'm3. (metros c&uacute;bicos)',
        'mg. (miligramos)', 'gr. (gramos)', 'kg. (kilogramos)',
        'ml. (mililitros)', 'cl. (centilitros)', 'lt. (litros)'],

Areas: ['Administraci&oacute;n', 'T&eacute;cnica/Calidad', 'Sala Sucia',
        'Mec&aacute;nica', 'Maquinado', 'Herrer&iacute;a', 'Vigilancia'],

Permissions: [],

Schedules: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
            '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
            '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
            '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],

Ivas: ['Resp. Inscripto', 'Monotributo', 'Exento', 'Cons. final'],

Otstates: ['Inaugurada', 'Notificado / En espera', 'Tiempo excedido',
           'Autorizada', 'Iniciada', 'Finalizada', 'Vencida'],

Materialcategorys: ['Rodamientos', 'Esp&aacute;rragos', 'Juntas Espiraladas', 'L&aacute;mina Universal',
                    'Bulones', 'Material para Constru&iacute;r', 'Repuestos de Sellos',
                    'Otros Repuestos', 'Varios']

};

StaticData.Modules.forEach(function(val, index, array) {
  DB.Module.build({ name: val }).save();
});
StaticData.Roles.forEach(function(val, index, array) {
  DB.Role.build({ name: val }).save();
});
StaticData.Units.forEach(function(val, index, array) {
  DB.Unit.build({ name: val }).save();
});
StaticData.Areas.forEach(function(val, index, array) {
  DB.Area.build({ name: val }).save();
});
StaticData.Schedules.forEach(function(val, index, array) {
  DB.Schedule.build({ name: val }).save();
  DB.Schedule.build({ name: val.replace(":0", ":3") }).save();
});
StaticData.Ivas.forEach(function(val, index, array) {
  DB.Iva.build({ name: val }).save();
});
StaticData.Otstates.forEach(function(val, index, array) {
  DB.Otstate.build({ name: val }).save();
});
StaticData.Materialcategorys.forEach(function(val, index, array) {
  DB.Materialcategory.build({ name: val }).save();
});

DB.Person.build({
  firstname: 'Eduardo', lastname: 'Pressacco',
  email: 'epressacco@gmail.com', phone: '-'
}).save().on('success', function(p) {
  DB.Employee.build({
    payroll_number: '001', area_id: 1, intern: 0, person_id: p.id,
    schedule_ini_id: 1, schedule_end_id: 1
  }).save().on('success', function(e) {
    DB.User.build({
      username: 'admin', password: 'epressacco', employee_id: e.id, role_id: 5, area_id: 0
    }).save();
  });
});

// Person
/*
DB.Person.build({
  firstname: 'Carlos', lastname: 'Sanchez',
  email: 'csanchez@coopertei.com.ar', phone: '(0221) 15-4334567'
}).save().on('success', function(p) {
  DB.Employee.build({
    payroll_number: '001', area_id: 1, intern: 19, person_id: p.id,
    schedule_ini_id: 8, schedule_end_id: 16
  }).save().on('success', function(e) {
    DB.User.build({
      username: 'sysadmin', password: 'sysadmin', employee_id: e.id, role_id: 5, area_id: 0
    }).save();
    DB.User.build({
      username: 'operador', password: 'operador', employee_id: e.id, role_id: 2, area_id: 4
    }).save();
  });
});
DB.Person.build({
  firstname: 'Lucas', lastname: 'Ocampos',
  email: 'locampos@coopertei.com.ar', phone: '(0221) 15-5884321'
}).save().on('success', function(p) {
  DB.Employee.build({
    payroll_number: '002', area_id: 1, intern: 22, person_id: p.id,
    schedule_ini_id: 11, schedule_end_id: 19
  }).save().on('success', function(e) {
    DB.User.build({
      username: 'supervisor', password: 'supervisor', employee_id: e.id, role_id: 3, area_id: 2
    }).save();
    DB.User.build({
      username: 'vigilante', password: 'vigilante', employee_id: e.id, role_id: 1, area_id: 7
    }).save();
  });
});
DB.Person.build({
  firstname: 'Juan Manuel', lastname: 'D&iacute;az',
  email: 'jmdiaz@coopertei.com.ar', phone: '(0221) 15-4022334'
}).save().on('success', function(p) {
  DB.Employee.build({
    payroll_number: '003', area_id: 2, intern: 15, person_id: p.id,
    schedule_ini_id: 10, schedule_end_id: 18
  }).save().on('success', function(e) {
    DB.User.build({
      username: 'admin', password: 'admin', employee_id: e.id, role_id: 4, area_id: 1
    }).save();
    DB.User.build({
      username: 'cliente', password: 'cliente', employee_id: e.id, role_id: 6, area_id: 0
    }).save();
  });
});
DB.Person.build({
  firstname: 'Guillermo', lastname: 'Gonzalez',
  email: 'ggonzalez@coopertei.com.ar', phone: '(0221) 15-4551232'
}).save().on('success', function(p) {
  DB.Employee.build({
    payroll_number: '005', area_id: 5, intern: 17, person_id: p.id,
    schedule_ini_id: 10, schedule_end_id: 18
  }).save().on('success', function(e) {
    DB.User.build({
      username: 'ggonzalez', password: 'ggonzalez', employee_id: e.id, role_id: 4, area_id: 1
    }).save();
  });
});
DB.Person.build({
  firstname: 'Roberto', lastname: 'Gonzalez',
  email: 'rgonzalez@coopertei.com.ar', phone: '(0221) 15-4218219'
}).save().on('success', function(p) {
  DB.Employee.build({
    payroll_number: '004', area_id: 3, intern: 16, person_id: p.id,
    schedule_ini_id: 10, schedule_end_id: 18
  }).save().on('success', function(e) {
    DB.User.build({
      username: 'rgonzalez', password: 'rgonzalez', employee_id: e.id, role_id: 3, area_id: 5
    }).save();
  });
});

// Client

DB.User.build({
  username: 'ypf', password: 'ypf', role_id: 6
}).save().on('success', function(u) {
  DB.Client.build({
    name: 'YPF', user_id: u.id, tag: 'Y', cuit: '20-12345678-3', iva_id: 1, city_id: 66,
    address: 'La Portada', addressnumber: '524', floor: null, apartment: null,
    email: 'notificaciones@coopertei.com.ar'
  }).save();
});
DB.User.build({
  username: 'senasa', password: 'senasa', role_id: 6
}).save().on('success', function(u) {
  DB.Client.build({
    name: 'SENASA', user_id: u.id, tag: 'S', cuit: '20-87654321-3', iva_id: 2, city_id: 9,
    address: '51 e/ 20 y 21', addressnumber: '1330', floor: 5, apartment: 'A',
    email: 'notificaciones@coopertei.com.ar'
  }).save();
});
*/
// Intervention

DB.Intervention.build({
  name: 'Construcci&oacute;n', description: 'Proceso de construcci&oacute;n'
}).save();
DB.Intervention.build({
  name: 'Reparaci&oacute;n', description: 'Proceso de reparaci&oacute;n'
}).save();
DB.Intervention.build({
  name: 'Control de medici&oacute;n', description: 'Medici&oacute;n y balanceo de instrumentos'
}).save();
DB.Intervention.build({
  name: 'Reemplazo de partes fracturadas', description: 'Reemplazo de partes espec&iacute;fica del equipo por fractura'
}).save();
DB.Intervention.build({
  name: 'Reemplazo de partes deterioradas', description: 'Reemplazo de partes espec&iacute;fica del equipo por deterioro'
}).save();

// Equipment
/*
DB.Equipment.build({
  name: 'Y-100', intervention_id: 1, client_id: 1
}).save();
DB.Equipment.build({
  name: 'S-50', intervention_id: 1, client_id: 2
}).save();
DB.Equipment.build({
  name: 'Y-220', intervention_id: 2, client_id: 1
}).save();
DB.Equipment.build({
  name: 'S-3000', intervention_id: 2, client_id: 2
}).save();
DB.Equipment.build({
  name: 'X-70', intervention_id: 3, client_id: 2
}).save();

// Task, Plan, Taskplan

async.parallel({
  task1: function(fn) {
    DB.Task.build({
      name: 'Tarea I',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      area_id: 3
    }).save().on('success', function(t) {
      fn(null, t);
    });
  },
  task2: function(fn) {
    DB.Task.build({
      name: 'Tarea II',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      area_id: 2
    }).save().on('success', function(t) {
      fn(null, t);
    });
  },
  task3: function(fn) {
    DB.Task.build({
      name: 'Tarea III',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      area_id: 4
    }).save().on('success', function(t) {
      fn(null, t);
    });
  },
  task4: function(fn) {
    DB.Task.build({
      name: 'Tarea IV',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      area_id: 5
    }).save().on('success', function(t) {
      fn(null, t);
    });
  },
  task5: function(fn) {
    DB.Task.build({
      name: 'Tarea V',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      area_id: 6
    }).save().on('success', function(t) {
      fn(null, t);
    });
  },
  task6: function(fn) {
    DB.Task.build({
      name: 'Tarea VI',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      area_id: 1
    }).save().on('success', function(t) {
      fn(null, t);
    });
  },
  plan1: function(fn) {
    DB.Plan.build({ name: 'Plan I', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' }).save().on('success', function(p) {
      fn(null, p);
    });
  },
  plan2: function(fn) {
    DB.Plan.build({ name: 'Plan II', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' }).save().on('success', function(p) {
      fn(null, p);
    });
  },
  plan3: function(fn) {
    DB.Plan.build({ name: 'Plan III', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' }).save().on('success', function(p) {
      fn(null, p);
    });
  },
  plan4: function(fn) {
    DB.Plan.build({ name: 'Plan IV', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' }).save().on('success', function(p) {
      fn(null, p);
    });
  },
  plan5: function(fn) {
    DB.Plan.build({ name: 'Plan V', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit' }).save().on('success', function(p) {
      fn(null, p);
    });
  }
},
function(errors, results) {
  DB.Taskplan.build({ plan_id: results.plan1.id, task_id: results.task6.id }).save();
  DB.Taskplan.build({ plan_id: results.plan1.id, task_id: results.task1.id }).save();
  DB.Taskplan.build({ plan_id: results.plan1.id, task_id: results.task2.id }).save();
  DB.Taskplan.build({ plan_id: results.plan1.id, task_id: results.task3.id }).save();

  DB.Taskplan.build({ plan_id: results.plan2.id, task_id: results.task1.id }).save();
  DB.Taskplan.build({ plan_id: results.plan2.id, task_id: results.task4.id }).save();
  DB.Taskplan.build({ plan_id: results.plan2.id, task_id: results.task5.id }).save();

  DB.Taskplan.build({ plan_id: results.plan3.id, task_id: results.task1.id }).save();
  DB.Taskplan.build({ plan_id: results.plan3.id, task_id: results.task2.id }).save();
  DB.Taskplan.build({ plan_id: results.plan3.id, task_id: results.task3.id }).save();
  DB.Taskplan.build({ plan_id: results.plan3.id, task_id: results.task4.id }).save();
  DB.Taskplan.build({ plan_id: results.plan3.id, task_id: results.task5.id }).save();

  DB.Taskplan.build({ plan_id: results.plan4.id, task_id: results.task1.id }).save();
  DB.Taskplan.build({ plan_id: results.plan4.id, task_id: results.task2.id }).save();
  DB.Taskplan.build({ plan_id: results.plan4.id, task_id: results.task5.id }).save();

  DB.Taskplan.build({ plan_id: results.plan5.id, task_id: results.task1.id }).save();
  DB.Taskplan.build({ plan_id: results.plan5.id, task_id: results.task2.id }).save();
  DB.Taskplan.build({ plan_id: results.plan5.id, task_id: results.task4.id }).save();
  DB.Taskplan.build({ plan_id: results.plan5.id, task_id: results.task5.id }).save();
});

// Ot

DB.Ot.build({
  number: parseInt(12000), client_number: 0, equipment_id: '1',
  delivery: moment().subtract('d', 1).format('YYYY-MM-DD'),
  client_id: 2, intervention_id: 1, plan_id: 1,
  workshop_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  client_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  otstate_id: 1, reworked_number: 0
}).save().on('success', function(ot) {
  var romans = [null, 'I', 'II', 'III'],
      areas = [null, 3, 2, 4];

  DB.Authorization.build({
    req_info_sent_date: null, ot_id: ot.id, client_id: 2, otstate_id: ot.otstate_id
  }).save();

  for (var i = 1; i <= 3; i += 1) {
    DB.Ottask.build({
      name: 'Tarea ' + romans[i],
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      due_date: moment().subtract('d', 1).format('YYYY-MM-DD'),
      position: i,
      completed: 0,
      completed_date: null,
      reworked: 0,
      derived_to: 0,
      ot_id: ot.id,
      area_id: areas[i]
    }).save();
  }

  DB.Report.build({
    ot_id: ot.id,
    ot_number: ot.number,
    client_id: ot.client_id
  }).save();
});

for (var i = 1; i <= 25; i += 5) {
  DB.Ot.build({
    number: parseInt(12000 + i), client_number: 0, equipment_id: '1',
    delivery: moment().add('d', Math.floor(Math.random() * 10)).format('YYYY-MM-DD'),
    client_id: 1, intervention_id: 1, plan_id: 0,
    workshop_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    client_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    otstate_id: 1, reworked_number: 0
  }).save().on('success', function(ot) {
    DB.Authorization.build({
      req_info_sent_date: null, ot_id: ot.id, client_id: 1, otstate_id: ot.otstate_id
    }).save();
  });
  DB.Ot.build({
    number: parseInt(12000 + i + 1), client_number: 0, equipment_id: '2',
    delivery: moment().add('d', Math.floor(Math.random() * 10)).format('YYYY-MM-DD'),
    client_id: 1, intervention_id: 3, plan_id: 0,
    workshop_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    client_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    otstate_id: 2, reworked_number: 0
  }).save().on('success', function(ot) {
    DB.Authorization.build({
      req_info_sent_date: null, ot_id: ot.id, client_id: 1, otstate_id: ot.otstate_id
    }).save();
  });
  DB.Ot.build({
    number: parseInt(12000 + i + 2), client_number: 0, equipment_id: '3',
    delivery: moment().add('d', Math.floor(Math.random() * 10)).format('YYYY-MM-DD'),
    client_id: 2, intervention_id: 2, plan_id: 0,
    workshop_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    client_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    otstate_id: 3, reworked_number: 0
  }).save().on('success', function(ot) {
    DB.Authorization.build({
      req_info_sent_date: null, ot_id: ot.id, client_id: 2, otstate_id: ot.otstate_id
    }).save();
  });
  DB.Ot.build({
    number: parseInt(12000 + i + 3), client_number: 0, equipment_id: '4',
    delivery: moment().add('d', Math.floor(Math.random() * 10)).format('YYYY-MM-DD'),
    client_id: 2, intervention_id: 5, plan_id: 0,
    workshop_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    client_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    otstate_id: 4, reworked_number: 0
  }).save().on('success', function(ot) {
    DB.Authorization.build({
      req_info_sent_date: null, ot_id: ot.id, client_id: 2, otstate_id: ot.otstate_id
    }).save();
  });
  DB.Ot.build({
    number: parseInt(12000 + i + 4), client_number: 0, equipment_id: '5',
    delivery: moment().add('d', Math.floor(Math.random() * 10)).format('YYYY-MM-DD'),
    client_id: 2, intervention_id: 4, plan_id: 0,
    workshop_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    client_suggestion: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    otstate_id: 5, reworked_number: 0
  }).save().on('success', function(ot) {
    DB.Authorization.build({
      req_info_sent_date: null, ot_id: ot.id, client_id: 2, otstate_id: ot.otstate_id
    }).save();
  });
}

// Inout

DB.Inout.build({
  employee_id: 3, permitted: 1, permitted: 1, authorized: '15/04/2012 - 10:00',
  out: '15/04/2012 - 10:05', comeback: '15/04/2012 - 12:30'
}).save();
DB.Inout.build({
  employee_id: 1, permitted: 1, authorized: '20/04/2012 - 12:30',
  out: '20/04/2012 - 12:30'
}).save();
DB.Inout.build({
  employee_id: 2, permitted: 1, authorized: '23/04/2012 - 15:15'
}).save();
DB.Inout.build({
  employee_id: 3, permitted: 1, authorized: '25/04/2012 - 11:00',
  out: '25/04/2012 - 11:05', comeback: '25/04/2012 - 13:30'
}).save();
DB.Inout.build({
  employee_id: 1, permitted: 1, authorized: '02/05/2012 - 13:30',
  out: '03/05/2012 - 07:30'
}).save();
DB.Inout.build({
  employee_id: 2, permitted: 1, authorized: '07/05/2012 - 15:30'
}).save();
DB.Inout.build({
  employee_id: 3, permitted: 1, authorized: '15/05/2012 - 14:00',
  out: '15/05/2012 - 14:50', comeback: '15/05/2012 - 15:30'
}).save();
DB.Inout.build({
  employee_id: 1, permitted: 1, authorized: '21/05/2012 - 12:00',
  out: '21/05/2012 - 13:30'
}).save();
DB.Inout.build({
  employee_id: 2, permitted: 1, authorized: '23/05/2012 - 09:00'
}).save();
*/
};
