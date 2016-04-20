C.View.EquipmentTable = Backbone.View.extend({
  // Configuration

  name: 'equipment',

  headers: ['ID', 'Equipo (TAG)', 'ID Motivo de intervenci&oacute;n', 'Motivo de intervenci&oacute;n',
            'ID Cliente', 'Cliente'],

  attrs: ['id', 'name', 'intervention_id', 'intervention', 'client_id', 'client'],

  data: null,

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.equipment_form'), data);
    });
  },

  events: {
    "click .equipment_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});
