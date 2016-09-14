var Auth = require('./auth');

module.exports = function(app, routes) {
  app.get('/', Auth.restrict, routes.index.get);

  app.get('/login', routes.login.get);
  app.post('/login', routes.login.post);
  app.get('/logout', Auth.restrict, routes.logout.get);

  app.get('/profile/:id', Auth.restrict, routes.profile.get);
  app.put('/profile/:id', Auth.restrict, routes.profile.put);
  app.post('/profile/changePassword', Auth.restrict, routes.profile.changePassword);

  app.get('/ot/next', Auth.restrict, routes.ot.nextNumber);
  app.get('/ot/alterdate/:id', Auth.restrict, routes.ot.updateDate);
  app.put('/ot/reprogram/:id', Auth.restrict, routes.ot.reprogram);
  app.post('/ot/inaugurate', Auth.restrict, routes.ot.inaugurate);
  app.post('/ot/conclude/:ot_id', Auth.restrict, routes.ot.conclude);
  app.get('/ot/findByEquipmentAndClient/:equipment_id/:client_id', Auth.restrict, routes.ot.findByEquipmentAndClient);
  app.post('/ot/update/:ot_id', Auth.restrict, routes.ot.update);
  app.get('/clientots', Auth.restrict, routes.clients.getOts);
  app.get('/clientevents/:ot_id', Auth.restrict, routes.clients.getEvents);
  app.get('/clientnotifications', Auth.restrict, routes.clients.getNotifications);
  app.get('/clientuser', Auth.restrict, routes.user.getClients);

  /*EMC*/
  app.get('/materialorder/elementUpdate/:id/:name/:quantity',  Auth.restrict, routes.materialorder.elementUpdate);
  app.get('/materialorder/byOt/:ot_id', Auth.restrict, routes.materialorder.byOt);
  app.get('/material/byOt/:id', Auth.restrict, routes.material.byOt);
  app.get('/materialorder/elementdelete/:id', Auth.restrict, routes.materialorder.elementdelete);
  app.get('/materialreception/byElements/:order_id', Auth.restrict, routes.materialreception.byElements); 
  /*EMC*/
 
  app.get('/ottask/byOt/:id', Auth.restrict, routes.ottask.byOt);
  app.get('/ottask/byOtNumber/:ot_number', Auth.restrict, routes.ottask.byOtNumber);
  app.get('/ottask/resources/:ottask_id', Auth.restrict, routes.ottask.resources);
  app.get('/ottask/get/:id', Auth.restrict, routes.ottask.getOne);
  app.post('/ottask/rework/:task_id/after/:position', Auth.restrict, routes.ottask.rework);
  app.post('/ottask/add', Auth.restrict, routes.ottask.add);
  app.post('/ottask/toggleTaskState/:task_id', Auth.restrict, routes.ottask.complete);
  
  app.get('/authorization/setSessionOtId/:ot_number', Auth.restrict, routes.authorization.setSessionOtId);
  app.post('/authorization/saveRequirementsReport', Auth.restrict, routes.authorization.saveRequirementsReport);
  app.post('/authorization/addPhotoToReport', Auth.restrict, routes.authorization.addPhotoToReport);
  app.get('/authorization/delPhotofromReport/:photo_id', Auth.restrict, routes.authorization.delPhotofromReport);
  app.get('/authorization/notify/:ot_id', Auth.restrict, routes.authorization.notifyClient);
  app.post('/authorization/confirm', Auth.restrict, routes.authorization.confirm);
  app.get('/authorization/getData', Auth.restrict, routes.authorization.getData);
  app.get('/authorization/preview/:ot_id', Auth.restrict, routes.authorization.preview);

  app.get('/materialorder/elements/:order_id', Auth.restrict, routes.materialorder.elements);
  // ORIGINAL app.get('/materialorder/arrival/:element_id', Auth.restrict, routes.materialorder.arrival);
  app.get('/materialorder/arrival/:element_id/:quantity/:observation', Auth.restrict, routes.materialorder.arrival);
  app.get('/materialcategory/getproperties/:id', Auth.restrict, routes.materialcategory.getProperties)
  //
  app.get('/alert', Auth.restrict, routes.alert.get);
  app.get('/alerttask', Auth.restrict, routes.alerttask.get);

  app.post('/employee/tasksProductivity', Auth.restrict, routes.employee.tasksProductivity);

  app.get('/inout/out/:id', Auth.restrict, routes.inout.registerOut);
  app.get('/inout/comeback/:id', Auth.restrict, routes.inout.registerComeback);

  app.get('/user/currentAreaId', Auth.restrict, routes.user.currentAreaId);
  app.put('/user/generatePass/:user_id', Auth.restrict, routes.user.generatePass);

  //Reports
  app.get('/report/ot', Auth.restrict, routes.otreport.get);

  app.get('/plan/task/:id', Auth.restrict, routes.plan.getTasks);
  
  app.get('/otstatereport/:otstate_id', Auth.restrict, routes.otstatereport.byState);
  app.get('/otdeliveryreport/:start/:end', Auth.restrict, routes.otdeliveryreport.betweenDates);
  app.get('/otdeadlinereport/:start/:end', Auth.restrict, routes.otdeadlinereport.betweenDates);
  app.get('/otconcludereport/:start/:end/:client/:tag/:rework', Auth.restrict, routes.otconcludereport.betweenDates);
  app.get('/otresourcereport/:start/:end', Auth.restrict, routes.otresourcereport.byClient);
  app.get('/otresourcereport/:start/:end/:client_id', Auth.restrict, routes.otresourcereport.byClientAndOT);
  app.get('/otemployeereport/:start/:end', Auth.restrict, routes.otresourcereport.byEmployee);
  app.get('/hoursperarea/:start/:end', Auth.restrict, routes.otresourcereport.byArea);
  app.get('/ottaskreport/:filterBy/:start/:end', Auth.restrict, routes.otresourcereport.otTaskReport);  
  app.get('/materialreport/:filterBy/:start/:end', Auth.restrict, routes.otresourcereport.materialReport);
  app.get('/timelinechart/:ot_id', Auth.restrict, routes.timelinechart.get);
  app.get('/timelinedelays/:ot_id', Auth.restrict, routes.timelinechart.delays);

  app.get('/otobservation/:ot_id', Auth.restrict, routes.otobservation.byOt);
  app.get('/otobservation/byId/:id', Auth.restrict, routes.otobservation.byId);

  var models = ['ot', 'ottask', 'othistory', 'otobservation', 'person', 'delay', 'employee', 'client', 'task', 'query',
                'intervention', 'role', 'user', 'area', 'plan', 'client', 'errorreport',
                'authorization', 'authorizationhistory', 'schedule', 'module',
                'city', 'material', 'materialcategory', 'materialorder', 'materialhistory',
                'unit', 'otstate', 'otstatereport', 'inout', 'inouthistory', 'equipment', 'news', 'iva',
                'clientnotification', 'materialreception', 'purchase'];
                
  models.forEach(function(m) {
    app.get('/' + m, Auth.restrict, routes[m].get);
    app.get('/' + m + '/:id', Auth.restrict, routes[m].getOne);
    app.post('/' + m, Auth.restrict, routes[m].post);
    app.put('/' + m + '/:id', Auth.restrict, routes[m].put);
    app.delete('/' + m + '/:id', Auth.restrict, routes[m].delete);
  });

  app.get('/timeline', routes.timeline.get);
};
