C.Model.Task = Backbone.Model.extend({

  urlRoot: "/task",

  defaults: function() {
    return {
      name: null,
      description: null,
      area_id: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Tasks = Backbone.Collection.extend({

  model: C.Model.Task,

  url: "/task",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
