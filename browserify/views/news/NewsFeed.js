C.View.NewsFeed = Backbone.View.extend({
  // Configuration

  name: 'alert',

  data: null,

  initialize: function() {
    this.data = this.options.collection;

    F.createDataFeed(this, 'Novedades');
  }

});
