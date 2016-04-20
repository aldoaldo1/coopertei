C.View.ClientAuthorizationTable = Backbone.View.extend({
  // Configuration

  name: 'client',

  headers: ['ID', 'O/T ID', 'O/T', 'ID Cliente', 'Cliente',
            'Env&iacute;o de Informe de Requerimientos', 'ID Estado', 'Estado'],

  attrs: ['id', 'ot_id', 'ot_number', 'client_id', 'client',
          'req_info_sent_date', 'otstate_id', 'otstate'],

  data: null,

  datatableOptions: {
    "aoColumns": [null, null, null, null, null,
                  { "sType": "es_date" }, null, null],
    "aaSorting": [[6, "asc"]]
  },

  rowHandler: function(row, model) {
    var me = this,
        cell = $(row).find('td')[7];

    switch (model.otstate_id) {
      case 1: // Inaugurated
        $(cell).parent().css({ fontWeight: 'bold', color: 'green' });
        break;
      case 2: // On hold
        $(cell).parent().css({ fontWeight: 'bold', color: '#e9823f' });
        break;
      case 3: // Exceded waiting time
        $(cell).parent().css({ fontWeight: 'bold', color: 'red' });
        break;
      case 4: // Notified
        $(cell).parent().css({ fontWeight: 'bold', color: 'black' });
        break;
      default:
        break;
    }

    if (model.otstate_id === 3) { // Exceded time
      var resend_email_link = $('<span>', { class: 'resend_email_link' });

      $(resend_email_link).text('Reenviar e-mail').on('click', function() {
        F.msgConfirm('\u00BFRealmente desea volver a notificar al Cliente?', function() {
          var ot_number = $($(row).find('td')[0]).text();

          me.notifyClient(ot_number, function(response) {
            $(resend_email_link).html('Notificado. &iquest;Reenviar nuevamente?');
            F.msgOK('Se ha vuelto a notificar al Cliente sobre la autorizaci&oacute;n pendiente.');
          });
        });
      });
      $(cell).append(resend_email_link);
    }
  },

  initialize: function() {
    var me = this;

    this.data = this.options.collection;

    F.createDataTable(this, function(data) {
      F.assignValuesToInfoCard($('.client_authorization_infocard'), data, function(infocard, authorization) {
        $(infocard).children('br, a, input:button').remove();

        $(infocard).append(
          '<br />' +
          '<input type="button" class="BUTTON_report" value="Informe de Requerimientos" />' +
          '<a class="righty" style="padding:0.75em;" href="/#/ots/audit/' + authorization.ot_number + '">Auditar O/T</a>'
        );

        $('.client_authorization_infocard .BUTTON_report').on('click', function() {
          me.showRequirementsReport(authorization);
          $('.BUTTON_report').attr('disabled', true);
        });
      });
    });
  },

  events: {
    "click .client_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);

    var me = this,
        ot_number = $($(this.selected_row).find('td')[0]).text();

    if (ot_number.length) {
      $.ajax({
        url: '/authorization/setSessionOtId/' + ot_number,
        success: function(response) {
          // Report's tasks and photos, if any, come back
          if (response.result === true) {
            me.report_tasks = response.report_tasks;
            me.report_photos = response.report_photos;
          }
          // Set ot_number in infocard
          $('.client_authorization_infocard .selection_id').val(ot_number);
          // Enable button
          $('#client_left .ot_authorize').attr('disabled', false);
        }
      });
    }
  },

  cleanModals: function(callback) {
    $.unblockUI();
    window.setTimeout(function() {
      $('#requirements_report_window').remove();
      $('.BUTTON_report').attr('disabled', false);

      if (callback) {
        callback();
      }
    }, 1000);
  },

  showRequirementsReport: function(authorization) {
    var me = this;

    if (!$('#requirements_report_window').length) {
      // Generate template and render
      this.requirementsReportTemplate(authorization, function() {
        $(document).on('keyup', function(e) {
          if (e.which == 27) { // Escape
            me.cancelShowRequirementsReport();
          }
        });
        $('#requirements_report_window .BUTTON_cancel').on('click', function() {
          me.cancelShowRequirementsReport();
        });
        $('#requirements_report_window .BUTTON_save').on('click', function() {
          var this_button = this;

          $(this_button).attr('disabled', true);
          me.saveRequirementsReport(function() {
            $(this_button).attr('disabled', false);
            F.msgConfirm('Observaciones a&ntilde;adidas al Informe');
          });
        });
        $('#requirements_report_window .BUTTON_send').on('click', function() {
          var this_button = this;

          $(this_button).attr('disabled', true);
          me.sendRequirementsReport(authorization.ot_id, function() {
            // TODO: e-mail sent callback -> unblock and whatever necessary
            me.cleanModals(function() {
              F.msgOK('El Informe de Requerimientos fue enviado al cliente');
            });
            $(this_button).attr('disabled', false);
          });
        });

        $.blockUI({
          message: $('#requirements_report_window'),
          css: {
            top: '7.5%',
            left: '24%',
            width: '50%',
            border: 'none',
            padding: '1%',
            cursor: 'default'
          }
        });
      });
    }
  },

  requirementsReportTemplate: function(authorization, callback) {
    var me = this;

    this.getOtTasks(authorization.ot_id, function(tasks) {
      var date = moment().format('DD/MM/YYYY'),
          tasks_markup = me.getTasksMarkup(tasks),
          photos_upload_markup = me.getPhotosUploadMarkup(),
          current_photos_markup = me.getCurrentPhotosMarkup(),
          buttons_markup = me.getButtonsMarkup(tasks);

      $('body').append(
        '<div id="requirements_report_window" style="display:none; max-height:500px; overflow:auto;">' +
          '<h3 class="lefty">INFORME DE REQUERIMIENTOS DE TAREAS</h3>' +
          '<h3 class="righty">' + date + '</h3>' +
          '<br /><br />' +
          '<h3 class="lefty">O/T N&ordm;: ' + authorization.ot_number + '</h3>' +
          '<br /><br />' +
          '<input type="button" class="button BUTTON_req_info_tasks" value="Tareas" />' +
          '<input type="button" class="button BUTTON_req_info_photos_upload" value="A&ntilde;adir Fotograf&iacute;as" />' +
          '<input type="button" class="button BUTTON_req_info_current_photos" value="Fotograf&iacute;as Actuales" />' +
          '<br /><br /><br />' +
          '<form name="requirements_report_form" class="req_info_tasks clean_form">' +
            '<table style="width:100%;">' + tasks_markup + '</table>' +
          '</form>' +
          '<div class="req_info_photos_upload" style="display:none;">' + photos_upload_markup + '</div>' +
          '<div class="req_info_current_photos" style="display:none;">' + current_photos_markup + '</div>' +
          '<br /><br />' +
          buttons_markup +
        '</div>'
      );

      me.bindInputFiles();
      me.bindButtons();

      if (callback) {
        callback();
      }
    });
  },

  getOtTasks: function(ot_id, fn) {
    $.ajax({
      url: '/ottask/byOt/' + ot_id,
      success: function(response) {
        fn(response);
      }
    });
  },

  getTasksMarkup: function(tasks) {
    var me = this,
        x = '', current_rt = { observation: '' };

    if (tasks.length) {
      _.each(tasks, function(t) {

        // Search this task's observation
        if (me.report_tasks) {
          _.each(me.report_tasks, function(rt) {
            if (rt.ottask_id == t.id) {
              current_rt = rt;
            }
          });
        }

        x += '<tr>';
        x += '<td class="req_report_task">' + t.name + '</td>';
        x += '<td style="border:1px solid #eee;">' +
                        '<textarea class="righty" style="width:100%; height:40px;" name="task_observation_' + t.id + '">' +
                        current_rt.observation +
                        '</textarea></td>';
        x += '</tr>';
      });
    } else {
      x += 'Esta O/T todav&iacute;a no posee tareas &oacute; un Plan de Tareas asociado.';
      x += '<br /><br />';
      x += '<a class="assignTasksPlanLink" href="/#/ots/admin">Asignar Plan de Tareas</a>';
    }

    return x;
  },

  getPhotosUploadMarkup: function() {
    var x = '';

    for (var i = 1; i <= 5; i += 1) {
      x +=
        '<input class="photos_file_' + i + '" type="file" name="photos[]" data-url="authorization/addPhotoToReport">' +
        '<div class="photos_state_' + i + '"></div>' +
        '<br /><br />';
    }

    return x;
  },

  getCurrentPhotosMarkup: function() {
    var me = this,
        x = '';

    _.each(me.report_photos, function(rp) {
      x += '<img src="/uploads/' + rp.path + '" data-id="' + rp.id + '" style="width:200px; height:112.5px;" />' +
           '<div class="remove_photo" data-id="' + rp.id + '">Eliminar</div><br />';
    });

    return x;
  },

  getButtonsMarkup: function(tasks) {
    var x = '<input type="button" class="lefty BUTTON_cancel" value="Cerrar" />';

    if (tasks.length) {
      x += '<input type="button" class="righty BUTTON_save" value="Guardar cambios" />' +
        '<br /><br /><br />' +
        '<input type="button" class="BUTTON_send" value="ENVIAR AL CLIENTE" />';
    }

    return x;
  },

  bindInputFiles: function() {
    $('.req_info_photos_upload input:file').bind('fileuploadadd', function(e, data) {
      var q = e.target.className.charAt(e.target.className.length - 1);
      $('.photos_state_' + q).html('<img src="/images/loading.gif" />');
    });
    $('.req_info_photos_upload input:file').bind('fileuploaddone', function(e, data) {
      var q = e.target.className.charAt(e.target.className.length - 1);
      $('.photos_state_' + q).empty().html('<img src="/images/success.png" />');
    });
    $('.req_info_photos_upload input:file').bind('fileuploadfail', function(e, data) {
      var q = e.target.className.charAt(e.target.className.length - 1);
      $('.photos_state_' + q).empty().html('<img src="/images/failure.png" />');
    });

    $('.req_info_photos_upload input:file').fileupload({ dataType: 'json' });
  },

  bindButtons: function() {
    var me = this;

    $('.assignTasksPlanLink').on('click', function() {
      me.cleanModals();
    });
    $('.BUTTON_req_info_tasks').on('click', function() {
      $('.req_info_photos_upload, .req_info_current_photos').hide();
      $('.req_info_tasks').show();
    });
    $('.BUTTON_req_info_photos_upload').on('click', function() {
      $('.req_info_tasks, .req_info_current_photos').hide();
      $('.req_info_photos_upload').show();
    });
    $('.BUTTON_req_info_current_photos').on('click', function() {
      $('.req_info_tasks, .req_info_photos_upload').hide();
      $('.req_info_current_photos').show();
    });

    $('.req_info_current_photos div.remove_photo').on('click', function() {
      var me = this,
          id = $(this).attr('data-id');

      F.msgConfirm('&iquest;ELIMINAR la fotograf&iacute;a?',
        function() {
          $.ajax({
            url: '/authorization/delPhotoFromReport/' + id,
            success: function(response) {
              if (response.result === true) {
                $(me).remove();
                $('.req_info_current_photos img[data-id=' + id + ']').remove();
              }
            }
          });
        }
      );
    });
  },

  cancelShowRequirementsReport: function() {
    this.cleanModals();
  },

  saveRequirementsReport: function(fn) {
    $.ajax({
      type: 'POST',
      url: '/authorization/saveRequirementsReport',
      data: $('form[name=requirements_report_form]').serializeObject(),
      success: function(response) {
        if (response.result === true) {
          fn(response);
        }
      }
    });
  },

  sendRequirementsReport: function(ot_number, fn) {
    $.ajax({
      url: '/authorization/notify/' + ot_number,
      success: function(response) {
        fn(response);
      }
    });
  }

});
