C.View.MaterialOrder = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.authorizations = new C.Collection.MaterialOrders(null, { view: this });

    this.authorizations.fetch({
      success: function(collection, response) {
        me.material_table = new C.View.MaterialOrderTable({
          el: $('#material_left'),
          collection: collection
        });
        me.material_infocard = new C.View.MaterialOrderInfoCard({
          el: $('#material_right'),
          model: me.model,
          collection: collection,
          material_table: me.material_table
        });
        me.material_options = new C.View.MaterialOrderOptions({
          el: $('#material_left .fg-toolbar')[0],
          material_table: me.material_table,
          material_infocard: me.material_infocard
        });
      }
    });
  }

});
