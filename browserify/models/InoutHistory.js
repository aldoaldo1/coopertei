C.Model.InoutHistory = Backbone.Model.extend({

  urlRoot: "/inouthistory",
  
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

C.Collection.InoutHistorys = Backbone.Collection.extend({

  model: C.Model.InoutHistory,
  
  url: "/inouthistory",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

