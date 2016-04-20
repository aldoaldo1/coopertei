C.View.OtAuditForm = Backbone.View.extend({
  // Configuration

  name: 'ot_form',

  title: 'Datos de la &Oacute;rden de Trabajo',

  fields: {

  },

  isCRUD: true,

  relations: { clients: null, equipments: null, interventions: null },

  initialize: function() {
    var me = this;

    // Get next O/T number and show it on form field
    F.getNextOtNumber(function(data) {
      me.fields.number.value = data.n;

      F.getAllFromModel('client', function(clients) {
        me.relations.clients = clients;
        F.getAllFromModel('equipment', function(equipments) {
          me.relations.equipments = equipments;
          F.getAllFromModel('intervention', function(interventions) {
            me.relations.interventions = interventions;

            F.createForm(me);
          });
        });
      });
    });
  },

  events: {
    "click .ot_form .BUTTON_create": "addOt",
    "click .ot_form .BUTTON_save": "editOt"
  },

  // Methods

  getTable: function() {
    return this.options.person_table;
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
    var values = F.JSONValuesToArray($('.ot_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addOt: function() {
    var me = this;

    this.collection.create(
      $('.ot_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('La O/T ha sido creada');
        }
      }
    );
  },

  editOt: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.ot_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('La O/T ha sido actualizada');
        }
      }
    );
  }

});
