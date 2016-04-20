C.Model.Plan = Backbone.Model.extend({

  urlRoot: "/plan",
  
  defaults: function() {
    return {
      name: null,
      description: null,
      task_id: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Plans = Backbone.Collection.extend({

  model: C.Model.Plan,
  
  url: "/plan",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

