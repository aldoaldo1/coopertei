C.View.ClientsEvents = Backbone.View.extend({
  // Configuration

  name: 'clients',

  initialize: function() {
    if (this.options.ot_id !== undefined) {
      this.renderTimeline();
    } else {
      $('#left .inner').append(
        '<h1 style="font-size:20px;">Debe seleccionarse una O/T para visualizar sus eventos.</h1>' +
        '<br />' +
        '<a style="font-size:20px;" href="/#/client/ots">Seleccionar &Oacute;rden de Trabajo</a>'
      );
    }
  },

  // Methods

  renderTimeline: function() {
    var me = this;

    $.ajax({
      type: 'GET',
      url: '/clientevents/' + this.options.ot_id,
      success: function(response) {
        me.outputMarkupAndInititateTimeline(response.ot[0], response.tasks);
      }
    });
  },

  outputMarkupAndInititateTimeline: function(ot, tasks) {
    if (tasks.length) {

      var ot_ini = new Date(ot.created_at),
          ot_inis = ot_ini.getFullYear() + ',' + (ot_ini.getMonth() + 1) + ',' + ot_ini.getDate(),
          ot_end = new Date(ot.delivery),
          ot_ends = ot_end.getFullYear() + ',' + (ot_end.getMonth() + 1) + ',' + ot_end.getDate();

      $('#timeline').remove();
      $('#left, #left .inner').css({ width: '100%', padding: 0 });

      $('#left .inner').empty().append(
        '<div id="timeline">' +
        	'<section>' +
	          '<time>' + ot_inis + '</time>' +
	          '<h2>Inicio de la O/T N&ordm; ' + ot.number + '</h2>' +
	          '<article>' +
		          '<p>' + ot.client_suggestion + '</p>' +
	          '</article>' +
          '</section>' +
        '</div>'
      );

      _.each(tasks, function(t) {
        var ini = new Date(t.created_at),
            inis = ini.getFullYear() + ',' + (ini.getMonth() + 1) + ',' + ini.getDate(),
            end = new Date(t.due_date),
            ends = end.getFullYear() + ',' + (end.getMonth() + 1) + ',' + end.getDate(),
            completed_markup = '';

        if (t.completed == 1) {
          completed_markup += '<h3 class="completed_task_markup">COMPLETADA el d&iacute;a ' +
                              moment(t.completed_date).format('DD/MM/YYYY') + '</h3>';
        }

        $('#left .inner #timeline').append(
          '<ul>' +
            '<li>' +
              '<time>' + inis + ' </time>' +
              '<time>' + ends + '</time>' +
	            '<h3>' + t.name + '</h3>' +
	            '<article>' +
		            '<p>' + t.description + '</p>' +
	              completed_markup +
	            '</article>' +
	            '<figure>' +
	              '<img src="">' +
				        '<cite>' + t.name + '</cite>' +
				        '<figcaption>' + t.description + '</figcaption>' +
              '</figure>' +
            '</li>' +
          '</ul>'
        );
      });

  	  (new VMM.Timeline({ lang: 'es' })).init();
	  } else {
	    $('#left .inner').append(
        '<h1 style="font-size:20px;">La O/T N&ordm; ' + ot.number +
        ' todav&iacute;a no posee tareas asociadas.</h1>' +
        '<br />' +
        '<a style="font-size:20px;" href="/#/client/ots">Seleccionar otra &Oacute;rden de Trabajo</a>'
      );
	  }
  }

});
