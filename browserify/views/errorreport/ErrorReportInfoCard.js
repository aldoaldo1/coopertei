C.View.ErrorReportInfoCard = Backbone.View.extend({
  // Configuration

  name: 'errorreport_infocard',

  title: 'Datos del Reporte de Error',

  fieldnames: {
    user: 'Usuario',
    description: 'Descripci&oacute;n',
    suggestion: 'Sugerencia'
  },

  initialize: function() {
    var me = this;

    F.createInfoCard(me, $('#errorreport_right'));
  }

});
