 C.View.AlertTasksInfoCard = Backbone.View.extend({
  // Configuration

  name: 'alerttasks_infocard',

  title: 'Detalle de la Tarea pendiente',

  fieldnames: {
    number: 'O/T N&ordm;',
    name: 'Nombre',
    //description: 'Descripci&oacute;n',
    equipment: 'Equipo (TAG)',
    client: 'Cliente',
    due_date: 'Fecha de vencimiento'
  },

  initialize: function() {
    F.createInfoCard(this, $('#alert_right'));
  },

  // Methods

  getTable: function() {
    return this.options.alerttasks_table;
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
