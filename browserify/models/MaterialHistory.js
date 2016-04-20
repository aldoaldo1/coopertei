C.Model.MaterialHistory = Backbone.Model.extend({

  urlRoot: "/materialhistory",
  
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

C.Collection.MaterialHistorys = Backbone.Collection.extend({

  model: C.Model.MaterialHistory,
  
  url: "/materialhistory",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

