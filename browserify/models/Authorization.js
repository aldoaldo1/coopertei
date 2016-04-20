C.Model.Authorization = Backbone.Model.extend({

  urlRoot: "/authorization",
  
  defaults: function() {
    return {
      req_info_sent_date: null,
      ot_number: null,
      ot_id: null,
      client: null,
      client_id: null,
      otstate: null,
      otstate_id: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Authorizations = Backbone.Collection.extend({

  model: C.Model.Authorization,
  
  url: "/authorization",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

