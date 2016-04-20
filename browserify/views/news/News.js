C.View.News = Backbone.View.extend({
  // Configuration

  el: $('body'),

  initialize: function() {
    var me = this;

    this.news = new C.Collection.Newss(null, { view: this });

    this.news.fetch({
      success: function(collection, response) {
        me.news_feed = new C.View.NewsFeed({
          el: $('#alert_right'),
          collection: collection
        });
      }
    });
  }

});
