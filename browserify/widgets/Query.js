C.Widget.Query = {

  initialize: function() {
    $('#head #tabs').empty().append(
      '<a href="/#/queries/general">Consultas</a>'
    );

    $('#left .inner').empty().append(
      '<div id="query_left">' +
      '</div>'
    );

    $('#right .inner').empty().append(
      '<div id="query_right">' +
      '</div>'
    );
  }

};
