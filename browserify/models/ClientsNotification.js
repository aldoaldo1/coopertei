C.Model.ClientsNotification = Backbone.Model.extend({

  urlRoot: "/clientnotification",

  defaults: function() {
    return {
      name: null,
      description: null,
      related_model: null,
      related_model_id: null,
      ot_number: null,
      client_id: null,
      created_at: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.ClientsNotifications = Backbone.Collection.extend({

  model: C.Model.ClientsNotification,

  url: "/clientnotification",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
