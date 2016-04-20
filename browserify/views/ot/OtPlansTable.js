C.View.OtPlansTable = Backbone.View.extend({
  // Configuration
  
  name: 'plan',
  
  headers: ['ID', 'Nombre', 'Descripci&oacute;n', 'ID Tareas'],
  
  attrs: ['id', 'name', 'description', 'task_id'],
  
  data: null,
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.plan_form'), data);
    });
  },
  
  events: {
    "click .plan_table tr": "selectRow"
  },
  
  // Methods
  
  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});

