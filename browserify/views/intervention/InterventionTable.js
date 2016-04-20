C.View.InterventionTable = Backbone.View.extend({
  // Configuration

  name: 'intervention',

  headers: ['ID', 'Nombre', 'Descripci&oacute;n'],

  attrs: ['id', 'name', 'description'],

  data: null,

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.intervention_form'), data);
    });
  },

  events: {
    "click .intervention_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});
