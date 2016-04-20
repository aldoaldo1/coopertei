C.Model.Intervention = Backbone.Model.extend({

  urlRoot: "/intervention",

  defaults: function() {
    return {
      name: null,
      description: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Interventions = Backbone.Collection.extend({

  model: C.Model.Intervention,

  url: "/intervention",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
