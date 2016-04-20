C.View.OtHistoryTable = Backbone.View.extend({
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
	"aaSorting": [[6, "asc"]] // EMC 7 cambiado por 6
  },	

  initialize: function() {
    var me = this;

    this.data = this.options.collection;

    F.createDataTable(this,
      function(data) {
        F.assignValuesToInfoCard($('.ot_infocard'), data);
      },
      function() {
        var oTable = $('.ot_table').dataTable();

        $('.ot_table tbody tr').on('click', function() {
          // Open/Close selected
          if (oTable.fnIsOpen(this)) {
            oTable.fnClose(this);
          } else {
            oTable.fnOpen(this, me.generateRowDetails(oTable, this), 'details');
          }
        });
      }
    );
  },

  events: {
    "click .ot_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
    $('#ot_right .ot_add_task').attr('disabled', false);
  },

  generateRowDetails: function(table, tr) {
    var me = this,
        data = table.fnGetData(tr),
        ot_id = data[0],
        out = '<div class="row_detail ot_id_' + ot_id + '" style="display:none;">';

    this.getOtTasks(ot_id, function(tasks) {
      var p, checkbox, task_markup;

      if (tasks.length) {
        me.appendRowDetailsHeaders(ot_id);

        _.each(tasks, function(t) {
          p = $('<p>');
          checkbox = $('<input>', { type: 'checkbox', class: 'complete_task_' + t.id });
          task_markup = '<span>' + t.name + ' - </span> ' + t.description;

          $(p).append(checkbox).append(task_markup);

          if (t.completed) {
            $(checkbox).attr('checked', true);
            $(checkbox).parent().addClass('crossed');
          }

          $('.ot_id_' + ot_id).append(p).fadeIn();

          me.bindRenderOtTaskForm(p, t, false);

          $('input:checkbox[class="complete_task_' + t.id + '"]').on('click', function() {
            return false;
          });
        });
      } else {
        $('.ot_id_' + ot_id).append('<p>Esta O/T no posee un Plan de Tareas asociado</p>').fadeIn();
      }
    });

    out += '</div>';

    return out;
  },

  getOtTasks: function(id, fn) {
    $.ajax({
      url: '/ottask/byOt/' + id,
      success: function(data) {
        fn(data);
      }
    });
  },

  appendRowDetailsHeaders: function(ot_id) {
    $('.ot_id_' + ot_id).append(
      '<p class="row_details_headers">' +
      'Nombre - Descripción' +
      '<span>Completada - Vencimiento</span>' +
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
        new C.View.OtTaskForm({
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
  }

});
