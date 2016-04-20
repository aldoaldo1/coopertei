C.View.ClientAuthorizationHistoryInfoCard = Backbone.View.extend({
  // Configuration

  name: 'client_authorization_history_infocard',

  title: 'Datos de la Autorizaci&oacute;n',

  fieldnames: {
    ot_number: 'O/T N&ordm;',
    req_info_sent_date: 'Env&iacute;o de Informe',
    client: 'Cliente',
    otstate: 'Estado'
  },

  initialize: function() {
    var me = this;

    F.createInfoCard(me, $('#client_right'));
  }

});
