C.Widget.Material = {

  initialize: function() {
    $('#head #tabs').empty().append(
      '<a href="/#/materials/orders">Pedidos</a>'
    );

    if (!C.Session.isVigilance()) {
      $('#head #tabs').append(
        '<a href="/#/materials/stock">Stock</a>' +
        '<a href="/#/materials/history">Historial</a>'
      );
    }

    $('#left .inner').empty().append(
      '<div id="material_left">' +
      '</div>' +
      '<style>' +
      '#tabs {' +
      //'  border-bottom: 1px solid #cfe7d2;' +
      '}' +
      '#tabs a {' +
      //'  border: 1px solid #cfe7d2;' +
      '  border-bottom: none;' +
      '}' +
      '.ui-widget-header {' +
      '  background: #cfe7d2 url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
	    '    background: -moz-linear-gradient(top, #cfe7d2 0%, #cfe7d2 100%); /* FF3.6+ */' +
	    '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cfe7d2), color-stop(100%,#cfe7d2)); /* Chrome,Safari4+ */' +
	    '    background: -webkit-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Chrome10+,Safari5.1+ */' +
	    '    background: -o-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Opera11.10+ */' +
	    '    background: -ms-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* IE10+ */' +
	    '    background: linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* W3C */' +
      '}' +
      '.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { ' +
	    '  background: #cfe7d2 url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */' +
		  '    background: -moz-linear-gradient(top, #cfe7d2 0%, #cfe7d2 100%); /* FF3.6+ */' +
		  '    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cfe7d2), color-stop(100%,#cfe7d2)); /* Chrome,Safari4+ */' +
		  '    background: -webkit-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Chrome10+,Safari5.1+ */' +
		  '    background: -o-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Opera11.10+ */' +
		  '    background: -ms-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* IE10+ */' +
		  '    background: linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* W3C */' +
	    '  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
	    '  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;' +
      '}' +
      '#foot {' +
      ' border-top: 1px solid #cfe7d2;' +
      '}' +
      '</style>'
    );

    $('#right .inner').empty().append(
      '<div id="material_right">' +
      '</div>'
    );
  }

};
