C.View.InoutHistoryTable = Backbone.View.extend({
  // Configuration
  
  name: 'inout',
  
  headers: ['ID', 'ID Empleado', 'Empleado', 'Fecha y Hora Autorizadas',
            'Egreso', 'Reingreso'],
  
  attrs: ['id', 'employee_id', 'employee', 'authorized',
          'out', 'comeback'],
  
  data: null,
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this);
  }

});

