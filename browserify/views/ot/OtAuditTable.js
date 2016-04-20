C.View.OtAuditTable = Backbone.View.extend({
  // Configuration

  name: 'ot',

  headers: ['ID', 'O/T', 'O/T Cliente', 'ID Equipo', 'Equipo (TAG)', 'ID Cliente', 'Cliente',
            'Fecha de entrega', 'Retrabajo de'],

  attrs: ['id', 'number', 'client_number', 'equipment_id', 'equipment', 'client_id', 'client',
          'delivery', 'reworked_number'],

  hidden_columns: ['reworked_number'],

  data: null,

  datatableOptions: {
    "aoColumns": [null, null, null, null, null, null, null,
                  { "sType": "es_date" }, null],
    "aaSorting": [[6, "asc"]],
    "iDisplayLength": 15
  },

  initialize: function() {
    var me = this;

    this.data = this.options.collection;
    this.area_id = this.options.area_id;

    function openRow(table, ot_number) {
      var oTable = $(table).dataTable();

      $('.ot_table tbody tr').on('click', function() {
        // Open/Close selected
        if (oTable.fnIsOpen(this)) {
          $('.task_form').fadeOut('slow', function() {
            $(this).remove();
          });
          $('#ot_left .ot_rework_task').attr('disabled', true).css({ color: 'graytext' });
          oTable.fnClose(this);
        } else {
          oTable.fnOpen(this, me.generateRowDetails(oTable, this), 'details');
        }
      });

      if (ot_number !== undefined) {
        var row = $(".ot_table tbody tr td:contains('" + ot_number + "')").parent();

        $(row).addClass('selected_row');
        //oTable.fnOpen(row, me.generateRowDetails(oTable, row), 'details');
        $(row).click();
      }
    }

    F.createDataTable(this,
      function(data) {
        F.assignValuesToInfoCard($('.ot_infocard'), data);
      },
      openRow
    );
  },

  events: {
    "click .ot_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
    $('#ot_left .ot_add_task').attr('disabled', false);
  },

  generateRowDetails: function(table, tr) {
    var me = this,
        data = table.fnGetData(tr),
        ot_id = data[0],
        out = '<div class="row_detail ot_id_' + ot_id + '" style="display:none;">',
        last_completed_task,
        total_completed_tasks = 0;

    this.getOtTasks(ot_id, function(tasks) {
      var p, checkbox, task_markup;

      if (tasks.length) {
        var is_first_task = true,
            position = 1;

        me.appendRowDetailsHeaders(ot_id);

        _.each(tasks, function(t) {
          p = $('<p data-position="' + position + '">');
          position += 1;

          checkbox = $('<input>', { type: 'checkbox', class: 'complete_task_' + t.id });

          task_markup = '<span>' + t.name + ' - </span> ' + t.description;
          task_markup += '<span class="task_due_date">' + F.toHumanDate(t.due_date, false) + '</span>';

          if (t.completed_date) {
            task_markup += '<span class="task_completed_date">' + F.toHumanDate(t.completed_date, false) + '</span>';
          } else if (t.reworked != 0) {
            task_markup += '<span class="task_completed_date" style="color:darkred;">Retrabajada</span>';
          } else {
            task_markup += '<span class="task_completed_date" style="color:#555;">Incompleta</span>';
          }

          if (C.Session.roleID() >= 3) {
            $(p).append(checkbox);
          }
          $(p).append(task_markup);

          // Users can only interact with the tasks of their area or every task if they are admins or sysadmins
          var current_role_id = C.Session.getUser().role_id,
              is_admin = current_role_id == 4,
              is_area_supervisor = current_role_id == 3 && me.area_id == t.area_id,
              cant_interact = me.area_id != t.area_id ||
                              current_role_id != 1 ||
                              current_role_id != 2 ||
                              current_role_id != 5;

          if (is_admin || is_area_supervisor) {
            $(checkbox).attr('disabled', false);
            $(p).css({ opacity: 1 });
          } else if (!is_first_task || cant_interact) {
            $(checkbox).attr('disabled', true);
            $(p).css({ opacity: 0.5 });
          }

          if (t.reworked != 0) {
            $(checkbox).attr('disabled', true);
            $(p).css({ opacity: 0.5 });
          } else if (t.completed == 1) {
            $(checkbox).attr('checked', true);
            $(checkbox).parent().addClass('crossed');
            last_completed_task = t.id;
            total_completed_tasks += 1;
          }

          $('.ot_id_' + ot_id).append(p).fadeIn();

          me.bindRenderOtTaskForm(p, t, cant_interact);
          me.bindEnableTaskActions(p, t, cant_interact);

          $('input:checkbox[class="complete_task_' + t.id + '"]').on('click', function() {
            var this_checkbox = this,
                msg = null,
                onNoAction = F.doNothing,
                currentTaskState = null;

            if ($(this_checkbox).is(':checked')) {
              msg = 'Esta operaci&oacute;n COMPLETAR&Aacute; la Tarea.';
              onNoAction = function() {
                $(this_checkbox).attr('checked', false);
              };
              currentTaskState = false;
            } else {
              msg = 'Esta operaci&oacute;n convertir&aacute; en INCOMPLETA la Tarea.';
              onNoAction = function() {
                $(this_checkbox).attr('checked', true);
              };
              currentTaskState = true;
            }

            F.msgConfirm(msg,
              function() {
                me.toggleTaskState(this_checkbox, t.id, currentTaskState, function(response) {
                  if (response === true && $(this_checkbox).is(':checked')) {
                    // Complete this task
                    $(this_checkbox).parent().addClass('crossed');
                    // Enable next task
                    $($(this_checkbox).parent().next().children()[0]).attr('disabled', false);
                    $(this_checkbox).parent().next().css({ opacity: 1 });
                  } else if (!$(this_checkbox).is(':checked')) {
                    // Uncomplete this task
                    $(this_checkbox).parent().removeClass('crossed');
                    // Disable next task
                    $($(this_checkbox).parent().next().children()[0]).attr('disabled', true);
                    $(this_checkbox).parent().next().css({ opacity: 0.5 });
                  }
                });
              },
              function() {
                onNoAction();
              }
            );
          });

          is_first_task = false;
        });

        // Enable next available task
        var x = 'input:checkbox[class="complete_task_' + parseInt(last_completed_task + 1) + '"]';
        $(x).attr('disabled', false);
        $(x).parent().css({ opacity: 1 });
      } else {
        $('.ot_infocard .ot_percentage').remove();
        $('.ot_id_' + ot_id).append('<p>Esta O/T no posee un Plan de Tareas asociado</p>').fadeIn();
      }

      var percentage = me.calculateCompletitionPercentage(tasks),
          pie_id = 'peity_pie_' + ot_id;

      $('span.' + pie_id).remove();
      $($(tr).children()[0]).append('<span class="' + pie_id + '">' + percentage.toString() + '/100</span>');
      $('span.' + pie_id).css({ position: 'relative', top: '3px', left: '10px' });
      $('span.' + pie_id).peity('pie');

      if (percentage > 0) {
        //me.drawPercentageLoader(tasks, percentage, total_completed_tasks);
      } else {
        $('#tasksCompletitionPercentage').remove();
      }
    });

    out += '</div>';

    return out;
  },

  calculateCompletitionPercentage: function(tasks) {
    var percentage, completed_tasks = 0;

    _.each(tasks, function(t) {
      if (t.completed == 1) {
        completed_tasks += 1;
      }
    });
    percentage = (completed_tasks / tasks.length) * 100;

    return percentage.toString().substr(0, 2);
  },

  drawPercentageLoader: function(tasks, percentage, total_completed_tasks) {
    var currentPercentage = percentage / 100,
        percentage = 0;

    $('#tasksCompletitionPercentage').remove();
    $('#right .inner').append('<div id="tasksCompletitionPercentage">')

    var loader = $('#right .inner #tasksCompletitionPercentage').percentageLoader({
      width: 150,
      height: 150,
      controllable: false,
      value: total_completed_tasks + ' / ' + tasks.length,
      progress: 0
    });

    var animateLoader = function() {
      percentage += 0.01;
      loader.setProgress(percentage);

      if (percentage < currentPercentage) {
        window.setTimeout(animateLoader, 25);
      } else {
        return;
      }
    };

    window.setTimeout(animateLoader, 25);
  },

  appendRowDetailsHeaders: function(ot_id) {
    $('.ot_id_' + ot_id).append(
      '<p class="row_details_headers">' +
      'Nombre - Descripción' +
      '<span>Estado - Vencimiento</span>' +
      '</p>'
    );
  },

  bindRenderOtTaskForm: function(task_row, task, cant_interact) {
    var me = this;

    $(task_row).on('click', function() {
      // Highlight selected task
      $('.row_detail p').removeClass('selected_ottask');
      $(this).addClass('selected_ottask');

      if (C.Session.roleID() >= 3) {
        // Take percentage loader out of the way
        $('#tasksCompletitionPercentage').remove();
        // Remove previous task form if any
        $('.task_form').remove();
        // Create task form
        me.ottask_form = new C.View.OtTaskForm({
          el: $('#ot_right'),
          model: new C.Model.OtTask,
          table: me,
          task: task
        });

        if (!$(task_row).find('.row_subdetail').length) {
          me.renderOtTaskResources(task_row, task);
        } else {
          $('.row_subdetail').remove();
        }
      }
    });
  },

  renderOtTaskResources: function(task_row, task) {
    if (C.Session.roleID() >= 3 && task.completed) {
      new C.View.OtTaskResources({
        task_row: task_row,
        task: task
      });
    }
  },

  bindEnableTaskActions: function(task_row, task, cant_interact) {
    $(task_row).on('click', function() {
      $('#ot_left .ot_rework_task').attr('disabled', false).css({ color: 'darkred' });
    });
  },

  getOtTasks: function(id, fn) {
    $.ajax({
      url: '/ottask/byOt/' + id,
      success: function(data) {
        fn(data);
      }
    });
  },

  reloadRowDetails: function() {
    $('tr.selected_row').next().css({ opacity: 0.5 });
    $('tr.selected_row').click();
    window.setTimeout(function() {
      $('tr.selected_row').click();
    }, 500);
  },

  toggleTaskState: function(checkbox, id, currentTaskState, fn) {
    var me = this;

    new C.View.OtAuditToggleTaskState({
      el: $('body'),
      checkbox: checkbox,
      currentTaskState: currentTaskState,
      performToggleTaskState: function(cleanModals) {
        $.ajax({
          type: 'POST',
          url: '/ottask/toggleTaskState/' + id,
          data: $('#toggle_task_state_ot_form').serialize(),

          success: function(response) {
            F.onSuccess(response,
              function(result) {
                cleanModals();
                me.reloadRowDetails();
              },
              function(err) {
                F.msgError('Ocurri&oacute; un error al completar la Tarea');
              }
            );

            fn(response);
          }
        });
      }
    });
  }

});
