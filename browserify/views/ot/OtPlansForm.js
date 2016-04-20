C.View.OtPlansForm = Backbone.View.extend({
  // Configuration

  name: 'plan_form',

  title: 'Datos del Plan de Tareas',

  fields: {
    name: { label: 'Nombre', check: 'alpha' },
    description: { label: 'Descripci&oacute;n', type: 'textarea' },
    task_id: { label: 'Tarea(s)', type: 'selectmultiple' }
  },

  isCRUD: true,

  relations: { tasks: null,/* categories: null, subcategories: null */ },

  initialize: function() {
    var me = this;

    F.getAllFromModel('task', function(tasks) {
      me.relations.tasks = tasks;

      F.createForm(me);
    });
  },

  events: {
    "click .plan_form .BUTTON_create": "addPlan",
    "click .plan_form .BUTTON_save": "editPlan",
    "click .plan_form .BUTTON_delete": "delPlan",
  },

  // Methods

  getTable: function() {
    return this.options.plan_table;
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
    var values = F.JSONValuesToArray($('.plan_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addPlan: function() {
    var me = this;

    this.collection.create(
      $('.plan_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.addTableRow(response.id);
          F.msgOK('El Plan ha sido creado');
        }
      }
    );
  },

  editPlan: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.plan_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('El Plan ha sido actualizado');
        }
      }
    );
  },

  delPlan: function() {
    var me = this;

    F.msgConfirm('\u00BFDesea eliminar este Plan?', function() {
      me.collection.get(me.getSelectionID()).destroy({
        success: function(model, response) {
          var x = model.attributes;

          $(me.getSelectionRow()).fadeOut('slow', function() {
            $(this).remove();
          });
          F.msgOK('El Plan ha sido eliminado');
        }
      });
    });
  }

});
