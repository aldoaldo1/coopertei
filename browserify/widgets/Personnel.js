C.Widget.Personnel = {

  initialize: function(model_name) {
    $('#head #tabs').empty().append(
      '<a href="/#/personnel/inouts">Entradas/Salidas</a>'
    );

    C.Session.doIfInRolesList([3, 4, 5], function() {
      $('#head #tabs').append(
        '<a href="/#/personnel/history">Historial</a>' +
        '<a href="/#/personnel/payroll">N&oacute;mina</a>'
      );
    }, true);

    $('#left .inner').empty().append(
      '<div id="' + (model_name || 'personnel') + '_left">' +
      '</div>' +
      '<style>' +
      '#tabs {' +
      //'  border-bottom: 1px solid #ffddaa;' +
      '}' +
      '#tabs a {' +
      //'  border: 1px solid #ffddaa;' +
      '  border-bottom: none;' +
      '}' +
      '.ui-widget-header {' +
      '  background: #ffddaa url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
	    '    background: -moz-linear-gradient(top, #ffddaa 0%, #ffddaa 100%); /* FF3.6+ */' +
	    '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffddaa), color-stop(100%,#ffddaa)); /* Chrome,Safari4+ */' +
	    '    background: -webkit-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Chrome10+,Safari5.1+ */' +
	    '    background: -o-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Opera11.10+ */' +
	    '    background: -ms-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* IE10+ */' +
	    '    background: linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* W3C */' +
      '}' +
      '.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { ' +
	    '  background: #ffddaa url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
		  '    background: -moz-linear-gradient(top, #ffddaa 0%, #ffddaa 100%); /* FF3.6+ */' +
		  '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffddaa), color-stop(100%,#ffddaa)); /* Chrome,Safari4+ */' +
		  '    background: -webkit-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Chrome10+,Safari5.1+ */' +
		  '    background: -o-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Opera11.10+ */' +
		  '    background: -ms-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* IE10+ */' +
		  '    background: linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* W3C */' +
	    '  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
      '}' +
      '#foot {' +
      ' border-top: 1px solid #ffddaa;' +
      '}' +
      '</style>'
    );

    $('#right .inner').empty().append(
      '<div id="' + (model_name || 'personnel') + '_right">' +
      '</div>'
    );
  }

};
