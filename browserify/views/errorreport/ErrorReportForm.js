C.View.ErrorReportForm = Backbone.View.extend({
  // Configuration

  name: 'errorreport_form',

  title: 'Datos del Cliente',

  fields: {
    description: { label: 'Descripci&oacute;n' },
    suggestion: { label: 'Sugerencia' }
  },

  relations: { modules: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('module', function(modules) {
      me.relations.modules = modules;

      var form = $('<form>', { id: 'errorreport_form' });

      $(form).append(
        '<label for="description">Descripci&oacute;n:</label>' +
        '<textarea name="description" />' +
        '<label for="suggestion">Sugerencia:</label>' +
        '<textarea name="suggestion" />' +
        '<input type="button" value="Enviar reporte" class="BUTTON_create" />'
      );

      $('span#errorreport').addClass('opened');
      $('body').append(form);

      $('#errorreport_form').resizable({ handles: 'ne' });
      $('#errorreport_form .BUTTON_create').on('click', function() {
        $.ajax({
          type: 'POST',
          url: '/errorreport',
          data: $('#errorreport_form').serialize(),
          success: function(response) {
            if (response === true) {
              // Close popup
              $('#errorreport_form').fadeOut('slow', function() {
                $(this).remove();
                $('span#errorreport').removeClass('opened');
              });
            } else {
              F.msgError('Ocurri&oacute; un error al enviar el reporte.');
            }
          }
        });
      });

      $(form).fadeIn();
    });
  }

});
