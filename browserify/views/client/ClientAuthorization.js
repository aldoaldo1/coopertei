C.View.ClientAuthorization = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.authorizations = new C.Collection.Authorizations(null, { view: this });

    this.authorizations.fetch({
      success: function(collection, response) {
        me.client_table = new C.View.ClientAuthorizationTable({
          el: $('#client_left'),
          collection: collection
        });
        me.client_form = new C.View.ClientAuthorizationInfoCard({
          el: $('#client_right'),
          model: me.model,
          collection: collection,
          client_table: me.client_table
        });
        me.client_options = new C.View.ClientAuthorizationOptions({
          el: $('#client_left .fg-toolbar')[0],
          client_table: me.client_table,
          client_form: me.client_form
        });
      }
    });
  }

});
