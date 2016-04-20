C.Widget.Clients = {

  initialize: function() {
    $('#head #tabs').empty()

    $('#left .inner').empty().append(
      '<div id="clients_left">' +
      '</div>' +
      '<style>' +
        'table.dataTable tr.selected_row td {' +
          'background-color: #c2dcde !important;' +
          'font-weight: normal !important;' +
          'color: black !important;' +
        '}' +
      '</style>'
    );

    $('#right .inner').empty().append(
      '<div id="clients_right">' +
      '</div>'
    );

    $('#left').css({ width: '90%', padding: '25px 5%', textAlign: 'center' });
    $('#right').css({ width: '0' });
  }

};
