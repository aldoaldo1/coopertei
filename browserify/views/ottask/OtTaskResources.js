C.View.OtTaskResources = Backbone.View.extend({
  // Configuration

  name: 'ottask_resource',

  initialize: function() {
    this.getResources();
  },

  render: function(resources) {
    var subdetail = $('<div>', { class: 'row_subdetail' }),
        table = $('<table>');

    _.each(resources, function(r) {
      $(table).append(
        '<tr>' +
          '<td width="15%">' + r.employee + '</td>' +
          '<td width="15%">' + r.employee_hours + ':' + r.employee_minutes + ' hs.</td>' +
          '<td width="70%">' + r.materials_tools + '</td>' +
        '</tr>'
      );
    });

    $(subdetail).append(table);
    $(this.options.task_row).append(subdetail);
  },

  // Methods

  getResources: function() {
    var me = this;

    $.ajax({
      url: '/ottask/resources/' + me.options.task.id,
      success: function(response) {
        if (response.result === true) {
          me.render(response.resources);
        } else {
          F.msgError('Ocurri&oacute; un error al buscar los Recursos de la Tarea');
        }
      }
    });
  }

});
