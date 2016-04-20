C.View.OtPlans = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.plans = new C.Collection.Plans(null, { view: this });
    
    this.plans.fetch({
      success: function(collection, response) {
        me.plan_table = new C.View.OtPlansTable({
          el: $('#plan_left'),
          collection: collection
        });
        me.plan_form = new C.View.OtPlansForm({
          el: $('#plan_right'),
          model: me.model,
          collection: collection,
          plan_table: me.plan_table
        });
      }
    });
  }

});

