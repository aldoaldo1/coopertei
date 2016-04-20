C.View.InoutTable = Backbone.View.extend({
  // Configuration

  name: 'inout',

  headers: ['ID', 'ID Empleado', 'Empleado', 'Fecha y Hora Autorizadas',
            'Egreso', 'Reingreso'],

  attrs: ['id', 'employee_id', 'employee', 'authorized',
          'out', 'comeback'],

  data: null,

  rowHandler: function(row, model) {
    var me = this,
        dt = $('inout_table').dataTable();

    function assignCheckbox(colname, i, fn) {
      var cell = $(row).find('td')[i],
          checkbox = $('<input>', {
            type: 'checkbox',
            class: colname + '_' + model.id + '_checkbox'
          });

      $(checkbox).on('click', function() {
        F.msgConfirm(
          '\u00BFEst\u00E1 seguro?',
          function() {
            fn(model, function(datetime) {
              $(cell).empty().append(datetime);
            });
          },
          function() {
            $(checkbox).attr('checked', false);
          }
        );
      });
      $(cell).empty().append(checkbox);
    }

    if (model.out === null) {
      assignCheckbox('out', 4, me.registerOut);
    } else if (model.comeback === null) {
      assignCheckbox('comeback', 5, me.registerComeback);
    }
  },

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.inout_form'), data);
    });
  },

  events: {
    "click .inout_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  },

  registerOut: function(model, fn) {
    $.ajax({
      url: '/inout/out/' + model.id,
      success: function(response) {
        fn(response);
      }
    });
  },

  registerComeback: function(model, fn) {
    $.ajax({
      url: '/inout/comeback/' + model.id,
      success: function(response) {
        fn(response);
      }
    });
  }

});
