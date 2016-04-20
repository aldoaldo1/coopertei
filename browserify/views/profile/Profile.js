C.View.Profile = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.profile = new C.Collection.Profiles(null, { view: this });

    this.profile.fetch({
      success: function(collection, response) {
        var model = collection.models[0],
            args = { model: model, el: $('#profile_left') };

        if (C.Session.roleID() !== 6) {
          me.profile_employee_data = new C.View.ProfileEmployeeInfoCard(args);
        } else {
          $('#left').css({ paddingTop: '10px', textAlign: 'left' });
        }
        me.profile_form = new C.View.ProfileForm(args);
        me.profile_password_form = new C.View.ProfilePasswordForm(args);
      }
    });
  },

  events: {

  },

  // Methods



});
