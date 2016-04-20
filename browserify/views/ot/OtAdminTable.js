C.View.OtAdminTable = Backbone.View.extend({
  // Configuration

  name: 'ot',

  headers: ['ID', 'O/T', 'O/T Cliente', 'ID Equipo', 'Equipo (TAG)', 'ID Cliente', 'Cliente',
            'ID Internvenci&oacute;n', 'Motivo de intervenci&oacute;n', 'Inauguraci&oacute;n', 'Fecha de entrega',
            'Sugerencia p/Taller', 'Sugerencia p/Cliente', 'ID Plan', 'Retrabajo', 'Notificar cliente'],

  attrs: ['id', 'number', 'client_number', 'equipment_id', 'equipment', 'client_id', 'client',
          'intervention_id', 'intervention', 'created_at', 'delivery',
          'workshop_suggestion', 'client_suggestion', 'plan_id', 'reworked_number', 'notify_client'],

  hidden_columns: ['workshop_suggestion', 'client_suggestion', 'reworked_number', 'notify_client'],

  data: null,

  datatableOptions: {
    "aoColumns": [null, null, null, null, null, null, null,
                  null, null, { "sType": "es_date" }, { "sType": "es_date" },
                  null, null, null, null, null]
  },

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.ot_form'), data);
    });
  },

  events: {
    "click .ot_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
    $('#ot_left .ot_conclude').attr('disabled', false);
  }

});
