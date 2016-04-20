C.Widget.News = {

  initialize: function() {
    $('#head #tabs').empty().append(
      //'<a href="/#/ini/news">Novedades</a>' +
      '<a href="/#/ini/alerts">Alertas</a>'
    );

    $('#left .inner').empty().append(
      '<div id="news_left">' +
      '</div>'
    );

    $('#right .inner').empty().append(
      '<div id="news_right">' +
      '</div>'
    );
  }

};
