C.View.ClientsOts = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.ots = new C.Collection.ClientsOts(null, { view: this });

    this.ots.fetch({
      success: function(collection, response) {
        me.ot_table = new C.View.ClientsOtsTable({
          el: $('#clients_left'),
          collection: collection
        });
      }
    });
  }

});
