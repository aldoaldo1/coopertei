C.View.Intervention = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.interventions = new C.Collection.Interventions(null, { view: this });

    this.interventions.fetch({
      success: function(collection, response) {
        me.intervention_table = new C.View.InterventionTable({
          el: $('#intervention_left'),
          collection: collection
        });
        me.intervention_form = new C.View.InterventionForm({
          el: $('#intervention_right'),
          model: me.model,
          collection: collection,
          intervention_table: me.intervention_table
        });
      }
    });
  }

});
