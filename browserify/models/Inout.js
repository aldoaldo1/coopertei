C.Model.Inout = Backbone.Model.extend({

  urlRoot: "/inout",
  
  defaults: function() {
    return {
      employee: null,
      employee_id: null,
      authorized: null,
      out: null,
      comeback: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Inouts = Backbone.Collection.extend({

  model: C.Model.Inout,
  
  url: "/inout",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

