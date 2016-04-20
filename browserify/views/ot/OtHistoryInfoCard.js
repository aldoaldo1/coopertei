C.View.OtHistoryInfoCard = Backbone.View.extend({
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

    F.createInfoCard(me, $('#ot_right'));
  }

});
