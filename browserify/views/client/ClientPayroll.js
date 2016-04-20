C.View.ClientPayroll = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.clients = new C.Collection.Clients(null, { view: this });
    
    this.clients.fetch({
      success: function(collection, response) {
        me.client_table = new C.View.ClientPayrollTable({
          el: $('#client_left'),
          collection: collection
        });
        me.client_form = new C.View.ClientPayrollForm({
          el: $('#client_right'),
          model: me.model,
          collection: collection,
          client_table: me.client_table
        });
      }
    });
  }

});

