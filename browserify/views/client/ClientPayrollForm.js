C.View.ClientPayrollForm = Backbone.View.extend({
  // Configuration

  name: 'client_form',

  title: 'Datos del Cliente',

  fields: {
    name: { label: 'Nombre', check: 'alpha' },
    username: { label: 'Usuario general para el cliente', check: 'alpha' },
    tag: { label: 'TAG', check: 'alpha' },
    cuit: { label: 'C.U.I.T.', check: 'cuit' },
    iva_id: { label: 'I.V.A.', type: 'select' },
    address: { label: 'Direcci&oacute;n', check: 'alpha' },
    addressnumber: { label: 'N&uacute;mero', check: 'integer' },
    floor: { label: 'Piso', check: 'integer' },
    apartment: { label: 'Departamento', check: 'alpha' },
    city_id: { label: 'Ciudad', type: 'select' },
    email: { label: 'E-mail (contacto y notificaciones)', check: 'alpha' }
  },

  isCRUD: true,

  relations: { ivas: null, citys: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('iva', function(ivas) {
      me.relations.ivas = ivas;
      F.getAllFromModel('city', function(citys) {
        me.relations.citys = citys;

        F.createForm(me);
      });
    });
  },

  events: {
    "click .client_form .BUTTON_create": "addClient",
    "click .client_form .BUTTON_save": "editClient",
    "click .client_form .BUTTON_delete": "delClient",
  },

  // Methods

  getTable: function() {
    return this.options.client_table;
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
    var values = F.JSONValuesToArray($('.client_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addClient: function() {
    var me = this;

    this.collection.create(
      $('.client_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('El Cliente ha sido creado');
        }
      }
    );
  },

  editClient: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.client_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('El Cliente ha sido actualizado');
        }
      }
    );
  },

  delClient: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar este Cliente?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('El Cliente ha sido eliminado');
        }
      });
    });
  }

});
