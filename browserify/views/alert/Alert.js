C.View.Alert = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.alert = new C.Collection.Alerts(null, { view: this });

    this.alert.fetch({
      success: function(collection, response) {
        me.alert_table = new C.View.AlertTable({
          el: $('#alert_left'),
          collection: collection
        });
        me.alert_infocard = new C.View.AlertInfoCard({
          el: $('#alert_right'),
          model: me.model,
          collection: collection,
          alert_table: me.alert_table
        });
      }
    });
  }

});
