C.View.MaterialStock = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.materials = new C.Collection.Materials(null, { view: this });

    this.materials.fetch({
      success: function(collection, response) {
        me.material_table = new C.View.MaterialStockTable({
          el: $('#material_left'),
          collection: collection
        });
        me.material_form = new C.View.MaterialStockForm({
          el: $('#material_right'),
          model: me.model,
          collection: collection,
          material_table: me.material_table
        });
      }
    });
  }

});
