C.Model.AlertTask = Backbone.Model.extend({

  urlRoot: "/alerttask",

  defaults: function() {
    return {
      number: null,
      name: null,
      description: null,
      equipment: null,
      client_id: null,
      client: null,
      due_date: null,
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

C.Collection.AlertTasks = Backbone.Collection.extend({

  model: C.Model.AlertTask,

  url: "/alerttask",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
