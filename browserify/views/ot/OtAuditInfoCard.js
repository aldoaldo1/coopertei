C.View.OtAuditInfoCard = Backbone.View.extend({
  // Configuration

  name: 'ot_infocard',

  title: 'Datos de la O/T',

  fieldnames: {
    number: 'O/T N&ordm;',
    //client_number: 'O/T Cliente',
    equipment: 'Equipo (TAG)',
    client: 'Cliente',
    delivery: 'Fecha de entrega',
    reworked_number: 'Es retrabajo de'
  },

  initialize: function() {
    var me = this;

    $('.ot_infocard').remove();
    F.createInfoCard(this, $('#ot_right'), function() {
      $('#right').trigger('ot_infocard_loaded', [me]);
    });
  }

});
