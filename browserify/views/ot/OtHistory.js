C.View.OtHistory = Backbone.View.extend({
  // Configuration

  el: $('body'),
  initialize: function() {
    var me = this;
    
    this.ots = new C.Collection.OtHistorys(null, { view: this });
    
    this.ots.fetch({
      success: function(collection, response) {
        me.ot_table = new C.View.OtHistoryTable({ 
          el: $('#ot_left'),
          collection: collection
        });
        me.ot_infocard = new C.View.OtHistoryInfoCard({
          el: $('#ot_right'),
          model: me.model,
          collection: collection,
          ot_table: me.ot_table
        });
      }
    });
  }

});

