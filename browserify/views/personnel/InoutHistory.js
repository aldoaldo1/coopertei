C.View.InoutHistory = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.inouts = new C.Collection.InoutHistorys(null, { view: this });
    
    this.inouts.fetch({
      success: function(collection, response) {
        me.inout_table = new C.View.InoutHistoryTable({
          el: $('#inout_left'),
          collection: collection
        });
      }
    });
  }

});

