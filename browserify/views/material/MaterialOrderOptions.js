C.View.MaterialOrderOptions = Backbone.View.extend({
  // Configuration

  initialize: function() {
    this.render();
  },

  render: function() {
    if (!C.Session.isVigilance()) {
      $(this.el).append(this.template());
    }

    return this;
  },

  template: function() {
    var options = $('<div>', { class: 'right_options' });

    $(options).append(
      $('<input>', { type: 'button', class: 'create_order', value: 'Crear Pedido' })
    );

    return options;
  },

  events: {
    "click #material_left .create_order": "createOrder"
  },

  // Methods

  getTable: function() {
    return this.options.material_table;
  },

  getSelectedRow: function() {
    return this.options.material_table.selected_row;
  },

  createOrder: function() {
    var me = this;

    new C.View.MaterialCreateOrder({
      createNewOrder: function(data, cleanModals) {
        $.ajax({
          type: 'POST',
          url: '/materialorder',
          data: {
            ot_number: data.ot_number,
            ottask_id: data.ottask_id,
            provider: data.provider,
            materials: data.materials
          },
          success: function(response) {
            if (response.result === true) {
              cleanModals(function() {
                window.location.reload();
              });
            } else {
              cleanModals(function() {
                F.msgError('Ocurri&oacute; un error al guardar el pedido');
              });
            }
          }
        });
      }
    });
  },

  cleanModals: function() {
    $.unblockUI();
    window.setTimeout(function() {
      $('#material_order_window').remove();
      $('.BUTTON_create_order').attr('disabled', false);
    }, 1000);
  }

});
