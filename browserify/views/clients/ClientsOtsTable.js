C.View.ClientsOtsTable = Backbone.View.extend({
  // Configuration

  name: 'clients',

  headers: ['ID', 'O/T', 'ID Equipo', 'Equipo (TAG)', 'ID Internvenci&oacute;n',
            'Motivo de intervenci&oacute;n', 'Inauguraci&oacute;n', 'Fecha de entrega',
            'Acciones'],

  attrs: ['id', 'number', 'equipment_id', 'equipment', 'intervention_id',
          'intervention', 'created_at', 'delivery',
          'actions'],

  data: null,

  datatableOptions: {
    "aoColumns": [null, null, null, null, null,
                  null, { "sType": "es_date" }, { "sType": "es_date" },
                  null]
  },

  rowHandler: function(row, model) {
    var authorize_button = $('<input type="button" value="Autorizar" class="authorize_ot_button">'),
        visualize_link = $('<span class="visualize_ot_events">Visualizar</span>');

    $(row).on('mouseover', function() {
      $(this).find('td').css({ backgroundColor: '#c2dcde' });
      $(visualize_link).css({ color: 'black' });
    });
    $(row).on('mouseout', function() {
      $(this).find('td').css({ backgroundColor: 'white' });
      $(visualize_link).css({ color: '#30858c' });
    });

    $($(row).children().get(8)).css({ textAlign: 'right' });

    // Client notificated or time expired; not yet authorized
    if (model.otstate_id == 2 || model.otstate_id == 3) {
      $($(row).children().get(8)).append(authorize_button);

      $(authorize_button).on('click', function() {
        F.msgConfirm('Esta acci&oacute;n dara comienzo a la &Oacute;rden de trabajo seleccionada',
          function() {
            $.ajax({
              type: 'GET',
              url: '/clientauthorize/' + model.id,
              success: function(response) {
                F.onSuccess(response,
                  function(result) {
                    F.msgOK('La &Oacute;rden de Trabajo ha sido autorizada.');
                    $(authorize_button).remove();
                  },
                  function(err) {
                    F.msgError('Ocurri&oacute; un error al autorizar la O/T. Intente nuevamente.');
                  }
                );
              }
            });
          }
        );
      });
    }

    $($(row).children().get(8)).append(visualize_link);
    $(visualize_link).on('click', function() {
      window.location = '/#/client/events/' + model.id;
    });
  },

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(row_data) {
      F.doNothing();
    });
  }

});
