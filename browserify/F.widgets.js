// Notifications

F.withoutId = function(field) {
  return field.substr(0, field.length - 3);
};

F.msg = function(msg) {
  noty({ text: msg, layout: 'topRight' });
};

F.msgSticky = function(msg) {
  noty({ text: msg, layout: 'topRight', timeout: false });
};

F.msgOK = function(msg) {
  noty({ text: msg, layout: 'topRight', type: 'success', closeOnSelfHover: true });
};

F.msgOKTop = function(msg) {
  noty({ text: msg, layout: 'top', type: 'success', closeOnSelfHover: true });
};

F.msgError = function(msg) {
  noty({ text: msg, layout: 'topRight', type: 'error', timeout: false });
};

F.msgErrorTop = function(msg) {
  noty({ text: msg, layout: 'top', type: 'error', modal: true, timeout: false });
};

F.msgConfirm = function(msg, onYes, onNo) {
  noty({
    text: msg,
    buttons: [
      { type: 'button green', text: 'OK', click: onYes },
      { type: 'button black', text: 'Cancelar', click: onNo || F.doNothing }
    ],
    modal: true,
    closable: false,
    closeOnSelfClick: false,
    timeout: false
  });
};

// Common

F.renderAllChosen = function() {
  $('.chzn-select').chosen({
    allow_single_deselect: true,
    no_results_text: 'Nada coincide con:'
  });
};

F.appendSelectionField = function(widget) {
  $(widget).append(
    $('<input>', { type: 'hidden', class: 'selection_id', value: 0 })
  );
};

F.appendTitle = function(widget, title) {
  $(widget).append('<h3 class="formtitle">' + title + '</h3>');
};

// Tables

F.createDataTable = function(tableView, rowOnClick, callback) {
  var theadrow = $('<tr>'),
      thead = $('<thead>').append(theadrow),
      tbody = $('<tbody>'),
      shown_columns = [],
      hidden_columns = [];

  // Headers
  _.each(tableView.headers, function(h) {
    $(theadrow).append($('<th>').html(h));
  });

  // Body
  _.each(tableView.data.models, function(model) {
    var tr = $('<tr>'),
        values = {};

    _.forEach(tableView.attrs, function(attr, index) {
      var must_hide = attr === 'id' ||
                      attr.search('_id') !== -1 ||
                      attr.search('_list') !== -1 ||
                      attr.search('password') !== -1 ||
                      _.indexOf(tableView.hidden_columns, attr) !== -1;

      if (must_hide) {
        hidden_columns.push({ "bVisible": false, "aTargets": [index] });
      } else {
        shown_columns.push(index);
      }

      $(tr).append($('<td>').html(model.attributes[attr]));
      values[attr] = model.attributes[attr];
    });

    $(tbody).append(tr);

    if (tableView.rowHandler) {
      tableView.rowHandler(tr, model.attributes);
    }

    $(tr).on('click', function() {
      var datatable = $('.' + tableView.name + '_table').dataTable();

      $('.' + tableView.name + '_form .selection_id').val(
        datatable.fnGetData(this)[0]
      );
      $('.' + tableView.name + '_infocard .selection_id').val(
        datatable.fnGetData(this)[0]
      );

      $('.' + tableView.name + '_table tr').removeClass('selected_row');
      $(this).addClass('selected_row');
      $('.BUTTON_create').hide();
      $('.BUTTON_save, .BUTTON_cancel, .BUTTON_delete').show();

      if (rowOnClick) {
        rowOnClick(values);
      }
    });
  });

  // Whole table
  $('#' + tableView.name + '_left').append(
    $('<table>', { class: tableView.name + '_table' }).append(thead).append(tbody)
  );

  // Datatable
  var options = F.concatObjects(
    {
      "aoColumnDefs": hidden_columns,
      "iDisplayLength": 10,
      "sPaginationType": "full_numbers",
      "bJQueryUI": true,
      "oLanguage": {
        "oPaginate": {
          "sFirst": "Inicio",
          "sPrevious": "Anterior",
          "sNext": "Siguiente",
          "sLast": "Final"
        },
        "sEmptyTable": "No existen registros",
        "sInfo": "_START_ - _END_ de _TOTAL_",
        "sInfoEmpty": "",
        "sInfoFiltered": "(filtrando de _MAX_ en total)",
        "sInfoThousands": ".",
        "sLengthMenu": "Mostrar _MENU_",
        "sLoadingRecords": "Cargando...",
        "sProcessing": "Procesando...",
        "sSearch": "Buscar",
        "sZeroRecords": "No existen registros"
      },
      "sDom": 'T<"clearTableTools"><"H"lfr>t<"F"ip>',
      "oTableTools": {
			  "sSwfPath": "/swf/copy_csv_xls_pdf.swf",
			  "aButtons": [
			    { "sExtends": "copy", "mColumns": shown_columns },
			    { "sExtends": "csv", "mColumns": shown_columns },
			    { "sExtends": "xls", "mColumns": shown_columns },
			    { "sExtends": "pdf", "mColumns": shown_columns },
			    //{ "sExtends": "print", "mColumns": shown_columns }
			  ]
		  }
    },
    tableView.datatableOptions ? tableView.datatableOptions : {}
  );

  tableView.datatable = $('.' + tableView.name + '_table').dataTable(options);

  if (callback) {
    callback($('.' + tableView.name + '_table'), tableView.options.open_ot_number_on_start);
  }
};

// Forms

F.resetForm = function(form) {
  $(form).each(function() {
    this.reset();
  });
};

F.cleanForm = function(form) {
  $(form).find('input:text, input:password, textarea').val(null);
  $(form).find('input:checkbox').attr('checked', false);
  $(form).find('select').val(-1);
};

F.getFormFields = function(form) {
  return $(form).find('input:text, input:password, input:checkbox, select, textarea');
};

F.assignValuesToForm = function(form, values) {
  var fields = F.getFormFields(form),
      name;

  F.cleanForm(form);

  _.each(fields, function(field, index) {
    name = $(field).attr('name');

    if ($(field).hasClass('chzn-select') && $(field).attr('multiple')) { // Is selectmultiple
      var tasks = values[name].split(',');

      _.each(tasks, function(task, index) {
        $(field).find('option[value=' + task + ']').attr('selected', true);
      });
    } else if ($(field).is(':checkbox')) {
      $(field).attr('checked', !!values[name]);
    } else {
      $(field).val(values[name]);
    }

    $(field).trigger("liszt:updated");
  });
};

F.appendFormButtons = function(formView, form) {
  function swapButtons() {
    $('.BUTTON_save, .BUTTON_cancel, .BUTTON_delete').hide();
    $('.BUTTON_create').show();
  }

  if (!formView.buttons) {
    formView.buttons = { create: true, save: true, cancel: true, delete: true };
  }

  var hiddens = formView.isCRUD ? " hidden" : "";

  if (formView.buttons.create) {
    $(form).append(
      $('<input>', { type: "button", class: "BUTTON_create", value: "Crear" })
    );
  }
  if (formView.buttons.save) {
    $(form).append(
      $('<input>', { type: "button", class: "BUTTON_save" + hiddens, value: "Guardar" })
    );
  }
  if (formView.buttons.cancel) {
    $(form).append(
      $('<input>', { type: "reset", class: "BUTTON_cancel" + hiddens, value: "Cancelar" })
        .on('click', function() {
          if (formView.isCRUD) {
            swapButtons();
          }
          $('.' + formView.name + '_table tr').removeClass('selected_row');
        })
    );
  }
  if (formView.buttons.delete) {
    $(form).append(
      $('<input>', { type: "button", class: "BUTTON_delete" + hiddens, value: "Eliminar" })
    );
  }
  if (formView.buttons.query) {
    $(form).append(
      $('<input>', { type: "button", class: "BUTTON_query" + hiddens, value: "Buscar" })
    );
  }
};

F.createForm = function(formView, appendTo, callback) {
  var attrs = formView.model.attributes,
      form = $('<form>', { class: formView.name }),
      fields = $('<div>');

  F.cleanForm(form);
  F.appendTitle(form, formView.title);
  F.appendSelectionField(form);

  // Fields
  _.each(formView.fields, function(f, field) {
    var label = null, is_select, fieldvalue = '', fieldattrs = ' ', fieldobj, p, placeholder = null;

    if (f.placeholder !== undefined) {
      placeholder = f.placeholder;
    } else if (f.label !== undefined) {
      placeholder = f.label;
    } else if (f.label === undefined) {
      placeholder = f;
    }

    is_select = f.type == 'select' || f.type == 'selectmultiple' || f.type == 'select_yn';

    if (f.force_label || f.type == 'select_yn') {
      label = '<label ';
      if (f.type === 'checkbox') {
        label += 'class="for_checkbox" ';
      }
      label += 'for="' + field + '">' + f.label + '</label>';
    }

    // If field has attributes, add them
    if (f.attrs !== undefined) {
      _.each(f.attrs, function(attr_value, attr_name) {
        fieldattrs += attr_name + '="' + attr_value + '" ';
      });
    }
    // Add placeholder to attributes string
    fieldattrs += 'placeholder="' + placeholder + '" ';

    // Get field value from the model
    if (attrs[field] && attrs[field] !== null) {
      fieldvalue = attrs[field];
    }

    // Override if value present in fields specification
    if (f.value !== undefined) {
      fieldvalue = f.value;
    }

    switch (f.type) {
      case 'hidden':
        fieldobj = $('<input type="hidden" name="' + field + '" value="' + fieldvalue + '"' + fieldattrs + '/>');
        break;
      case 'select':
        fieldobj = $(
          '<select data-placeholder="Seleccione ' + placeholder + '..." name="' + field + '"' + fieldattrs +
          ' class="chzn-select" style="display:none; position:relative; width:89%;">'
        );

        $(fieldobj).append('<option value></option>');
        _.each(formView.relations[F.withoutId(field) + 's'], function(record) {
          $(fieldobj).append('<option value="' + record.id + '">' + record.name + '</option>');
        });
        break;
      case 'selectmultiple':
        fieldobj = $(
          '<select data-placeholder="Seleccione ' + placeholder + '..."' +
          ' multiple name="' + field + '"' + fieldattrs +
          ' class="chzn-select" style="display:none; position:relative; width:91%;">'
        );

        $(fieldobj).append('<option value></option>');
        _.each(formView.relations[F.withoutId(field) + 's'], function(record) {
          $(fieldobj).append('<option value="' + record.id + '">' + record.name + '</option>');
        });
        break;
      case 'select_yn':
        fieldobj = $(
          '<select data-placeholder="&iquest;' + placeholder + '?..." name="' + field + '"' + fieldattrs +
          ' class="chzn-select" style="display:none; position:relative; width:89%;">'
        );

        var y_selected, n_selected;
        if (f.default_value == 'y') {
          y_selected = ' selected="selected"';
          n_selected = null;
        } else {
          y_selected = null;
          n_selected = ' selected="selected"';
        }

        $(fieldobj).append('<option value></option>');
        $(fieldobj).append(
          '<option value="1"' + y_selected + '>S&iacute;</option>' +
          '<option value="0"' + n_selected + '>No</option>'
        );
        break;
      case 'textarea':
        fieldobj = $('<textarea name="' + field + '"' + fieldattrs + '>' + fieldvalue + '</textarea>');
        break;
      case 'password':
        fieldobj = $('<input type="password" name="' + field + '" value="' + fieldvalue + '"' + fieldattrs + '/>');
        break;
      case 'datetimepicker':
        fieldobj = $('<input type="text" name="' + field + '" value="' + fieldvalue + '"' + fieldattrs + '/>');
        $(fieldobj).datetimepicker(f.options || {});
        break;
      case 'datepicker':
        fieldobj = $('<input type="text" name="' + field + '" value="' + fieldvalue + '"' + fieldattrs + '/>');
        $(fieldobj).datepicker(f.options || {});
        break;
      case 'timepicker':
        fieldobj = $('<input type="text" name="' + field + '" value="' + fieldvalue + '"' + fieldattrs + '/>');
        $(fieldobj).timepicker(f.options || {});
        break;
      case 'checkbox':
        fieldobj = $('<input type="checkbox" name="' + field + '" value="' + fieldvalue + '"' + fieldattrs + '/>');
        break;
      default: // 'text'
        fieldobj = $('<input type="text" name="' + field + '" value="' + fieldvalue + '"' + fieldattrs + '/>');
        break;
    }

    p = $('<p>', { class: formView.name + '_' + field });
    $(p).append(label).append(fieldobj);
    $(fields).append(p);

    if (f.required && f.required === true) {
      $(field).attr('required', true);
    }

    if (f.check !== undefined) {
      var type = null, pattern = null;

      switch (f.check) {
        case 'alpha':
          pattern = '[a-zA-Z]+';
          break;
        case 'numeric':
          pattern = '\-?\d+(\.\d{0,})?';
          break;
        case 'integer':
          pattern = '[0-9]+';
          break;
        case 'date':
          type = 'date';
          break;
        case 'email':
          type = 'email';
          break;
        case 'url':
          type = 'url';
          break;
        case 'cuit':
          pattern = '[0-9]{2}-[0-9]{8}-[0-9]{1}';
          break;
        default:
          break;
      }

      if (type !== null) {
        $(field).attr('type', type);
      }
      if (pattern !== null) {
        $(field).attr('pattern', pattern);
      }
    } else if (f.type === 'select') {
      // TODO: Mark form for denial of submission
    }
    /*
    $(field).on('blur', function(e) {
      e.target.checkValidity();
    }).on('invalid', function(e) {
      $(form).attr('invalid', true);
      $(e.target).css({ backgroundColor: '#bb5d5d' });
    }).on('valid', function(e) {
      $(form).attr('invalid', false);
      $(e.target).css({ backgroundColor: '#fff' });
    });
    */
    if (f.callback) {
      f.callback(fields);
    }
  });
  $(form).append(fields);

  // Buttons
  F.appendFormButtons(formView, form);

  // Whole form
  if (appendTo) {
    $(appendTo).append(form);
  } else {
    $(formView.el).append(form);
  }

  F.renderAllChosen();

  if (callback) {
    callback(form);
  }
};

// Infocards

F.appendInfocardTitle = function(infocard) {
  $(infocard).append('<h3 class="underlined">' + title + '</h3>');
};

F.getInfoCardFields = function(infocard) {
  return $(infocard).find('span');
};

F.cleanInfocard = function(infocard) {
  F.getInfoCardFields(infocard).text('');
};

F.assignValuesToInfoCard = function(infocard, values, callback) {
  var fields = F.getInfoCardFields(infocard);

  _.each(fields, function(field, index) {
    $(field).text(values[$(field).attr('name')]);
  });

  if (callback) {
    callback(infocard, values);
  }
};

F.createInfoCard = function(infoCardView, appendTo, callback) {
  var attrs = infoCardView.model.attributes,
      infocard = $('<div>', { class: 'infocard ' + infoCardView.name });

  F.cleanInfocard(infocard);
  F.appendTitle(infocard, infoCardView.title);
  F.appendSelectionField(infocard);

  // Fields
  _.each(infoCardView.fieldnames, function(attr, key) {
    if (attrs[key] !== undefined) {
      $(infocard).append(
        '<p>' +
        '<label for="' + key + '">' + infoCardView.fieldnames[key] + '</label>: ' +
        '<span name="' + key + '">' + (attrs[key] !== null ? attrs[key] : '') + '</span>' +
        '</p>'
      );
    }
  });

  // Whole info card
  if (appendTo) {
    $(appendTo).append(infocard);
  } else {
    $('#' + infoCardView.name + '_right').append(infocard);
  }

  if (callback) {
    callback(infocard);
  }
};

// Datafeeds

F.createDataFeed = function(feedView, title, callback) {
  $('#' + feedView.name + '_right').append(
    $('<div class="feedtitle">' + title + '</div>')
  ).append(
    $('<div>', { class: 'feed datafeed_' + feedView.name })
  );

  var feedTheData = function() {
    feedView.data.fetch({
      success: function(collection, response) {
        $('.datafeed_' + feedView.name).empty();

        if (!response.length) {
          $('.datafeed_' + feedView.name).addClass('no_news_to_report');
          $('.datafeed_' + feedView.name).append('Nada que reportar...');
        } else {
          $('.datafeed_' + feedView.name).removeClass('no_news_to_report');
          _.each(response, function(news, index) {
            $('.datafeed_' + feedView.name).append(
              '<h3>' + news.name + '</h3>' +
              '<p>' + news.description + '</h3>'
            );
          });
        }
      }
    });
  };

  feedTheData();
  window.setInterval(function() {
    feedTheData();
  }, 5000);

  if (callback) {
    callback(feedView);
  }
};
