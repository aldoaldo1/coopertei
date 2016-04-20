C.View.ClientAuthorizationHistoryTable = Backbone.View.extend({
  // Configuration
  
  name: 'client',
  
  headers: ['ID', 'O/T ID', 'O/T', 'ID Cliente', 'Cliente',
            'Env&iacute;o de Informe de Requerimientos', 'ID Estado', 'Estado'],
  
  attrs: ['id', 'ot_id', 'ot_number', 'client_id', 'client',
          'req_info_sent_date', 'otstate_id', 'otstate'],
  
  data: null,
  
  datatableOptions: {
    "aoColumns": [null, null, null, null, null,
                  { "sType": "es_date" }, null, null],
    "aaSorting": [[6, "asc"]]
  },
  
  rowHandler: function(row, model) {
    var cell = $(row).find('td')[7];
    
    switch (model.otstate_id) {
      case 5: // Authorized
        $(cell).parent().css({ fontWeight: 'bold', color: 'green' });
        break;
      case 6: // Initiated
        $(cell).parent().css({ fontWeight: 'bold', color: 'green' });
        break;
      case 7: // Concluded
        $(cell).parent().css({ fontWeight: 'bold', color: 'black' });
        break;
      case 8: // Overdue
        $(cell).parent().css({ fontWeight: 'bold', color: 'red' });
        break;
      default:
        break;
    }
  },
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this, function(data) {
      F.assignValuesToInfoCard($('.client_authorization_history_infocard'), data);
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

