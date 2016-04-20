C.View.TaskTable = Backbone.View.extend({
  // Configuration
  
  name: 'task',
  
  headers: ['ID', 'Nombre', 'Descripci&oacute;n', 'ID Area', 'Area'],
  
  attrs: ['id', 'name', 'description', 'area_id', 'area'],
  
  data: null,
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.task_form'), data);
    });
  },
  
  events: {
    "click .task_table tr": "selectRow"
  },
  
  // Methods
  
  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});

