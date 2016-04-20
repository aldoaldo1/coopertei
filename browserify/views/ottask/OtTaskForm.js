C.View.OtTaskForm = Backbone.View.extend({
  // Configuration

  name: 'task_form',

  title: 'Datos de la Tarea',

  fields: {
    name: { label: 'Nombre', check: 'alpha' },
    description: { label: 'Descripci&oacute;n', type: 'textarea' },
    due_date: { label: 'Vencimiento', type: 'datepicker' },
    area_id: { label: '&Aacute;rea', type: 'select' },
    observation: { label: 'Observaci&oacute;n', type: 'textarea' }
  },

  isCRUD: false,

  buttons: { save: true, delete: true, cancel: true },

  relations: { areas: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('area', function(areas) {
      me.relations.areas = areas;

      F.createForm(me);
      $('.task_form input:hidden.selection_id').remove();

      // Popullate the form
      var t = me.getTask(),
          form = $('.task_form'),
          fields = $(form).getFields(),
          attr_name;

      $(form).append($('<input>', {
        type: 'hidden',
        value: t.id,
        class: 'selection_ottask_id'
      }));

      $(fields).each(function() {
        attr_name = $(this).attr('name');
        $(this).val(t[attr_name]);

        if (attr_name === 'due_date') {
          $(this).val(moment(t[attr_name]).format('DD/MM/YYYY'));
        } else if (attr_name === 'area_id') {
          $(this).trigger("liszt:updated");
        }
      });
    });
  },

  events: {
    "click .task_form .BUTTON_save": "editTask",
    "click .task_form .BUTTON_delete": "delTask",
    "click .task_form .BUTTON_cancel": "cancelEditTask",
  },

  // Methods

  getTask: function() {
    return this.options.task;
  },

  getDataTable: function() {
    return $(this.table).dataTable();
  },

  getSelectionRow: function() {
    return $('.complete_task_' + this.getTask().id).parent();
  },

  getSelectionID: function() {
    return parseInt($('.task_form .selection_ottask_id').val());
  },

  reloadOtRowDetails: function() {
    $('tr.selected_row').next().css({ opacity: 0.5 });
    $('tr.selected_row').click();
    window.setTimeout(function() {
      $('tr.selected_row').click();
    }, 500);
  },

  editTask: function() {
    var me = this;

    $.ajax({
      type: 'PUT',
      url: '/ottask/' + me.getSelectionID(),
      data: $('.task_form').serializeObject(),
      success: function(response) {
        if (response !== false) {
          //F.msgOK('La Tarea ha sido actualizada');
          me.reloadOtRowDetails();
        }
      }
    });
  },

  delTask: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar esta Tarea?', function() {
      $.ajax({
        type: 'DELETE',
        url: '/ottask/' + me.getSelectionID(),
        success: function(response) {
          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
            me.reloadOtRowDetails();
          });
        }
      });
    });
  },

  cancelEditTask: function() {
    $('.task_form').fadeOut('slow', function() {
      $(this).remove();
    });
  }

});
