$(function() {

var AppRouter = Backbone.Router.extend({

  // ROUTES
  
  
  /*
  
  EMC
	  
	Vigilancia			1	
	Operador			2	
	Supervisor			3
	Administrador			4	
	Administrador de Sistema	5	
	Cliente				6
  */
  
  
  

  routes: {
    "": "getIni",
    "/ini/alerts": "getIni",
    "/ini/alerts_tasks": "getIniTasks",

    "/ots": "getOtAudit",
    "/ots/audit": "getOtAudit",
    "/ots/audit/:ot_number": "getOtAuditAt",
    "/ots/admin": "getOtAdmin",
    "/ots/inauguration": "getOtInauguration",
    "/ots/plans": "getOtPlans",
    "/ots/history": "getOtHistory",

    "/materials": "getMaterialOrders",
    "/materials/orders": "getMaterialOrders",
    "/materials/stock": "getMaterialStock",
    "/materials/history": "getMaterialHistory",

    "/clients": "getClientAuthorizations",
    "/clients/authorizations": "getClientAuthorizations",
    "/clients/authorizationshistory": "getClientAuthorizationsHistory",
    "/clients/payroll": "getClientPayroll",

    "/personnel": "getPersonnelInouts",
    "/personnel/inouts": "getPersonnelInouts",
    "/personnel/history": "getPersonnelHistory",
    "/personnel/payroll": "getPersonnelPayroll",

    "/queries": "getQuery",

    "/client/ots": "getClientOts",
    "/client/events": "getClientEvents",
    "/client/events/:ot_id": "getClientEvents",
    "/client/notifications": "getClientNotifications",

    "/options/profile": "getProfile",
    "/options/controlpanel": "getControlpanel",

    "/crud/person": "getPerson",
    "/crud/user": "getUser",
    "/crud/intervention": "getIntervention",
    "/crud/task": "getTask",
    "/crud/materialcategory": "getMaterialCategory",
    "/crud/equipment": "getEquipment",
    "/crud/errorreport": "getErrorReport",

    "*undefined": "notFound"
  },

  // HANDLERS

  // Index & Not found

  getIni: function() {
    var render = function() {
      document.title = C.TITLE + 'Alertas de Órdenes de Trabajo';
      this.alert_widget = C.Widget.Alert.initialize();
      this.alert_view = new C.View.Alert({
        model: new C.Model.Alert()
      });
      F.R.highlightCurrentModule('ini/alerts');
    }.bind(this);

    C.Session.doIfInRolesList([0], render);
  },

  getIniTasks: function() {
    var render = function() {
      document.title = C.TITLE + 'Alertas de Tareas';
      this.alerttasks_widget = C.Widget.Alert.initialize();
      this.alerttasks_view = new C.View.AlertTasks({
        model: new C.Model.AlertTask()
      });
      F.R.highlightCurrentModule('ini/alerts_tasks');
    }.bind(this);

    C.Session.doIfInRolesList([0], render);
  },

  notFound: function() {
    $('body').append(
      '<div id="not_found_modal_window" style="display:none;">' +
        '<h1 class="title">Ruta Inexistente</h1>' +
        '<br />' +
        '<p class="margined">La ruta a la que est&aacute; tratando de acceder es inv&aacute;lida.</p>' +
        '<p class="margined">Si ingres&oacute; manualmente la ruta, rev&iacute;sela detenidamente.</p>' +
        '<p class="margined">En caso de haber recibido esta notificaci&oacute;n por otra raz&oacute;n,' +
          ' intente recargar el m&oacute;dulo en el que estaba trabajando &oacute; volver al Inicio.</p>' +
        '<br />' +
        '<a href="/" class="BUTTON_proceed lefty">Inicio</a>' +
        '<input type="button" class="BUTTON_cancel righty button" value="Cerrar" />' +
      '</div>'
    );
    $('.button').button();

    $('#not_found_modal_window .BUTTON_cancel').on('click', function() {
      $.unblockUI();
    });

    $.blockUI({
      message: $('#not_found_modal_window'),
      css: {
        top: '0',
        left: '35%',
        width: '28%',
        border: 'none',
        padding: '1em',
        cursor: 'default'
      },
      onUnblock: function() {
        $('#not_found_modal_window').remove();
      }
    });
  },

  notAllowed: function() {
    var home_link = '';

    if (C.Session.roleID() != 1) {
      home_link = '<a href="/" class="BUTTON_proceed lefty">Inicio</a>';
    }

    $('body').append(
      '<div id="not_allowed_modal_window" style="display:none;">' +
        '<h1 class="title">No posee permisos</h1>' +
        '<br />' +
        '<p class="margined">Su usuario no est&aacute; habilitado para visualizar la ruta a la que est&aacute; tratando de acceder.</p>' +
        '<br />' + home_link + '<input type="button" class="BUTTON_cancel righty button" value="Cerrar" />' +
      '</div>'
    );
    $('.button').button();

    $('#not_allowed_modal_window .BUTTON_cancel').on('click', function() {
      $.unblockUI();
    });

    $.blockUI({
      message: $('#not_allowed_modal_window'),
      css: {
        top: '0',
        left: '35%',
        width: '28%',
        border: 'none',
        padding: '1em',
        cursor: 'default'
      },
      onUnblock: function() {
        $('#not_allowed_modal_window').remove();
      }
    });
  },

  // Ots

  iniOtWidget: function() {
    this.ot_widget = C.Widget.Ot.initialize();
  },

  getOtAudit: function() {
    var render = function() {
      document.title = C.TITLE + 'Órdenes de Trabajo';
      this.iniOtWidget();
      this.ot_view = new C.View.OtAudit({
        model: new C.Model.Ot
      });
      F.R.highlightCurrentModule('ots/audit');
    }.bind(this);

    C.Session.doIfInRolesList([3, 4, 5], render);
  },

  getOtAuditAt: function(ot_number) {
    var render = function() {
      document.title = C.TITLE + 'Órdenes de Trabajo';
      this.iniOtWidget();
      this.ot_view = new C.View.OtAudit({
        model: new C.Model.Ot,
        open_ot_number_on_start: ot_number
      });
      F.R.highlightCurrentModule('ots/audit');
    }.bind(this);

    C.Session.doIfInRolesList([3, 4, 5], render);
  },

  getOtAdmin: function() {
    var render = function() {
      document.title = C.TITLE + 'Órdenes de Trabajo';
      this.ot_widget = C.Widget.Ot.initialize();
      this.ot_view = new C.View.OtAdmin({
        model: new C.Model.Ot()
      });
      F.R.highlightCurrentModule('ots/admin');
    }.bind(this);

    C.Session.doIfInRolesList([1, 3, 4, 5], render); /*EMC AGREGUE A  el 3 ES DECIR SUPERVISOR*/
  },

  getOtInauguration: function() {
    var render = function() {
      document.title = C.TITLE + 'Órdenes de Trabajo';
      this.ot_widget = C.Widget.Ot.initialize();
      this.ot_view = new C.View.OtInauguration({
        model: new C.Model.Ot()
      });
      F.R.highlightCurrentModule('ots/inauguration');
    }.bind(this);

    C.Session.doIfInRolesList([1], render);
  },

  getOtPlans: function() {
    var render = function() {
      document.title = C.TITLE + 'Planes de Tareas';
      this.ot_widget = C.Widget.Ot.initialize('plan');
      this.ot_view = new C.View.OtPlans({
        model: new C.Model.Plan()
      });
      F.R.highlightCurrentModule('ots/plans');
    }.bind(this);

    C.Session.doIfInRolesList([2, 3, 4, 5], render);
  },

  getOtHistory: function() {
    var render = function() {
      document.title = C.TITLE + 'Historial de Órdenes de Trabajo';
      this.ot_widget = C.Widget.Ot.initialize();
      this.ot_view = new C.View.OtHistory({
        model: new C.Model.Ot
      });
      F.R.highlightCurrentModule('ots/history');
    }.bind(this);

    C.Session.doIfInRolesList([3, 4, 5], render);
  },

  // Materials

  iniMaterialsWidget: function() {
    this.material_widget = C.Widget.Material.initialize();
  },

  getMaterialOrders: function() {
    var render = function() {
      document.title = C.TITLE + 'Pedidos de Materiales';
      this.iniMaterialsWidget();
      this.material_view = new C.View.MaterialOrder({
        model: new C.Model.MaterialOrder()
      });
      F.R.highlightCurrentModule('materials/orders');
    }.bind(this);

    C.Session.doIfInRolesList([0], render);
  },

  getMaterialStock: function() {
    var render = function() {
      document.title = C.TITLE + 'Stock de Materiales';
      this.iniMaterialsWidget();
      this.material_view = new C.View.MaterialStock({
        model: new C.Model.Material()
      });
      F.R.highlightCurrentModule('materials/stock');
    }.bind(this);

    C.Session.doIfInRolesList([2, 3, 4, 5], render);
  },

  getMaterialHistory: function() {
    var render = function() {
      document.title = C.TITLE + 'Historial de uso de Materiales';
      this.iniMaterialsWidget();
      this.material_view = new C.View.MaterialHistory({
        model: new C.Model.Material()
      });
      F.R.highlightCurrentModule('materials/history');
    }.bind(this);

    C.Session.doIfInRolesList([3, 4, 5], render);
  },

  // Clients

  iniClientWidget: function() {
    this.client_widget = C.Widget.Client.initialize();
  },

  getClientAuthorizations: function() {
    var render = function() {
      document.title = C.TITLE + 'Autorizaciones de Clientes';
      this.iniClientWidget();
      this.client_view = new C.View.ClientAuthorization({
        model: new C.Model.Authorization()
      });
      F.R.highlightCurrentModule('clients/authorizations');
    }.bind(this);

    C.Session.doIfInRolesList([4, 5], render);
  },

  getClientAuthorizationsHistory: function() {
    var render = function() {
      document.title = C.TITLE + 'Historial de Autorizaciones';
      this.iniClientWidget();
      this.client_view = new C.View.ClientAuthorizationHistory({
        model: new C.Model.AuthorizationHistory()
      });
      F.R.highlightCurrentModule('clients/authorizationshistory');
    }.bind(this);

    C.Session.doIfInRolesList([4, 5], render);
  },

  getClientPayroll: function() {
    var render = function() {
      document.title = C.TITLE + 'Nómina de Clientes';
      this.iniClientWidget();
      this.client_view = new C.View.ClientPayroll({
        model: new C.Model.Client()
      });
      F.R.highlightCurrentModule('clients/payroll');
    }.bind(this);

    C.Session.doIfInRolesList([4, 5], render);
  },

  // Personnel

  iniPersonnelWidget: function(model_name) {
    this.personnel_widget = C.Widget.Personnel.initialize(model_name);
  },

  getPersonnelInouts: function() {
    var render = function() {
      document.title = C.TITLE + 'Entradas/Salidas de Personal';
      this.iniPersonnelWidget('inout');
      this.personnel_view = new C.View.Inout({
        model: new C.Model.Inout()
      });
      F.R.highlightCurrentModule('personnel/inouts');
    }.bind(this);

    C.Session.doIfInRolesList([1, 3, 4, 5], render);
  },

  getPersonnelHistory: function() {
    var render = function() {
      document.title = C.TITLE + 'Historial de Entradas/Salidas';
      this.iniPersonnelWidget('inout');
      this.personnel_view = new C.View.InoutHistory({
        model: new C.Model.InoutHistory()
      });
      F.R.highlightCurrentModule('personnel/history');
    }.bind(this);

    C.Session.doIfInRolesList([4, 5], render);
  },

  getPersonnelPayroll: function() {
    var render = function() {
      document.title = C.TITLE + 'Nómina de Personal';
      this.iniPersonnelWidget('employee');
      this.personnel_view = new C.View.Employee({
        model: new C.Model.Employee()
      });
      F.R.highlightCurrentModule('personnel/payroll');
    }.bind(this);

    C.Session.doIfInRolesList([4, 5], render);
  },

  // Queries

  iniQueryWidget: function() {
    this.query_widget = C.Widget.Query.initialize();
  },

  getQuery: function() {
    var render = function() {
      document.title = C.TITLE + 'Consultas';
      this.query_widget = C.Widget.Query.initialize();
      this.query_view = new C.View.Query({
        model: new C.Model.Query()
      });
      F.R.highlightCurrentModule('queries/general');
    }.bind(this);

    C.Session.doIfInRolesList([4, 5], render);
  },

  // Client UI

  iniClientsWidget: function() {
    this.clients_widget = C.Widget.Clients.initialize();
  },

  getClientOts: function() {
    var render = function() {
      document.title = C.TITLE + 'Órdenes de Trabajo';
      this.iniClientsWidget();
      this.clients_view = new C.View.ClientsOts({
        model: new C.Model.ClientsOt()
      });
    }.bind(this);

    C.Session.doIfInRolesList([6], render);
  },

  getClientEvents: function(ot_id) {
    var render = function() {
      document.title = C.TITLE + 'Línea de Tiempo de Eventos';
      this.iniClientsWidget();
      this.clients_view = new C.View.ClientsEvents({
        model: new C.Model.ClientsOt(),
        ot_id: ot_id
      });
    }.bind(this);

    C.Session.doIfInRolesList([6], render);
  },

  getClientNotifications: function() {
    var render = function() {
      document.title = C.TITLE + 'Notificaciones';
      this.iniClientsWidget();
      this.clients_view = new C.View.ClientsNotifications({
        model: new C.Model.ClientsNotification()
      });
    }.bind(this);

    C.Session.doIfInRolesList([6], render);
  },

  // Profile & Control Panel

  getProfile: function() {
    var render = function() {
      document.title = C.TITLE + 'Perfil';
      this.profile_widget = C.Widget.Profile.initialize();
      this.profile_view = new C.View.Profile({
        model: new C.Model.Profile()
      });
      F.R.highlightCurrentModule('options/profile');
    }.bind(this);

    C.Session.doIfInRolesList([0], render);
  },

  getControlpanel: function() {
    var render = function() {
      document.title = C.TITLE + 'Panel de Control';
      this.controlpanel_widget = C.Widget.CRUD.initialize();
      this.controlpanel_view = new C.View.ControlPanel();
    }.bind(this);

    C.Session.doIfInRolesList([2, 4, 5], render);
  },

  // CRUDs

  getPerson: function() {
    var render = function() {
      document.title = C.TITLE + 'Personas';
      this.person_widget = C.Widget.CRUD.initialize('person');
      this.person_view = new C.View.Person({
        model: new C.Model.Person()
      });
      F.R.highlightCurrentModule('crud/person');
    }.bind(this);

    C.Session.doIfInRolesList([2, 4, 5], render);
  },

  getUser: function() {
    var render = function() {
      document.title = C.TITLE + 'Usuarios';
      this.user_widget = C.Widget.CRUD.initialize('user');
      this.user_view = new C.View.User({
        model: new C.Model.User()
      });
      F.R.highlightCurrentModule('crud/user');
    }.bind(this);

    C.Session.doIfInRolesList([2, 4, 5], render);
  },

  getIntervention: function() {
    var render = function() {
      document.title = C.TITLE + 'Intervenciones';
      this.intervention_widget = C.Widget.CRUD.initialize('intervention');
      this.intervention_view = new C.View.Intervention({
        model: new C.Model.Intervention()
      });
      F.R.highlightCurrentModule('crud/intervention');
    }.bind(this);

    C.Session.doIfInRolesList([2, 4, 5], render);
  },

  getTask: function() {
    var render = function() {
      document.title = C.TITLE + 'Tareas';
      this.task_widget = C.Widget.CRUD.initialize('task');
      this.task_view = new C.View.Task({
        model: new C.Model.Task()
      });
      F.R.highlightCurrentModule('crud/task');
    }.bind(this);

    C.Session.doIfInRolesList([2, 4, 5], render);
  },

  getMaterialCategory: function() {
    var render = function() {
      document.title = C.TITLE + 'Categorías de Materiales';
      this.materialcategory_widget = C.Widget.CRUD.initialize('materialcategory');
      this.materialcategory_view = new C.View.MaterialCategory({
        model: new C.Model.MaterialCategory()
      });
      F.R.highlightCurrentModule('crud/materialcategory');
    }.bind(this);

    C.Session.doIfInRolesList([2, 4, 5], render);
  },

  getEquipment: function() {
    var render = function() {
      document.title = C.TITLE + 'Equipos';
      this.equipment_widget = C.Widget.CRUD.initialize('equipment');
      this.equipment_view = new C.View.Equipment({
        model: new C.Model.Equipment()
      });
      F.R.highlightCurrentModule('crud/equipment');
    }.bind(this);

    C.Session.doIfInRolesList([2, 4, 5], render);
  },

  getErrorReport: function() {
    var render = function() {
      document.title = C.TITLE + 'Reportes de Erorres';
      this.errorreport_widget = C.Widget.CRUD.initialize('errorreport');
      this.errorreport_view = new C.View.ErrorReport({
        model: new C.Model.ErrorReport()
      });
      F.R.highlightCurrentModule('crud/errorreport');
    }.bind(this);

    C.Session.doIfInRolesList([5], render);
  }

});

// Store the Router in the global application object
C.Router = new AppRouter();

// Initiate history tracking for Backbone's Router
Backbone.history.start();

});
