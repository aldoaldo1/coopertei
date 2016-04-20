// A global object for storing functions to be used all across the application

window.F = {

  // Validations
  V: {},

  // Backbone Router functions
  R: {},

  // Backbone Models/Collections functions
  M: {}

};

// The global object for the application,
// where everything lives to avoid scope issues

window.C = {

  TITLE: 'COOPERTEI | ',

  LOADING_MSG: 'Cargando...',

  // Session storing object
  Session: {

    userID: function() {
      return parseInt($('#session_user_id').html());
    },

    username: function() {
      return $('#session_username').html();
    },

    roleID: function() {
      return parseInt($('#session_role_id').html());
    },

    areaID: function() {
      return parseInt($('#session_area_id').html());
    },

    getUser: function() {
      return {
        id: C.Session.userID(),
        username: C.Session.username,
        role_id: C.Session.roleID(),
        area_id: C.Session.areaID()
      };
    },

    isClient: function() {
      return C.Session.getUser().role_id == 6;
    },

    isSysadmin: function() {
      return C.Session.getUser().role_id == 5;
    },

    isAdmin: function() {
      return C.Session.getUser().role_id == 4;
    },

    isSupervisor: function() {
      return C.Session.getUser().role_id == 3;
    },

    isOperator: function() {
      return C.Session.getUser().role_id == 2;
    },

    isVigilance: function() {
      return C.Session.getUser().role_id == 1;
    },

    doIfClient: function(fn) {
      if (C.Session.isClient()) {
        fn(C.Session.getUser());
      }
    },

    doIfSysadmin: function(fn) {
      if (C.Session.isSysadmin()) {
        fn(C.Session.getUser());
      }
    },

    doIfAdmin: function(fn) {
      if (C.Session.isAdmin()) {
        fn(C.Session.getUser());
      }
    },

    doIfSupervisor: function(fn) {
      if (C.Session.isSupervisor()) {
        fn(C.Session.getUser());
      }
    },

    doIfOperator: function(fn) {
      if (C.Session.isOperator()) {
        fn(C.Session.getUser());
      }
    },

    doIfVigilance: function(fn) {
      if (C.Session.isVigilance()) {
        fn(C.Session.getUser());
      }
    },

    doIfInRolesList: function(roles, fn, no_notice) {
      // Using 0 instead of '*' so they can be all integers,
      // thus no need to compare strings
      if (_.indexOf(roles, 0) != -1) {
        fn();
      } else {
        var x = false,
            _roles = [null, 'isVigilance', 'isOperator', 'isSupervisor',
                      'isAdmin', 'isSysadmin', 'isClient'];

        _.each(roles, function(r) {
          x = x || C.Session[_roles[r]]();
        });

        if (x) {
          fn();
        } else if (no_notice !== true) {
          C.Router.notAllowed();
        }
      }
    }

  },

  // Static datasets
  Dataset: {},

  // Models, generally reflexing the server
  Model: {},

  // Backbone collections
  Collection: {},

  // Backbone views
  View: {},

  // Widgets, which can be Backbone models
  Widget: {},

  // Router
  Router: null

};

require('./F.backbone');
require('./F.basics');
require('./F.validations');
require('./F.widgets');

//require('./IO');

require('./widgets/Alert');
require('./widgets/Client');
require('./widgets/Clients');
require('./widgets/CRUD');
require('./widgets/Material');
require('./widgets/News');
require('./widgets/Ot');
require('./widgets/Personnel');
require('./widgets/Profile');
require('./widgets/Query');

require('./models/Alert');
require('./models/AlertTask');
require('./models/Authorization');
require('./models/AuthorizationHistory');
require('./models/Client');
require('./models/ClientsOt');
require('./models/ClientsNotification');
require('./models/Employee');
require('./models/ErrorReport');
require('./models/Inout');
require('./models/InoutHistory');
require('./models/Intervention');
require('./models/Material');
require('./models/MaterialCategory');
require('./models/MaterialOrder');
require('./models/MaterialHistory');
require('./models/Module');
require('./models/Equipment');
require('./models/News');
require('./models/Ot');
require('./models/OtHistory');
require('./models/OtTask');
require('./models/Person');
require('./models/Plan');
require('./models/Profile');
require('./models/Query');
require('./models/Task');
require('./models/User');

require('./views/alert/Alert');
require('./views/alert/AlertTable');
require('./views/alert/AlertInfoCard');
require('./views/alert/AlertTasks');
require('./views/alert/AlertTasksTable');
require('./views/alert/AlertTasksInfoCard');
require('./views/client/ClientAuthorization');
require('./views/client/ClientAuthorizationTable');
require('./views/client/ClientAuthorizationInfoCard');
require('./views/client/ClientAuthorizationOptions');
require('./views/client/ClientAuthorizationHistory');
require('./views/client/ClientAuthorizationHistoryTable');
require('./views/client/ClientAuthorizationHistoryInfoCard');
require('./views/client/ClientPayroll');
require('./views/client/ClientPayrollTable');
require('./views/client/ClientPayrollForm');
require('./views/clients/ClientsEvents');
require('./views/clients/ClientsNotifications');
require('./views/clients/ClientsOts');
require('./views/clients/ClientsOtsTable');
require('./views/controlpanel/ControlPanel');
require('./views/material/MaterialStock');
require('./views/material/MaterialStockTable');
require('./views/material/MaterialStockForm');
require('./views/material/MaterialOrder');
require('./views/material/MaterialOrderTable');
require('./views/material/MaterialOrderInfoCard');
require('./views/material/MaterialOrderOptions');
require('./views/material/MaterialCreateOrder');
require('./views/materialcategory/MaterialCategory');
require('./views/materialcategory/MaterialCategoryTable');
require('./views/materialcategory/MaterialCategoryForm');
require('./views/material/MaterialHistory');
require('./views/material/MaterialHistoryTable');
require('./views/equipment/Equipment');
require('./views/equipment/EquipmentTable');
require('./views/equipment/EquipmentForm');
require('./views/news/News');
require('./views/news/NewsFeed');
require('./views/ot/OtAdmin');
require('./views/ot/OtInauguration');
require('./views/ot/OtAdminConcludeForm');
require('./views/ot/OtAdminTable');
require('./views/ot/OtAdminForm');
require('./views/ot/OtAdminOptions');
require('./views/ot/OtAudit');
require('./views/ot/OtAuditAddTask');
require('./views/ot/OtAuditToggleTaskState');
require('./views/ot/OtAuditForm');
require('./views/ot/OtAuditInfoCard');
require('./views/ot/OtAuditOptions');
require('./views/ot/OtAuditTable');
require('./views/ot/OtHistory');
require('./views/ot/OtHistoryTable');
require('./views/ot/OtHistoryInfoCard');
require('./views/ot/OtPlans');
require('./views/ot/OtPlansTable');
require('./views/ot/OtPlansForm');
require('./views/ottask/OtTaskForm');
require('./views/ottask/OtTaskResources');
require('./views/person/Person');
require('./views/person/PersonTable');
require('./views/person/PersonForm');
require('./views/personnel/Employee');
require('./views/personnel/EmployeeTable');
require('./views/personnel/EmployeeForm');
require('./views/personnel/Inout');
require('./views/personnel/InoutTable');
require('./views/personnel/InoutHistory');
require('./views/personnel/InoutHistoryTable');
require('./views/personnel/InoutForm');
require('./views/intervention/Intervention');
require('./views/intervention/InterventionTable');
require('./views/intervention/InterventionForm');
require('./views/profile/Profile');
require('./views/profile/ProfileEmployeeInfoCard');
require('./views/profile/ProfileForm');
require('./views/profile/ProfilePasswordForm');
require('./views/query/Query');
require('./views/query/QueryTable');
require('./views/query/QueryForm');
require('./views/query/QueryPredefinedList');
require('./views/task/Task');
require('./views/task/TaskTable');
require('./views/task/TaskForm');
require('./views/user/User');
require('./views/user/UserTable');
require('./views/user/UserForm');
require('./views/errorreport/ErrorReport');
require('./views/errorreport/ErrorReportTable');
require('./views/errorreport/ErrorReportInfoCard');
require('./views/errorreport/ErrorReportForm');

require('./Router');
require('./UI');
