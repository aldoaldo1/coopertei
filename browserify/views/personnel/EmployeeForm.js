C.View.EmployeeForm = Backbone.View.extend({
  // Configuration

  name: 'employee_form',

  title: 'Datos del Empleado',

  fields: {
    payroll_number: { label: 'Legajo', check: 'integer' },
    person_id: { label: 'Apellido y Nombre', type: 'select' },
    person: { type: 'hidden' },
    area_id: { label: '&Aacute;rea', type: 'select' },
    area: { type: 'hidden' },
    schedule_ini_id: { label: 'Horario de entrada', type: 'select' },
    schedule_end_id: { label: 'Horario de salida', type: 'select' },
    intern: { label: 'Interno', check: 'integer' }
  },

  isCRUD: true,

  relations: { persons: null, areas: null,
               schedule_inis: null, schedule_ends: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('person', function(persons) {
      me.relations.persons = persons;
      F.getAllFromModel('area', function(areas) {
        me.relations.areas = areas;
        F.getAllFromModel('schedule', function(schedules) {
          me.relations.schedule_inis = schedules;
          me.relations.schedule_ends = schedules;

          F.createForm(me);
        });
      });
    });
  },

  events: {
    "click .employee_form .BUTTON_create": "addEmployee",
    "click .employee_form .BUTTON_save": "editEmployee",
    "click .employee_form .BUTTON_delete": "delEmployee"
  },

  // Methods

  getTable: function() {
    return this.options.employee_table;
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
    var values = F.JSONValuesToArray($('.employee_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addEmployee: function() {
    var me = this;

    this.collection.create(
      $('.employee_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('El empleado ha sido creado/a');
        }
      }
    );
  },

  editEmployee: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.employee_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('El empleado ha sido actualizado/a');
        }
      }
    );
  },

  delEmployee: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar a este Empleado?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('El empleado ha sido eliminado/a');
        }
      });
    });
  }

});
