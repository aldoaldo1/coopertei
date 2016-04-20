C.Model.Ot = Backbone.Model.extend({

  urlRoot: "/ot",

  defaults: function() {
    return {
      number: null,
      client_number: null,
      equipment_id: null,
      equipment: null,
      created_at: null,
      delivery: null,
      workshop_suggestion: null,
      client_suggestion: null,
      client_id: null,
      client: null,
      intervention: null,
      intervention_id: null,
      plan: null,
      plan_id: null,
      reworked_number: null,
      notify_client: null,
      status: null,
      otstatus_id: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Ots = Backbone.Collection.extend({

  model: C.Model.Ot,

  url: "/ot",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
