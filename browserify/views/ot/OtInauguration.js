C.View.OtInauguration = Backbone.View.extend({
  // Configuration

  el: $('#ot_right'),

  name: 'ot_form',

  title: 'Datos de la &Oacute;rden de Trabajo a inaugurar',

  fields: {
    client_id: { label: 'Cliente', type: 'select' },
    equipment_id: { label: 'Equipo (TAG)', type: 'select' }
  },

  isCRUD: false,

  buttons: { create: true, save: false, cancel: false, delete: false },

  relations: { clients: null, equipments: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('client', function(clients) {
        me.relations.clients = clients;
        F.getAllFromModel('equipment', function(equipments) {
          me.relations.equipments = equipments;

          F.createForm(me, $('#ot_right'), function() {
            $('.ot_form .BUTTON_create').val('Inaugurar');
            $('.ot_form .BUTTON_create').on('click', function() {
              me.inaugurateOt();
            });
          });
      });
    });
  },

  events: {
    //"click .ot_form .BUTTON_create": "inaugurateOt",
  },

  // Methods

  inaugurateOt: function() {
    $.ajax({
      type: 'POST',
      url: '/ot/inaugurate',
      data: $('.ot_form').serialize(),
      success: function(response) {
        if (response.result === true) {
          F.msgOK('La O/T N&ordm; ' + response.ot_number + ' ha sido inaugurada');
        } else {
          F.msgError('Ocurri&oacute; un problema al inaugurar la O/T');
        }
      }
    });
  }

});
