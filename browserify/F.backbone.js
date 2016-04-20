// R = Backbone Router functions

F.R.highlightCurrentModule = function(module) {
  $("#head a").removeClass('ui-state-active');
  $("#tabs a").removeClass('active-tab');

  if (module !== false) {
    $("#head a[href='/#/" + module.split('/')[0] + "']").addClass('ui-state-active');
    $("#tabs a[href='/#/" + module + "']").addClass('active-tab');

    var fifty_fifty_layout_modules = [
      'ots/plans',
      'crud/intervention',
      'crud/task'
    ];

    if (_.indexOf(fifty_fifty_layout_modules, module) === -1) {
      $('#left').css({ width: '75%' });
      $('#right').css({ left: '75%', width: '25%' });
    } else {
      $('#left').css({ width: '50%' });
      $('#right').css({ left: '50%', width: '50%' });
    }
  }
};

// M = Backbone Models/Collections functions
