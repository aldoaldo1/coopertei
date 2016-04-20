C.View.OtAudit = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.ots = new C.Collection.Ots(null, { view: this });

    this.ots.fetch({
      success: function(collection, response) {
        me.collection = collection;

        $.ajax({
          type: 'GET',
          url: '/user/currentAreaId',
          success: function(response) {
            me.area_id = response.area_id;
            me.render();
          }
        });
      }
    });
  },

  render: function(collection) {
    var me = this;

    this.ot_table = new C.View.OtAuditTable({
      el: $('#ot_left'),
      collection: this.collection,
      area_id: this.area_id,
      open_ot_number_on_start: this.options.open_ot_number_on_start
    });

    $('#right').bind('ot_infocard_loaded', function(e, infocard) {
      $('.right_options').remove();
      me.ot_options = new C.View.OtAuditOptions({
        el: $('#ot_left .fg-toolbar')[0],
        ot_table: me.ot_table,
        ot_infocard: infocard
      });
    });

    this.ot_infocard = new C.View.OtAuditInfoCard({
      el: $('#ot_right'),
      model: this.model,
      collection: this.collection,
      ot_table: this.ot_table
    });
  }

});
