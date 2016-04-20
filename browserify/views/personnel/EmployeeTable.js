C.View.EmployeeTable = Backbone.View.extend({
  // Configuration
  
  name: 'employee',
  
  headers: ['ID', 'Legajo', 'ID Persona', 'Nombre', 'ID Area', '&Aacute;rea',
            'Horario entrada ID', 'Horario salida ID', 'Horario', 'Interno'],
  
  attrs: ['id', 'payroll_number', 'person_id', 'person', 'area_id', 'area',
          'schedule_ini_id', 'schedule_end_id', 'schedule', 'intern'],
  
  data: null,
  
  rowHandler: function(row, model) {
    var icon = $('<img>', {
      src: '/images/icons/' + model.area_id + '.png',
      class: 'row_icon'
    });
    
    $($(row).children()[5]).prepend(icon);
  },
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.employee_form'), data);
    });
  },
  
  events: {
    "click .employee_table tr": "selectRow"
  },
  
  // Methods
  
  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});

