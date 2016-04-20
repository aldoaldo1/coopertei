C.Model.ErrorReport = Backbone.Model.extend({

  urlRoot: "/errorreport",

  defaults: function() {
    return {
      description: null,
      suggestion: null,
      user: null,
      created_at: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.ErrorReports = Backbone.Collection.extend({

  model: C.Model.ErrorReport,

  url: "/errorreport",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
