C.Model.OtTask = Backbone.Model.extend({

  defaults: function() {
    return {
      name: null,
      description: null,
      due_date: null,
      order: null,
      completed: null,
      reworked: null,
      derived_ot: null,
      ot_id: null,
      area_id: null,
      observation: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});
/*
C.Collection.OtTasks = Backbone.Collection.extend({

  model: C.Model.OtTask,

  url: "/ottask",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
*/
