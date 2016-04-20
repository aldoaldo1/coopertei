C.View.Inout = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.inouts = new C.Collection.Inouts(null, { view: this });
    
    this.inouts.fetch({
      success: function(collection, response) {
        me.inout_table = new C.View.InoutTable({
          el: $('#inout_left'),
          collection: collection
        });
        me.inout_form = new C.View.InoutForm({
          el: $('#inout_right'),
          model: me.model,
          collection: collection,
          inout_table: me.inout_table
        });
      }
    });
  }

});

