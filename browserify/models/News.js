C.Model.News = Backbone.Model.extend({

  urlRoot: "/news",
  
  defaults: function() {
    return {
      name: null,
      description: null,
      related_model: null,
      related_model_id: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Newss = Backbone.Collection.extend({

  model: C.Model.News,
  
  url: "/news",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

