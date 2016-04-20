C.View.MaterialCategoryForm = Backbone.View.extend({
  // Configuration

  name: 'materialcategory_form',

  title: 'Datos de la Categor&iacute;a',

  fields: {
    name: { label: 'Nombre', check: 'alpha' }
  },

  isCRUD: true,

  initialize: function() {
    F.createForm(this);
  },

  events: {
    "click .materialcategory_form .BUTTON_create": "addMaterial",
    "click .materialcategory_form .BUTTON_save": "editMaterial",
    "click .materialcategory_form .BUTTON_delete": "delMaterial"
  },

  // Methods

  getTable: function() {
    return this.options.materialcategory_table;
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
    var values = F.JSONValuesToArray($('.materialcategory_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addMaterial: function() {
    var me = this;

    this.collection.create(
      $('.materialcategory_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('La categoria ha sido creada');
        }
      }
    );
  },

  editMaterial: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.materialcategory_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('La categoria ha sido actualizada');
        }
      }
    );
  },

  delMaterial: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar esta Categor&iacute;a?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('La categoria ha sido eliminada');
        }
      });
    });
  }

});
