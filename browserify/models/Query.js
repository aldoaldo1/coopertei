C.Model.Query = Backbone.Model.extend({

  urlRoot: "/query",

  defaults: {

  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Querys = Backbone.Collection.extend({

  model: C.Model.Query,

  url: "/query",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
