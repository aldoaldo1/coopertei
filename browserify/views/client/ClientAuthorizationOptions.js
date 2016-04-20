C.View.ClientAuthorizationOptions = Backbone.View.extend({
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
      $('<input>', { type: 'button', class: 'ot_authorize',
                     value: 'Autorizar O/T', disabled: 'disabled' })
    );

    return options;
  },

  events: {
    "click #client_left .ot_authorize": "authorizeOt"
  },

  // Methods

  getForm: function() {
    return this.options.client_form;
  },

  getTable: function() {
    return this.options.client_table;
  },

  getSelectedRow: function() {
    return this.options.client_table.selected_row;
  },

  authorizeOt: function() {
    var dt = $('.client_table').dataTable(),
        selected_row = F.getDataTableSelection($('.client_table'))[0],
        ot_id = dt.fnGetData(selected_row)[1];

    F.msgConfirm('&iquest;Est&aacute; seguro que desea AUTORIZAR esta O/T?',
      function() {
        $.ajax({
          url: '/authorization/confirm/' + ot_id,
          success: function(response) {
            $($(selected_row).children()[3]).html('Autorizada');
          }
        });
      }
    );
  }

});
