C.View.AlertTable = Backbone.View.extend({
  // Configuration

  name: 'alert',

  headers: ['ID', 'O/T', 'ID Cliente', 'Cliente', 'Equipo (TAG)', 'Fecha de entrega'],

  attrs: ['id', 'number', 'client_id', 'client', 'equipment', 'delivery'],

  data: null,

  datatableOptions: {
    "aoColumns": [null, null, null, null, null, { "sType": "es_date" }],
    "aaSorting": [[5, "asc"]]
  },

  rowHandler: function(row, model) {
    $(row).children().css({
      fontWeight: model.fontWeight,
      color: model.color
    });
  },

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToInfoCard($('.alert_infocard'), data, function(infocard, values) {
        // Add link to related O/T
        $(infocard).children('br, a').remove();
        $(infocard).append('<br /><a href="/#/ots/audit/' + values.number + '">Auditar O/T</a>');
      });
    });
  },

  events: {
    "click .alert_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});
