C.Model.Module = Backbone.Model.extend({

  urlRoot: "/module",

  defaults: function() {
    return {
      name: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Modules = Backbone.Collection.extend({

  model: C.Model.Module,

  url: "/module",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
