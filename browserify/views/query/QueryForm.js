C.View.QueryForm = Backbone.View.extend({
  // Configuration

  name: 'query_form',

  title: 'Criterios de b&uacute;squeda',

  fields: {
    entity: { label: 'Entidad' },

  },

  isCRUD: false,

  buttons: {
    query: true
  },

  initialize: function() {
    F.createForm(this);
  },

  events: {
    "click .query_form .BUTTON_query": "doQuery"
  },

  // Methods

  getTable: function() {
    return this.options.person_table;
  },

  getDataTable: function() {
    return this.getTable().datatable;
  },

  getSelectionID: function() {
    return parseInt($('.selection_id').val());
  },

  getSelectionRow: function() {
    return this.getTable().selected_row;
  },

  doQuery: function() {
    $.ajax({
      type: 'POST',
      url: '/query',
      data: $('.query_form').serialize(),
      success: function(response) {
        new C.View.QueryTable({
          el: $('#query_left'),
          collection: response,
          headers: [],
          attrs: []
        });
      }
    });
  }

});
