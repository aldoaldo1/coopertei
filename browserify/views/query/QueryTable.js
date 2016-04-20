C.View.QueryTable = Backbone.View.extend({
  // Configuration

  name: 'query',

  headers: null,

  attrs: null,

  data: null,

  initialize: function() {
    this.data = this.options.collection;

    F.createDataTable(this);
  },

  events: {
    "click .query_table tr": "selectRow"
  },

  // Methods

  selectRow: function(e) {
    this.selected_row = $(e.currentTarget);
  }

});
