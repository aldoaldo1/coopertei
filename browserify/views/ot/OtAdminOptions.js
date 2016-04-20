C.View.OtAdminOptions = Backbone.View.extend({
  // Configuration

  initialize: function() {
    this.render();
  },

  render: function() {
    $(this.el).append(this.template());

    return this;
  },

  template: function() {
    var options = $('<div>', { class: 'right_options' });

    $(options).append(
      $('<input>', { type: 'button', class: 'ot_conclude',
                     value: 'Conclu\u00EDr O/T', disabled: 'disabled' })
    );

    return options;
  },

  events: {
    "click #ot_left .ot_conclude": "concludeOt"
  },

  // Methods

  getForm: function() {
    return this.options.ot_form;
  },

  getTable: function() {
    return this.options.ot_table;
  },

  getSelectedRow: function() {
    return this.options.ot_table.selected_row;
  },

  concludeOt: function() {
    var me = this,
        t = $('.ot_table'),
        selected_row = F.getDataTableSelection(t)[0],
        ot_id = $(t).dataTable().fnGetData(selected_row)[0],
        ot_number = $('.ot_table').dataTable().fnGetData(selected_row)[1];

    F.msgConfirm(
      '\u00BFRealmente desea conclu\u00EDr la auditor\u00EDa de la \u00D3rden de Trabajo N&ordm; ' + ot_number + '?',
      function() {
        new C.View.OtAdminConcludeForm({
          el: $('body'),
          ot_number: ot_number,
          performConclusion: function(cleanModals) {
            $.ajax({
              type: 'POST',
              url: '/ot/conclude/' + ot_id,
              data: $('#conclude_ot_form').serialize(),

              success: function(response) {
                if (response.result === true) {
                  cleanModals();
                  $(me.getSelectedRow()).fadeOut('slow', function() {
                    $(this).remove();
                    F.msgOK('La O/T ha sido conclu&iacute;da');
                  });
                } else if (response.reason) {
                  F.msgError(response.error);
                } else {
                  F.msgError('Ocurri&oacute; un error al conclu&iacute;r la O/T');
                }
              }
            });
          }
        });
      }
    );
  }

});
