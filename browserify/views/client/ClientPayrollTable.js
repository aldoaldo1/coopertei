C.View.ClientPayrollTable = Backbone.View.extend({
  // Configuration

  name: 'client',

  headers: ['ID', 'Nombre', 'TAG', 'C.U.I.T.', 'I.V.A.', 'Direcci&oacute;n',
            'N&uacute;mero', 'Piso', 'Dpto.', 'Ciudad', 'E-mail'],

  attrs: ['id', 'name', 'tag', 'cuit', 'iva_id', 'address',
          'addressnumber', 'floor', 'apartment', 'city_id', 'email'],

  hidden_colums: ['iva_id', 'city_id'],

  data: null,

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.client_form'), data);
    });
  },

  events: {
    "click .client_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});
