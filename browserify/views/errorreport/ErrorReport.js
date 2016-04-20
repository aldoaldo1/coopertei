C.View.ErrorReport = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.errorreports = new C.Collection.ErrorReports(null, { view: this });

    this.errorreports.fetch({
      success: function(collection, response) {
        me.errorreport_table = new C.View.ErrorReportTable({
          el: $('#errorreport_left'),
          collection: collection
        });
        me.errorreport_form = new C.View.ErrorReportInfoCard({
          el: $('#errorreport_right'),
          model: me.model,
          collection: collection,
          errorreport_table: me.errorreport_table
        });
      }
    });
  }

});
