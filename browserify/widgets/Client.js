C.Widget.Client = {

  initialize: function() {
    $('#head #tabs').empty().append(
      '<a href="/#/clients/authorizations">Autorizaciones</a>' +
      '<a href="/#/clients/authorizationshistory">Historial de Autorizaciones</a>' +
      '<a href="/#/clients/payroll">N&oacute;mina</a>'
    );

    $('#left .inner').empty().append(
      '<div id="client_left">' +
      '</div>' +
      '<style>' +
      '#tabs {' +
      //'  border-bottom: 1px solid #cebdde;' +
      '}' +
      '#tabs a {' +
      //'  border: 1px solid #cebdde;' +
      '  border-bottom: none;' +
      '}' +
      '.ui-widget-header {' +
      '  background: #cebdde url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
	    '    background: -moz-linear-gradient(top, #cebdde 0%, #cebdde 100%); /* FF3.6+ */' +
	    '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cebdde), color-stop(100%,#cebdde)); /* Chrome,Safari4+ */' +
	    '    background: -webkit-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Chrome10+,Safari5.1+ */' +
	    '    background: -o-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Opera11.10+ */' +
	    '    background: -ms-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* IE10+ */' +
	    '    background: linear-gradient(top, #cebdde 0%,#cebdde 100%); /* W3C */' +
      '}' +
      '.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { ' +
	    '  background: #cebdde url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
		  '    background: -moz-linear-gradient(top, #cebdde 0%, #cebdde 100%); /* FF3.6+ */' +
		  '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cebdde), color-stop(100%,#cebdde)); /* Chrome,Safari4+ */' +
		  '    background: -webkit-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Chrome10+,Safari5.1+ */' +
		  '    background: -o-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Opera11.10+ */' +
		  '    background: -ms-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* IE10+ */' +
		  '    background: linear-gradient(top, #cebdde 0%,#cebdde 100%); /* W3C */' +
	    '  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
      '}' +
      '#foot {' +
      ' border-top: 1px solid #cebdde;' +
      '}' +
      '</style>'
    );

    $('#right .inner').empty().append(
      '<div id="client_right">' +
      '</div>'
    );
  }

};
