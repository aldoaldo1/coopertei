C.View.EquipmentForm = Backbone.View.extend({
  // Configuration

  name: 'equipment_form',

  title: 'Datos del Equipo',

  fields: {
    name: { label: 'Nombre', check: 'alpha' },
    intervention_id: { label: 'Motivo de intervenci&oacute;n', type: 'select' },
    client_id: { label: 'Cliente', type: 'select' }
  },

  isCRUD: true,

  relations: { interventions: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('intervention', function(interventions) {
      me.relations.interventions = interventions;
      F.getAllFromModel('client', function(clients) {
        me.relations.clients = clients;

        F.createForm(me);
      });
    });
  },

  events: {
    "click .equipment_form .BUTTON_create": "addMaterial",
    "click .equipment_form .BUTTON_save": "editMaterial",
    "click .equipment_form .BUTTON_delete": "delMaterial"
  },

  // Methods

  getTable: function() {
    return this.options.equipment_table;
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
    var values = F.JSONValuesToArray($('.equipment_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addMaterial: function() {
    var me = this;

    this.collection.create(
      $('.equipment_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('El equipo ha sido creado');
        }
      }
    );
  },

  editMaterial: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.equipment_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('El equipo ha sido actualizado');
        }
      }
    );
  },

  delMaterial: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar este Equipo?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('El equipo ha sido eliminado');
        }
      });
    });
  }

});
