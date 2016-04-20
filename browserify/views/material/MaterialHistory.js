C.View.MaterialHistory = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.materials = new C.Collection.MaterialHistorys(null, { view: this });
    
    this.materials.fetch({
      success: function(collection, response) {
        me.material_table = new C.View.MaterialHistoryTable({
          el: $('#material_left'),
          collection: collection
        });
      }
    });
  }

});

