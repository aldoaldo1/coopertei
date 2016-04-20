C.View.PersonTable = Backbone.View.extend({
  // Configuration
  
  name: 'person',
  
  headers: ['ID', 'Nombre', 'Apellido', 'Tel&eacute;fono', 'E-mail'],
  
  attrs: ['id', 'firstname', 'lastname', 'phone', 'email'],
  
  data: null,
  
  hidden_columns: ['name'],
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.person_form'), data);
    });
  },
  
  events: {
    "click .person_table tr": "selectRow"
  },
  
  // Methods
  
  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});

