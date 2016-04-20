C.View.MaterialStockForm = Backbone.View.extend({
  // Configuration

  name: 'material_form',

  title: 'Datos del Material',

  fields: {
    name: { label: 'Material', check: 'alpha' },
    materialcategory_id: { label: 'Categor&iacute;a', type: 'select' },
    stock: { label: 'Cantidad', check: 'numeric' },
    unit_id: { label: 'Unidad', type: 'select' },
  },

  isCRUD: true,

  relations: { materialcategorys: null, units: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('materialcategory', function(materialcategorys) {
      me.relations.materialcategorys = materialcategorys;
      F.getAllFromModel('unit', function(units) {
        me.relations.units = units;

        F.createForm(me);
      });
    });
  },

  events: {
    "click .material_form .BUTTON_create": "addMaterial",
    "click .material_form .BUTTON_save": "editMaterial",
    "click .material_form .BUTTON_delete": "delMaterial"
  },

  // Methods

  getTable: function() {
    return this.options.material_table;
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
    var values = F.JSONValuesToArray($('.material_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addMaterial: function() {
    var me = this;

    this.collection.create(
      $('.material_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('El material ha sido creado');
        }
      }
    );
  },

  editMaterial: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.material_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('El material ha sido actualizado');
        }
      }
    );
  },

  delMaterial: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar este Material?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('El material ha sido eliminado');
        }
      });
    });
  }

});
