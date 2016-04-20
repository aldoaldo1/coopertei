 C.View.AlertInfoCard = Backbone.View.extend({
  // Configuration

  name: 'alert_infocard',

  title: 'Detalle de la O/T pendiente',

  fieldnames: {
    number: 'O/T N&ordm;',
    equipment: 'Equipo (TAG)',
    client: 'Cliente',
    delivery: 'Fecha de entrega'
  },

  initialize: function() {
    var me = this;

    F.createInfoCard(this, $('#alert_right'), function(infocard) {
      new C.View.News({ model: new C.Model.News() });
    });
  },

  // Methods

  getTable: function() {
    return this.options.alert_table;
  },

  getDataTable: function() {
    return this.getTable().datatable;
  },

  getSelectionID: function() {
    return parseInt($('.selection_id').val());
  },

  getSelectionRow: function() {
    return this.getTable().selected_row;
  }

});
