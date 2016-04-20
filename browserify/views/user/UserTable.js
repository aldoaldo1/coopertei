C.View.UserTable = Backbone.View.extend({
  // Configuration

  name: 'user',

  headers: ['ID', 'Usuario', 'ID Empleado', 'Empleado', 'ID Rol', 'Rol', 'ID Area', 'Area'],

  attrs: ['id', 'username', 'employee_id', 'employee', 'role_id', 'role', 'area_id', 'area'],

  data: null,

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.user_form'), data);
    });
  },

  events: {
    "click .user_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});
