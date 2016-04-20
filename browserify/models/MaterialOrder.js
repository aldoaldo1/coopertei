C.Model.MaterialOrder = Backbone.Model.extend({

  urlRoot: "/materialorder",

  defaults: function() {
    return {
      ot_id: null,
      ot_number: null,
      tag_id: null,
      tag: null,
      ottask_id: null,
      ottask: null,
      provider: null,
      date: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.MaterialOrders = Backbone.Collection.extend({

  model: C.Model.MaterialOrder,

  url: "/materialorder",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
