C.View.InoutForm = Backbone.View.extend({
  // Configuration

  name: 'inout_form',

  title: 'Datos de la Autorizaci&oacute;n',

  fields: {
    employee_id: { label: 'Empleado', type: 'select' },
    authorized: { label: 'Fecha y hora a autorizar', type: 'datetimepicker',
                  options: { timeFormat: ' - hh:mm' }
                },
    permitted: { label: 'Permitido', type: 'select_yn', default_value: 'n' }
  },

  isCRUD: true,

  relations: { employees: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('employee', function(employees) {
      me.relations.employees = employees;

      F.createForm(me, $('#inout_right'), function() {
        C.Session.doIfVigilance(function() {
          $('.inout_form select[name=permitted], .inout_form label[for=permitted]').remove();
          $($('.inout_form .chzn-container')[1]).remove();
        });
      });
    });
  },

  events: {
    "click .inout_form .BUTTON_create": "addInout",
    "click .inout_form .BUTTON_save": "editInout",
    "click .inout_form .BUTTON_delete": "delInout"
  },

  // Methods

  getTable: function() {
    return this.options.inout_table;
  },

  getDataTable: function() {
    return this.getTable().datatable;
  },

  getSelectionID: function() {
    return parseInt($('.selection_id').val());
  },

  getSelectionRow: function() {
    return this.getTable().selected_row;
  },

  addTableRow: function(new_id) {
    return;
    var values = F.JSONValuesToArray($('.inout_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addInout: function() {
    var me = this;

    this.collection.create(
      $('.inout_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('La Autorizaci&oacute;n ha sido creada');
        }
      }
    );
  },

  editInout: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.inout_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('La Autorizaci&oacute;n ha sido actualizada');
        }
      }
    );
  },

  delInout: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar a esta Autorizaci&oacute;n?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('La Autorizaci&oacute;n ha sido eliminada');
        }
      });
    });
  }

});
