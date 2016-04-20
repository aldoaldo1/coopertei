C.View.InterventionForm = Backbone.View.extend({
  // Configuration

  name: 'intervention_form',

  title: 'Datos del Motivo de Intervenci&oacute;n',

  fields: {
    name: { label: 'Nombre', check: 'alpha' },
    description: { label: 'Descripci&oacute;n', check: 'alpha' }
  },

  isCRUD: true,

  initialize: function() {
    F.createForm(this);
  },

  events: {
    "click .intervention_form .BUTTON_create": "addIntervention",
    "click .intervention_form .BUTTON_save": "editIntervention",
    "click .intervention_form .BUTTON_delete": "delIntervention"
  },

  // Methods

  getTable: function() {
    return this.options.intervention_table;
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
    var values = F.JSONValuesToArray($('.intervention_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addIntervention: function() {
    var me = this;

    this.collection.create(
      $('.intervention_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('La intervenci&oacute;n ha sido creada');
        }
      }
    );
  },

  editIntervention: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.intervention_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('La intervenci&oacute;n ha sido actualizada');
        }
      }
    );
  },

  delIntervention: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar este Motivo de Intervenci&oacute;n?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('La intervenci&oacute;n ha sido eliminada');
        }
      });
    });
  }

});
