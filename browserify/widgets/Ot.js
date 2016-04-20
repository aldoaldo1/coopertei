C.Widget.Ot = {

  initialize: function(model_name) {
    if (C.Session.roleID() != 1) {
      $('#head #tabs').empty().append(
        '<a href="/#/ots/audit">Seguimiento</a>'
      );
    } else {
      $('#head #tabs').empty().append(
        '<a href="/#/ots/inauguration">Inauguraci&oacute;n</a>'
      );
    }

    if (C.Session.roleID() >= 3) {
      $('#head #tabs').append(
        '<a href="/#/ots/admin">Administraci&oacute;n</a>' +
        '<a href="/#/ots/plans">Planes de Tareas</a>' +
        '<a href="/#/ots/history">Historial</a>'
      );
    }

    $('#left .inner').empty().append(
      '<div id="' + (model_name || 'ot') + '_left">' +
      '</div>' +
      '<style>' +
      '#tabs {' +
      //'  border-bottom: 1px solid #d9e1ee;' +
      '}' +
      '#tabs a {' +
      //'  border: 1px solid #d9e1ee;' +
      '  border-bottom: none;' +
      '}' +
      '.ui-widget-header {' +
      '  background: #d9e1ee url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
	    '    background: -moz-linear-gradient(top, #d9e1ee 0%, #d9e1ee 100%); /* FF3.6+ */' +
	    '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#d9e1ee), color-stop(100%,#d9e1ee)); /* Chrome,Safari4+ */' +
	    '    background: -webkit-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Chrome10+,Safari5.1+ */' +
	    '    background: -o-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Opera11.10+ */' +
	    '    background: -ms-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* IE10+ */' +
	    '    background: linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* W3C */' +
      '}' +
      '.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { ' +
	    '  background: #d9e1ee url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
		  '    background: -moz-linear-gradient(top, #d9e1ee 0%, #d9e1ee 100%); /* FF3.6+ */' +
		  '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#d9e1ee), color-stop(100%,#d9e1ee)); /* Chrome,Safari4+ */' +
		  '    background: -webkit-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Chrome10+,Safari5.1+ */' +
		  '    background: -o-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Opera11.10+ */' +
		  '    background: -ms-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* IE10+ */' +
		  '    background: linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* W3C */' +
	    '  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
      '}' +
      '#foot {' +
      ' border-top: 1px solid #d9e1ee;' +
      '}' +
      '</style>'
    );

    $('#right .inner').empty().append(
      '<div id="' + (model_name || 'ot') + '_right">' +
      '</div>'
    );
  }

};
