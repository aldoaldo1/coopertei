C.View.PersonForm = Backbone.View.extend({
  // Configuration

  name: 'person_form',

  title: 'Datos de la Persona',

  fields: {
    firstname: { label: 'Nombre', required: true, check: 'alpha' },
    lastname: { label: 'Apellido', required: true, check: 'alpha' },
    phone: { label: 'Tel&eacute;fono' },
    email: { label: 'E-mail', placeholder: 'E-mail (ej.: josenadie@coopertei.com.ar)', required: true, check: 'email' }
  },

  isCRUD: true,

  initialize: function() {
    F.createForm(this);
  },

  events: {
    "click .person_form .BUTTON_create": "addPerson",
    "click .person_form .BUTTON_save": "editPerson",
    "click .person_form .BUTTON_delete": "delPerson"
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
    var values = F.JSONValuesToArray($('.person_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addPerson: function() {
    var me = this;

    this.collection.create(
      $('.person_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('La persona ha sido creada');
        }
      }
    );
  },

  editPerson: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.person_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('La persona ha sido actualizada');
        }
      }
    );
  },

  delPerson: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar a esta Persona?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('La persona ha sido eliminada');
        }
      });
    });
  }

});
