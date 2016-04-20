C.View.ClientAuthorizationHistory = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.authorizations = new C.Collection.AuthorizationHistorys(null, { view: this });
    
    this.authorizations.fetch({
      success: function(collection, response) {
        me.client_table = new C.View.ClientAuthorizationHistoryTable({
          el: $('#client_left'),
          collection: collection
        });
        me.client_form = new C.View.ClientAuthorizationHistoryInfoCard({
          el: $('#client_right'),
          model: me.model,
          collection: collection,
          client_table: me.client_table
        });
      }
    });
  }

});

