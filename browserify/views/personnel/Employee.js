C.View.Employee = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.employees = new C.Collection.Employees(null, { view: this });
    
    this.employees.fetch({
      success: function(collection, response) {
        me.employee_table = new C.View.EmployeeTable({
          el: $('#employee_left'),
          collection: collection
        });
        me.employee_form = new C.View.EmployeeForm({
          el: $('#employee_right'),
          model: me.model,
          collection: collection,
          employee_table: me.employee_table
        });
      }
    });
  },
  
  events: {
    
  },
  
  // Methods
  
  

});

