C.View.ErrorReportTable = Backbone.View.extend({
  // Configuration

  name: 'errorreport',

  headers: ['ID', 'Descripci&oacute;n', 'Sugerencia', 'Usuario', 'Fecha'],

  attrs: ['id', 'description', 'suggestion', 'user', 'created_at'],

  data: null,

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToInfoCard($('.errorreport_infocard'), data);
    });
  },

  events: {
    "click .errorreport_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});
