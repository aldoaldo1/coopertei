C.View.OtAuditOptions = Backbone.View.extend({
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
      $('<input>', { type: 'button', class: 'ot_add_task',
                     value: 'Agregar Tarea', disabled: 'disabled',
                     title: 'Agrega una Tarea al final &oacute; debajo de la seleccionada actualmente.' }),
      $('<input>', { type: 'button', class: 'ot_rework_task',
                     value: 'Retrabajar Tarea', disabled: 'disabled',
                     title: 'Cancela la Tarea seleccionada y agrega una nueva id&eacute;ntica debajo de la misma.' })
    );

    return options;
  },

  events: {
    "click #ot_left .ot_add_task": "addTask",
    "click #ot_left .ot_rework_task": "reworkTask"
  },

  // Methods

  getInfoCard: function() {
    return this.options.ot_infocard;
  },

  getSelectedRow: function() {
    return this.options.ot_table.selected_row;
  },

  reloadRowDetails: function() {
    $('tr.selected_row').next().css({ opacity: 0.5 });
    $('tr.selected_row').click();
    window.setTimeout(function() {
      $('tr.selected_row').click();
    }, 500);
  },

  addTask: function() {
    var me = this;

    new C.View.OtAuditAddTask({
      addNewTask: function(data, cleanModals) {
        var dt = $('.ot_table').dataTable(),
            ot_id = dt.fnGetData(selected_row)[0][0],
            selected_row = F.getDataTableSelection($('.ot_table'))[0],
            selected_row_position = 0;

        if ($('.selected_ottask').length) {
          selected_row_position = parseInt($('.selected_ottask').attr('data-position'));
        }

        $.ajax({
          url: '/ottask/add',
          type: 'POST',
          data: {
            ot_id: ot_id,
            name: data.name,
            description: data.description,
            selected_row_position: selected_row_position
          },
          success: function(response) {
            if (response === true) {
              cleanModals();
              me.reloadRowDetails();
            }
          }
        });
      }
    });
  },

  reworkTask: function() {
    var me = this,
        id = $('.selection_ottask_id').val();

    F.msgConfirm('Esta opreaci&oacute;n RETRABAJAR&Aacute; la Tarea.',
      function() {
        var selected_row_position = parseInt($('.selected_ottask').attr('data-position'));

        $.ajax({
          url: '/ottask/rework/' + id + '/after/' + selected_row_position,
          success: function(response) {
            if (response === true) {
              me.reloadRowDetails();
            }
          }
        });
      }
    );
  }

});
