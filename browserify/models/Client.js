C.Model.Client = Backbone.Model.extend({

  urlRoot: "/client",
  
  defaults: function() {
    return {
      name: null,
      tag: null,
      cuit: null,
      iva_id: null,
      address: null,
      addressnumber: null,
      floor: null,
      apartment: null,
      city_id: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Clients = Backbone.Collection.extend({

  model: C.Model.Client,
  
  url: "/client",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

