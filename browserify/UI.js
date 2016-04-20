$(function() {

  $(document).ajaxError(function(e, req, settings) {
    F.msgErrorTop('Error de servidor.<br />Recargue la aplicaci&oacute;n e intente nuevamente');
  });

  $(document).on('keyup', function(e) {
    if (e.which == 27) {
      $.unblockUI();
    }
  });

  $('#logout_button').on('click', function() {
    F.msgConfirm('\u00BFRealmente desea salir?', function() {
      window.location = '/logout';
    });
  });

  window.setInterval(function() {
    $('#date').text(moment().format('DD/MM/YYYY - HH:mm:ss'));
  }, 1000);

  $('.button').button();
  $('.tabs').tabs();

  $('#errorreport').on('click', function() {
    if ($('#errorreport_form').length) {
      $('#errorreport_form').fadeOut('slow', function() {
        $(this).remove();
        $('span#errorreport').removeClass('opened');
      });
    } else {
      new C.View.ErrorReportForm();
    }
  });

  $('#expandup').on('click', function() {
    if ($('#head').css('display') === 'block') {
      $('#head').css({ display: 'none' });
      $('#left, #right').css({ top: 0 });
      $('#expandup').attr('src', '/images/expanddown.gif');
    } else {
      $('#head').css({ display: 'block' });
      $('#left, #right').css({ top: '85px' });
      $('#expandup').attr('src', '/images/expandup.gif');
    }
  });
  $('#expandright').on('click', function() {
    if ($('#right').css('display') === 'block') {
      $('#right').css({ display: 'none' });
      $('#left').css({ width: '100%' });
      $('#expandright').attr('src', '/images/expandleft.gif');
    } else {
      $('#right').css({ display: 'block' });
      $('#left').css({ width: '75%' });
      $('#expandright').attr('src', '/images/expandright.gif');
    }
  });
  $('#fullscreen').on('click', function() {
    if (!screenfull.isFullscreen) {
      screenfull.request();
      $('#fullscreen').attr('src', '/images/fullscreenyes.png');
    } else {
      screenfull.exit();
      $('#fullscreen').attr('src', '/images/fullscreenno.png');
    }
  });
});
