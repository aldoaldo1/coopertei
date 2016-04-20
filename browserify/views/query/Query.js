C.View.Query = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    /*
    this.query_form = new C.View.QueryForm({
      el: $('#query_right'),
      model: this.model
    });
    */
    this.query_predefined_list = new C.View.QueryPredefinedList({
      el: $('#query_right'),
      model: this.model
    });
  }

});
