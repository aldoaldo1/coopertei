C.View.AlertTasks = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.alert = new C.Collection.AlertTasks(null, { view: this });

    this.alert.fetch({
      success: function(collection, response) {
        me.alerttasks_table = new C.View.AlertTasksTable({
          el: $('#alert_left'),
          collection: collection
        });
        me.alerttasks_infocard = new C.View.AlertTasksInfoCard({
          el: $('#alert_right'),
          model: me.model,
          collection: collection,
          alerttasks_table: me.alerttasks_table
        });
      }
    });
  }

});
