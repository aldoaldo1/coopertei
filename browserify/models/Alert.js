C.Model.Alert = Backbone.Model.extend({

  urlRoot: "/alert",

  defaults: function() {
    return {
      number: null,
      equipment: null,
      client_id: null,
      client: null,
      delivery: null,
      fontWeight: null,
      color: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Alerts = Backbone.Collection.extend({

  model: C.Model.Alert,

  url: "/alert",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
