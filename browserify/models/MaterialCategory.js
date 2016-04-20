C.Model.MaterialCategory = Backbone.Model.extend({

  urlRoot: "/materialcategory",
  
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

C.Collection.MaterialCategorys = Backbone.Collection.extend({

  model: C.Model.MaterialCategory,
  
  url: "/materialcategory",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

