C.View.MaterialCreateOrder = Backbone.View.extend({
  // Configuration

  name: 'material_create_order_window',

  initialize: function() {
    this.getMaterialCategories();
    this.getMaterialUnits();
    this.render();
  },

  // Methods

  getMaterialCategories: function() {
    var me = this;

    $.ajax({
      url: '/materialcategory',
      success: function(categories) {
        me.material_categories = categories;
      }
    });
  },

  getMaterialUnits: function() {
    var me = this;

    $.ajax({
      url: '/unit',
      success: function(units) {
        me.material_units = units;
      }
    });
  },

  render: function() {
    var me = this;

    if (!$('#material_order_window').length) {
      this.template();
    }

    $.blockUI({
      message: $('#material_order_window'),
      css: {
        top: '10%',
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
      '<div id="material_order_window" style="display:none;">' +
        '<h1 class="bold" style="font-size:20px;">Complete la nueva Orden:</h1>' +
        '<br /><br />' +
        '<label for="ot_number">O/T N&ordm; </label>' +
        '<input type="text" name="ot_number" style="width:100px;" />' +
        '<input type="button" value="Seleccionar Tarea >" class="BUTTON_get_tasks" />' +
        '<br /><br />' +
        '<label for="provider">Proveedor </label>' +
        '<select name="provider">' +
          '<option value="Cliente">Cliente</option>' +
          '<option value="Coopertei">Coopertei</option>' +
        '</select>' +
        '<br /><br />' +
        '<form id="order_elements"></form>' +
        '<br /><br />' +
        '<a class="BUTTON_cancel lefty">Cancelar</a>' +
        '<input type="button" class="BUTTON_create righty button" value="Crear Orden" />' +
      '</div>'
    );
    $('.button').button();

    this.appendOrderMaterialsWidget();
    this.bindButtons();
  },

  appendOrderMaterialsWidget: function() {
    var me = this,
        q = 1,
        add_el_button = $('<input>', { type: 'button', value: 'Agregar Material' }),
        del_el_button, material_container;

    $('#order_elements').append(add_el_button);

    $(add_el_button).on('click', function() {
      del_el_button = $(
        '<input type="button" name="del_el_' + q +
        '" value="X" style="position:relative; top:1px; height:25px;' +
        ' margin-left:5px; padding:2px; font-weigth:bold; color:red;">'
      );

      material_container = $('<div class="material_container_' + q + '"></div>');
      $(this).before(material_container);

      $(material_container).append('Categor&iacute;a ');
      $(material_container).append(me.materialCategoriesList(q));
      $(material_container).append(
        ' <input type="text" name="material_element_' + q +
        '" placeholder="Material" style="display:inline; width:75px; height:19px;">'
      );
      $(material_container).append(
        ' <input type="text" name="material_quantity_' + q +
        '" placeholder="Cantidad" style="display:inline; width:75px; height:19px;"> '
      );
      $(material_container).append(me.materialUnitsList(q));
      $(material_container).append(del_el_button);
      $(material_container).append('<br />');

      $(del_el_button).on('click', function() {
        $(this).parent().remove();
      });

      q += 1;
      del_el_button = null;
      material_container = null;
    });
  },

  materialCategoriesList: function(q) {
    var sel = $('<select>', { name: 'material_category_' + q,
                              style: 'display:inline; width:auto; height:25px; margin-right:10px;' });
    _.each(this.material_categories, function(mc) {
      $(sel).append('<option value="' + mc.id + '">' + mc.name + '</option>');
    });

    return sel;
  },

  materialUnitsList: function(q) {
    var sel = $('<select>', { name: 'material_unit_' + q,
                              style: 'display:inline; width:auto; height:25px;' });
    _.each(this.material_units, function(mu) {
      $(sel).append('<option value="' + mu.id + '">' + mu.name + '</option>');
    });

    return sel;
  },

  bindButtons: function() {
    var me = this;

    $('#material_order_window .BUTTON_get_tasks').on('click', function() {
      $.ajax({
        url: '/ottask/byOtNumber/' + $('#material_order_window input:text[name=ot_number]').val(),
        success: function(tasks) {
          $('.select_ottask_msg').remove();

          if (tasks && tasks.length) {
            var sel = $('<select name="ottask_id"></select>');

            _.each(tasks, function(t) {
              $(sel).append('<option value="' + t.id + '">' + t.name + '</option>');
            });
            $('#material_order_window .BUTTON_get_tasks').after(sel);
          } else if (tasks && !tasks.length) {
            $('#material_order_window .BUTTON_get_tasks').after(
              ' <span class="select_ottask_msg">La O/T no posee Tareas.</span>'
            );
          } else {
            me.cleanModals();
            F.msgError('Ocurri&oacute; un error al buscar las Tareas');
          }
        }
      });
    });

    $('#material_order_window .BUTTON_cancel').on('click', function() {
      me.cancelCreateOrder();
    });
    $('#material_order_window .BUTTON_create').on('click', function() {
      me.performCreateOrder();
    });
  },

  cleanModals: function(callback) {
    $.unblockUI();
    window.setTimeout(function() {
      $('#material_order_window').remove();

      if (callback) {
        callback();
      }
    }, 1000);
  },

  performCreateOrder: function() {
    this.options.createNewOrder({
      ot_number: $('#material_order_window input:text[name=ot_number]').val(),
      ottask_id: $('#material_order_window select[name=ottask_id]').val(),
      provider: $('#material_order_window select[name=provider]').val(),
      materials: $('#order_elements').serializeObject()
    }, this.cleanModals);
  },

  cancelCreateOrder: function() {
    this.cleanModals();
  }

});
