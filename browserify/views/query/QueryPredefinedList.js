C.View.QueryPredefinedList = Backbone.View.extend({
  // Configuration

  initialize: function() {
    this.template();
  },

  template: function() {
    var me = this,
        list = '';

    F.getAllFromModel('employee', function(employees) {
      _.each(employees, function(e) {
        list += '<option value="' + e.id + '">' + e.name + '</option>';
      });

      $(me.el).append(
        '<h3>Productividad de empleados:</h3>' +
        '<form name="productivityEmployees">' +
          '<select name="employee_ids[]" multiple="multiple">' + list + '</select>' +
          '<input type="button" class="graphEmployeeProducivity" value="Graficar" />' +
        '</form>'
      );
    });
  },

  events: {
    "click #query_right .graphEmployeeProducivity": "getEmployeeTasksAndGraphThem"
  },

  // Methods

  getEmployeeTasksAndGraphThem: function() {
    var me = this;

    $('#query_chart').remove();
    $('#query_left').append('<div id="query_chart"><svg></svg></div>');
    $('#query_left').css({ height: '500px' });
    $('#query_chart').css({
      height: parseInt($('#query_left').css('height')) + 'px',
      minWidth: '100px',
      minHeight: '100px'
    });

    $.ajax({
      type: 'POST',
      url: '/employee/tasksProductivity',
      data: $('form[name=productivityEmployees]').serialize(),
      success: function(response) {
        if (response.result === true) {
          me.renderGraph(response.tasks_per_employee);
        } else {
          F.msgError('Ocurri&oacute; un error al recibir los datos pertinentes.');
        }
      }
    });
  },

  renderGraph: function(tasks_per_employee) {
    if (tasks_per_employee && tasks_per_employee.length) {
      var data = [];

      _.each(tasks_per_employee, function(tpe) {
        var values = [],
            i = 1;

        _.each(tpe.tasks, function(t) {
          values.push({
            x: i, //t.created_at.substr(0, t.created_at.length - 2) + 'Z',
            y: t.employee_hours + parseFloat('0' + (t.employee_minutes / 60))
          });

          i += 1;
        });

        data.push({
          key: tpe.employee,
          values: values
        });
      });

      nv.addGraph(function() {
        var chart = nv.models.lineWithFocusChart();
                      /*.x(function(d) { return d[0]; })
                      .y(function(d) { return d[1]; })
                      .clipEdge(true);*/
        /*
        chart.xAxis.tickFormat(function(d) {
          return d3.time.format('%x')(new Date(d));
        });
        chart.yAxis.tickFormat(d3.format(',.2f'));
        */
        d3.select('#query_chart svg').datum(data).transition().duration(500).call(chart);
        nv.utils.windowResize(chart.update);

        return chart;
      });
    } else {
      $('#query_left')
        .css({ textAlign: 'center', paddingTop: '2em' })
        .html('<h3>No hay datos a reportar.</h3>');
    }
  }

});
