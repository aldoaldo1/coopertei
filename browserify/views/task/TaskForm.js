C.View.TaskForm = Backbone.View.extend({
  // Configuration

  name: 'task_form',

  title: 'Datos de la Tarea',

  fields: {
    name: { label: 'Nombre', check: 'alpha' },
    description: { label: 'Descripci&oacute;n', check: 'alpha' },
    area_id: { label: 'Area', type: 'select' }
  },

  isCRUD: true,

  relations: { areas: null },

  initialize: function() {
    var me = this;

    F.getAllFromModel('area', function(areas) {
      me.relations.areas = areas;
      F.createForm(me);
    });
  },

  events: {
    "click .task_form .BUTTON_create": "addTask",
    "click .task_form .BUTTON_save": "editTask",
    "click .task_form .BUTTON_delete": "delTask"
  },

  // Methods

  getTable: function() {
    return this.options.task_table;
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

  addTableRow: function(new_id) {
    var values = F.JSONValuesToArray($('.task_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addTask: function() {
    var me = this;

    this.collection.create(
      $('.task_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('La tarea ha sido creada');
        }
      }
    );
  },

  editTask: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.task_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('La tarea ha sido actualizada');
        }
      }
    );
  },

  delTask: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar a esta Tarea?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('La tarea ha sido eliminada');
        }
      });
    });
  }

});
