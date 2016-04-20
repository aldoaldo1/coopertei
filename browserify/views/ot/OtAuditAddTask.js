C.View.OtAuditAddTask = Backbone.View.extend({
  // Configuration

  name: 'ot_add_task_window',

  initialize: function() {
    this.render();
  },

  render: function() {
    var me = this;

    if (!$('#ot_add_task_window').length) {
      this.template();

      $('#ot_add_task_window .BUTTON_cancel').on('click', function() {
        me.cancelAddTask();
      });
      $('#ot_add_task_window .BUTTON_proceed').on('click', function() {
        me.performAddTask();
      });
    }

    $.blockUI({
      message: $('#ot_add_task_window'),
      css: {
        top: '15%',
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
      '<div id="ot_add_task_window" style="display:none;">' +
        '<h1 class="bold">Ingrese los datos de la nueva Tarea:</h1>' +
        '<br /><br />' +
        '<form id="add_task_ot_form">' +
          '<label for="new_task_name">Nombre</label>' +
          '<input type="text" name="new_task_name" />' +
          '<label for="new_task_description">Descripci&oacute;n</label>' +
          '<textarea name="new_task_description" style="height:100px;"></textarea>' +
        '</form>' +
        '<br /><br />' +
        '<a class="BUTTON_cancel lefty">Cancelar</a>' +
        '<input type="button" class="BUTTON_proceed righty button" value="Agregar Tarea" />' +
      '</div>'
    );
    $('.button').button();
  },

  // Methods

  cleanModals: function(callback) {
    $.unblockUI();
    window.setTimeout(function() {
      $('#ot_add_task_window').remove();

      if (callback) {
        callback();
      }
    }, 1000);
  },

  performAddTask: function() {
    this.options.addNewTask({
      name: $('#add_task_ot_form input:text[name=new_task_name]').val(),
      description: $('#add_task_ot_form textarea[name=new_task_description]').val()
    }, this.cleanModals);
  },

  cancelAddTask: function() {
    this.cleanModals();
  }

});
