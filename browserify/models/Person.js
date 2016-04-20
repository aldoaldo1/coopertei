C.Model.Person = Backbone.Model.extend({

  urlRoot: "/person",
  
  defaults: function() {
    return {
      firstname: null,
      lastname: null,
      name: null,
      phone: null,
      email: null
    };
  },
  
  initialize: function() {
    this.bind("error", function(model, error) {
      F.log(error);
    });
  }

});

C.Collection.Persons = Backbone.Collection.extend({

  model: C.Model.Person,
  
  url: "/person",
  
  initialize: function (models, options) {
    //this.bind("add", options.view.addRow);
  }

});

