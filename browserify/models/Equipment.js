C.Model.Equipment = Backbone.Model.extend({

  urlRoot: "/equipment",
  
  defaults: function() {
    return {
      name: null,
      intervention: null,
      intervention_id: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Equipments = Backbone.Collection.extend({

  model: C.Model.Equipment,
  
  url: "/equipment",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

