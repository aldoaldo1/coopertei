C.Widget.Alert = {

  initialize: function() {
    $('#head #tabs').empty().append(
      '<a href="/#/ini/alerts">Alertas de O/T</a>' +
      '<a href="/#/ini/alerts_tasks">Alertas de Tareas</a>'
    );

    $('#left .inner').empty().append(
      '<div id="alert_left">' +
      '</div>'
    );

    $('#right .inner').empty().append(
      '<div id="alert_right">' +
      '</div>'
    );
  }

};
