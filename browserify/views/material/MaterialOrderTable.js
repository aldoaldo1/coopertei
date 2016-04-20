C.View.MaterialOrderTable = Backbone.View.extend({
  // Configuration

  name: 'material',

  headers: ['ID', 'O/T ID', 'O/T', 'Equipo (TAG)', 'ID Tarea', 'Tarea',
            'Proveedor', 'Fecha'],

  attrs: ['id', 'ot_id', 'ot_number', 'tag', 'ottask_id', 'ottask',
          'provider', 'date'],

  data: null,

  datatableOptions: {
    "aoColumns": [null, null, null, null, null, null,
                  null, { "sType": "es_date" }],
    "aaSorting": [[7, "asc"]]
  },

  initialize: function() {
    var me = this;

    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      me.showDetails(data);
    });
  },

  events: {
    "click .material_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  },

  showDetails: function(data) {
    var me = this;

    $.ajax({
      url: '/materialorder/elements/' + data.id,
      success: function(response) {
        if (response.result === true) {
          $('.material_order_infocard').empty();
          me.renderDetails(response.elements);
        }
      }
    });
  },

  renderDetails: function(elements) {
    var element_id, checkbox, p;

    $('.material_order_infocard').append(
      '<h3>Datos del Pedido de Material</h3>' +
      '<h4>Llegadas</h4>'
    );

    _.each(elements, function(e) {
      checkbox = $('<input>', { type: 'checkbox', checked: e.arrived });

      $(checkbox).on('click', function() {
        $.ajax({
          url: '/materialorder/arrival/' + e.id,
          success: function(response) {
            if (response.result === false) {
              $(checkbox).attr('checked', e.arrived);
            }
          }
        });
      });

      p = $('<p>');
      $(p).append('<span class="hidden" data-id="' + e.id + '"></span>');
      $(p).append(checkbox);
      $(p).append(
        '<span class="element_name">' + e.name + '</span>: ' +
        '<span class="element_quantity">' + e.quantity + '</span> ' +
        '<span class="element_unit">' + e.unit.split(' ')[0] + '</span>'
      );

      $('.material_order_infocard').append(p);
    });
  }

});
