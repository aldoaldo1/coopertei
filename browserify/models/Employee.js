C.Model.Employee = Backbone.Model.extend({

  urlRoot: "/employee",
  
  defaults: function() {
    return {
      payroll_number: null,
      person_id: null,
      area_id: null,
      intern: null,
      schedule: null,
      schedule_ini_id: null,
      schedule_end_id: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Employees = Backbone.Collection.extend({

  model: C.Model.Employee,
  
  url: "/employee",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

