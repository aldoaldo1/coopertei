C.View.ProfileEmployeeInfoCard = Backbone.View.extend({
  // Configuration
  
  name: 'profile_employee_infocard',
  
  title: 'Datos de Empleado',
  
  fieldnames: {
    payroll_number: 'Legajo', 
    area: '&Aacute;rea',
    intern: 'Interno'
  },
  
  initialize: function() {
    F.createInfoCard(this, $('#profile_left'));
  }

});

