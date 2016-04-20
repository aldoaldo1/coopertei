C.View.ProfileForm = Backbone.View.extend({
  // Configuration

  name: 'profile_form',

  title: 'Mis Datos',

  fields: {
    username: { label: 'Usuario', attrs: { disabled: 'disabled' } },
    firstname: { label: 'Nombre', check: 'alpha' },
    lastname: { label: 'Apellido', check: 'alpha' },
    phone: { label: 'Tel&eacute;fono', check: 'integer' },
    email: { label: 'E-mail', check: 'email' }
  },

  buttons: {
    cancel: true,
    save: true
  },

  initialize: function() {
    F.createForm(this, $('#profile_left'));
  },

  events: {
    "click .profile_form .BUTTON_save": "saveProfile"
  },

  // Methods

  saveProfile: function() {
    F.V.email('E-mail', $('.profile_form input:text[name=email]'), function() {
      $.ajax({
        type: 'PUT',
        url: '/profile/' + C.Session.user_id,
        data: $('.profile_form').serialize(),
        success: function() {
          F.msgOK('Datos actualizados exitosamente');
        }
      });
    }, function(error) {
      F.msgError(error);
    });
  }

});
