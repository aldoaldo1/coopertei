C.View.Equipment = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.equipments = new C.Collection.Equipments(null, { view: this });
    
    this.equipments.fetch({
      success: function(collection, response) {
        me.equipment_table = new C.View.EquipmentTable({
          el: $('#equipment_left'),
          collection: collection
        });
        me.equipment_form = new C.View.EquipmentForm({
          el: $('#equipment_right'),
          model: me.model,
          collection: collection,
          equipment_table: me.equipment_table
        });
      }
    });
  }

});

