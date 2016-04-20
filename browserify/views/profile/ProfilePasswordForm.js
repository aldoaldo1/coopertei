C.View.ProfilePasswordForm = Backbone.View.extend({
  // Configuration
  
  name: 'profile_password_form',
  
  title: 'Cambiar Contrase&ntilde;a',
  
  fields: {
    password1: { label: 'Contrase&ntilde;a', type: 'password' },
    password2: { label: 'Contrase&ntilde;a (repetir)', type: 'password' }
  },
  
  buttons: {
    cancel: true,
    save: true
  },
  
  initialize: function() {
    F.createForm(this, $('#profile_left'));
  },
  
  events: {
    "click .profile_password_form .BUTTON_save": "savePassword"
  },
  
  // Methods
  
  savePassword: function() {
    var pass1 = $('.profile_password_form input:password[name=password1]'),
        pass2 = $('.profile_password_form input:password[name=password2]');
    
    F.V.passwords(pass1, pass2, function() {
      $.ajax({
        type: 'POST',
        url: '/profile/changePassword',
        data: $('.profile_password_form').serialize(),
        success: function() {
          F.msgOK('Contrase\u00F1a actualizada exitosamente');
        }
      });
    }, function(error) {
      F.msgError(error);
    });
  }

});

