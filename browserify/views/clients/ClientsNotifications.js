C.View.ClientsNotifications = Backbone.View.extend({
  // Configuration

  name: 'clients',

  el: $('#clients_left'),

  headers: ['ID', 'O/T', 'Concepto', 'Descripci&oacute;n', 'Fecha'],

  attrs: ['id', 'ot_number', 'name', 'description', 'created_at'],

  data: null,

  datatableOptions: {
    "aoColumns": [null, null, null, null, { "sType": "es_date" }]
  },

  rowHandler: function(row, model) {
    $(row).on('mouseover', function() {
      $(this).find('td').css({ backgroundColor: '#c2dcde' });
    });
    $(row).on('mouseout', function() {
      $(this).find('td').css({ backgroundColor: 'white' });
    });
  },

  initialize: function() {
    var me = this;

    this.data = new C.Collection.ClientsNotifications(null, { view: this });

    this.data.fetch({
      success: function(collection, response) {
        F.createDataTable(me);
      }
    });
  }

});
