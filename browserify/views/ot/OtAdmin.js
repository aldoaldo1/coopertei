C.View.OtAdmin = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.ots = new C.Collection.Ots(null, { view: this });

    this.ots.fetch({
      success: function(collection, response) {
        me.ot_table = new C.View.OtAdminTable({
          el: $('#ot_left'),
          collection: collection
        });

        $('#right').bind('ot_form_loaded', function(e, form) {
          $('.right_options').remove();
          me.ot_options = new C.View.OtAdminOptions({
            el: $('#ot_left .fg-toolbar')[0],
            ot_table: me.ot_table,
            ot_form: form
          });
        });

        me.ot_form = new C.View.OtAdminForm({
          el: $('#ot_right'),
          model: me.model,
          collection: collection,
          ot_table: me.ot_table
        });
      }
    });
  }

});
