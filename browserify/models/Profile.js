C.Model.Profile = Backbone.Model.extend({

  urlRoot: "/profile",
  
  defaults: function() {
    return {
      user_id: null,
      username: null,
      password1: null,
      password2: null,
      role_id: null,
      
      employee_id: null,
      area_id: null,
      intern: null,
      
      person_id: null,
      firstname: null,
      lastname: null,
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

C.Collection.Profiles = Backbone.Collection.extend({

  model: C.Model.Profile,
  
  url: function() {
    return "/profile/" + this.user_id;
  },
  
  initialize: function (models, options) {
    this.user_id = $('#session_user_id').html();
    this.username = $('#session_username').html();
    
    //this.bind("add", options.view.addRow);
  }

});

