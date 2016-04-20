C.View.Task = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.tasks = new C.Collection.Tasks(null, { view: this });
    
    this.tasks.fetch({
      success: function(collection, response) {
        me.task_table = new C.View.TaskTable({
          el: $('#task_left'),
          collection: collection
        });
        me.task_form = new C.View.TaskForm({
          el: $('#task_right'),
          model: me.model,
          collection: collection,
          task_table: me.task_table
        });
      }
    });
  }

});

