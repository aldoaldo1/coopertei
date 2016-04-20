C.Widget.CRUD = {

  initialize: function(crud_name) {
    $('#head #tabs').empty().append(
      '<a href="/#/crud/person">Personas</a>' +
      '<a href="/#/crud/user">Usuarios</a>' +
      '<a href="/#/crud/intervention">Intervenciones</a>' +
      '<a href="/#/crud/task">Tareas</a>' +
      '<a href="/#/crud/materialcategory">Categ. de Materiales</a>' +
      '<a href="/#/crud/equipment">Equipos</a>'
    );

    C.Session.doIfSysadmin(function(user) {
      $('#head #tabs').append(
        '<a href="/#/crud/errorreport">Reportes de errores</a>'
      );
    });

    $('#left .inner').empty().append(
      '<div id="' + (crud_name || 'crud') + '_left">' +
      '</div>'
    );

    $('#right .inner').empty().append(
      '<div id="' + (crud_name || 'crud') + '_right">' +
      '</div>'
    );
  }

};
