C.Widget.Profile = {

  initialize: function() {
    $('#head #tabs').empty().append(
      '<a href="/#/options/profile">Perfil</a>'
    );
    
    $('#left .inner').empty().append(
      '<div id="profile_left">' +
      '</div>'
    );
    
    $('#right .inner').empty().append(
      '<div id="profile_right">' +
      '</div>'
    );
  }

};

