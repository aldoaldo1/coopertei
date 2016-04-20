C.Model.Material = Backbone.Model.extend({

  urlRoot: "/material",
  
  defaults: function() {
    return {
      name: null,
      stock: null,
      unit_id: null,
      unit: null,
      materialcategory_id: null,
      materialcategory: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Materials = Backbone.Collection.extend({

  model: C.Model.Material,
  
  url: "/material",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

