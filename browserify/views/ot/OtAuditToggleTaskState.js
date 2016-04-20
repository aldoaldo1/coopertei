C.View.OtAuditToggleTaskState = Backbone.View.extend({
  // Configuration

  name: 'ot_toggle_task_state',

  employees: null,

  initialize: function() {
    if (!this.options.currentTaskState) {
      var me = this;

      $(document).bind('employees_loaded', function() {
        me.render();
      });
      this.getEmployees();
    } else {
      this.performToggleState();
    }
  },

  getEmployees: function() {
    var me = this;

    $.ajax({
      type: 'GET',
      url: '/employee',
      success: function(response) {
        me.employees = response;
        $(document).trigger('employees_loaded');
      }
    });
  },

  render: function() {
    var me = this;

    if (!$('#ot_toggle_task_state_window').length) {
      this.template();
    }

    $('#ot_toggle_task_state_window .BUTTON_cancel').on('click', function() {
      me.cancelToggleState();
    });
    $('#ot_toggle_task_state_window .BUTTON_proceed').on('click', function() {
      me.performToggleState();
    });

    $.blockUI({
      message: $('#ot_toggle_task_state_window'),
      css: {
        top: '0',
        left: '30%',
        width: '38%',
        height: '100%',
        border: 'none',
        padding: '1%',
        cursor: 'default'
      }
    });
  },

  template: function() {
    $('body').append(
      '<div id="ot_toggle_task_state_window" style="display:none;">' +
        '<h1 class="bold">Liste los empleados que trabajaron y horarios invertidos en esta tarea:</h1>' +
        '<br /><br />' +
        '<form id="toggle_task_state_ot_form">' +
          '<div></div>' +
        '</form>' +
        '<br /><br />' +
        '<a class="BUTTON_cancel lefty">Cancelar</a>' +
        '<input type="button" class="BUTTON_proceed righty button" value="Completar Tarea" />' +
      '</div>'
    );

    for (var i = 1; i <= 3; i += 1) {
      $('#toggle_task_state_ot_form div').append(
        this.buildEmployeesList('toggle_task_employee_' + i)[0]
      ).append(
        '<input type="text" name="toggle_task_schedule_' + i + '_h" maxlength="2" /> : ' +
        '<input type="text" name="toggle_task_schedule_' + i + '_m" maxlength="2" /> hs.'
      ).append(
        '<br />Materiales/Herramientas ' +
        '<input type="text" name="toggle_task_materials_tools_' + i + '" style="width:65%;" />' +
        '<hr />'
      );
    }

    $('.button').button();
  },

  // Methods

  cleanModals: function(callback) {
    $.unblockUI();
    window.setTimeout(function() {
      $('#toggle_task_state_window').remove();

      if (callback) {
        callback();
      }
    }, 1000);
  },

  buildEmployeesList: function(name) {
    var list = $('<select>', { name: name });

    $(list).append($('<option>', { value: 0 }).text('Seleccione empleado...'));

    _.each(this.employees, function(e) {
      $(list).append(
        $('<option>', { value: e.id }).text(e.name)
      );
    });

    return list;
  },

  performToggleState: function() {
    this.options.performToggleTaskState(this.cleanModals);
  },

  cancelToggleState: function() {
    $(this.options.checkbox).attr('checked', false);
    this.cleanModals();
  }

});
