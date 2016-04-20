C.View.User = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.users = new C.Collection.Users(null, { view: this });

    this.users.fetch({
      success: function(collection, response) {
        me.user_table = new C.View.UserTable({
          el: $('#user_left'),
          collection: collection
        });
        me.user_form = new C.View.UserForm({
          el: $('#user_right'),
          model: me.model,
          collection: collection,
          user_table: me.user_table
        });
      }
    });
  }

});
