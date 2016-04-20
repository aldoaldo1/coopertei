C.View.MaterialCategory = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.materialcategorys = new C.Collection.MaterialCategorys(null, { view: this });
    
    this.materialcategorys.fetch({
      success: function(collection, response) {
        me.materialcategory_table = new C.View.MaterialCategoryTable({
          el: $('#materialcategory_left'),
          collection: collection
        });
        me.materialcategory_form = new C.View.MaterialCategoryForm({
          el: $('#materialcategory_right'),
          model: me.model,
          collection: collection,
          materialcategory_table: me.materialcategory_table
        });
      }
    });
  }

});

