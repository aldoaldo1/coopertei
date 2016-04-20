C.View.MaterialHistoryTable = Backbone.View.extend({
  // Configuration
  
  name: 'material',
  
  headers: ['ID', 'Material', 'Cantidad', 'ID Unidad', 'Unidad',
            'ID Categor&iacute;a', 'Categor&iacute;a'],
  
  attrs: ['id', 'name', 'stock', 'unit_id', 'unit',
          'materialcategory_id', 'materialcategory'],
  
  data: null,
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.material_form'), data);
    });
  },
  
  events: {
    "click .material_table tr": "selectRow"
  },
  
  // Methods
  
  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});

