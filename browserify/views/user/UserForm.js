C.View.UserForm = Backbone.View.extend({
  // Configuration

  name: 'user_form',

  title: 'Datos del Usuario',

  fields: {
    username: { label: 'Usuario', check: 'alpha' },
    employee_id: { label: 'Empleado', type: 'select' },
    employee: { type: 'hidden' },
    role_id: { label: 'Rol', type: 'select' },
    role: { type: 'hidden' },
    area_id: { label: 'Area', type: 'select' },
    area: { type: 'hidden' }
  },

  isCRUD: true,

  relations: { employees: null, roles: null, areas: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('employee', function(employees) {
      me.relations.employees = employees;
      F.getAllFromModel('role', function(roles) {
        delete roles[4];
        me.relations.roles = roles;
        F.getAllFromModel('area', function(areas) {
          me.relations.areas = areas;

          F.createForm(me);
        });
      });
    });
  },

  events: {
    "click .user_form .BUTTON_create": "addUser",
    "click .user_form .BUTTON_save": "editUser",
    "click .user_form .BUTTON_delete": "delUser"
  },

  // Methods

  getTable: function() {
    return this.options.user_table;
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
    var values = F.JSONValuesToArray($('.user_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addUser: function() {
    var me = this;

    this.collection.create(
      $('.user_form').serializeObject(),
      {
        success: function(model, response) {
          if (response.result === true) {
            var x = model.attributes;

            me.addTableRow(response.user.id);
            F.msgOK('El usuario ha sido creado/a');
          } else {
            F.msgError(response.error);
          }
        }
      }
    );
  },

  editUser: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.user_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('El usuario ha sido actualizado/a');
        }
      }
    );
  },

  delUser: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar a este Usuario?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('El usuario ha sido eliminado/a');
        }
      });
    });
  }

});
