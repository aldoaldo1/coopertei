C.Model.User = Backbone.Model.extend({

  urlRoot: "/user",

  defaults: function() {
    return {
      username: null,
      employee: null,
      employee_id: null,
      role: null,
      role_id: null,
      area: null,
      area_id: null
    };
  },

  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Users = Backbone.Collection.extend({

  model: C.Model.User,

  url: "/user",

  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});
