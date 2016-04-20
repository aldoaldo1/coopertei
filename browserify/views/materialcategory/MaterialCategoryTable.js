C.View.MaterialCategoryTable = Backbone.View.extend({
  // Configuration
  
  name: 'materialcategory',
  
  headers: ['ID', 'Categor&iacute;a'],
  
  attrs: ['id', 'name'],
  
  data: null,
  
  initialize: function() {
    this.data = this.options.collection;
    
    F.createDataTable(this, function(data) {
      F.assignValuesToForm($('.materialcategory_form'), data);
    });
  },
  
  events: {
    "click .materialcategory_table tr": "selectRow"
  },
  
  // Methods
  
  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});

