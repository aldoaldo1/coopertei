C.View.OtAdminConcludeForm = Backbone.View.extend({
  // Configuration

  name: 'ot_conclude_form',

  initialize: function() {
    this.render();
  },

  render: function() {
    var me = this;

    if (!$('#ot_conclude_window').length) {
      $(this.el).append(this.template());

      $('#ot_conclude_window .BUTTON_cancel').on('click', function() {
        me.cancelConcludeOt();
      });
      $('#ot_conclude_window .BUTTON_proceed').on('click', function() {
        me.performConcludeOt();
      });
    }

    $.blockUI({
      message: $('#ot_conclude_window'),
      css: {
        top: '25%',
        left: '30%',
        width: '38%',
        border: 'none',
        padding: '1%',
        cursor: 'default'
      }
    });
  },

  template: function() {
    $('body').append(
      '<div id="ot_conclude_window" style="display:none;">' +
        '<h1>&iquest;Est&aacute; seguro de querer conclu&iacute;r ' +
        'la auditor&iacute;a de la O/T N&ordm; ' + this.options.ot_number + '?</h1>' +
        '<br /><br />' +
        '<p class="rednote">Esta operaci&oacute;n es IRREVERSIBLE</p>' +
        '<br /><br />' +
        '<p>En caso afirmativo, elija el motivo y redacte una observaci&oacute;n final:</p>' +
        '<br /><br />' +
        '<form id="conclude_ot_form">' +
        '<div>' +
          '<input type="radio" name="motive" value="1" />Intervenci&oacute;n satisfactoria<br />' +
          '<input type="radio" name="motive" value="2" />Irreparabilidad<br />' +
          '<input type="radio" name="motive" value="3" />Otro (aclare)<br />' +
        '</div>' +
        '<br /><br />' +
        '<textarea name="observation" style="width:100%; height:50px;"></textarea>' +
        '</form>' +
        '<br /><br />' +
        '<a class="BUTTON_cancel lefty" style="cursor:pointer;">Cancelar</a>' +
        '<input type="button" class="BUTTON_proceed righty button" value="Proceder" />' +
      '</div>'
    );
  },

  // Methods

  cleanModals: function(callback) {
    $.unblockUI();

    window.setTimeout(function() {
      $('#ot_conclude_window').remove();

      if (callback) {
        callback();
      }
    }, 1000);
  },

  performConcludeOt: function() {
    this.options.performConclusion(this.cleanModals);
  },

  cancelConcludeOt: function() {
    this.cleanModals();
  }

});
