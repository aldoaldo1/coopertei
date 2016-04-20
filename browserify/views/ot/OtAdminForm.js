C.View.OtAdminForm = Backbone.View.extend({
  // Configuration

  name: 'ot_form',

  title: 'Datos de la &Oacute;rden de Trabajo',

  fields: {
    number: { label: 'O/T N&ordm;', force_label: true, value: null,
              attrs: { disabled: 'disabled', style: 'margin-top:-1em 0 1em;' } },
    client_number: { label: 'O/T Cliente', type: 'integer' },
    client_id: { label: 'Cliente', type: 'select' },
    equipment_id: { label: 'Equipo (TAG)', type: 'select' },
    equipment_new: { label: 'O ingrese un Equipo (TAG) nuevo...', type: 'text' },
    delivery: { label: 'Fecha de entrega', type: 'datepicker' },
    intervention_id: { label: 'Motivo de intervenci&oacute;n', type: 'select' },
    workshop_suggestion: { label: 'Sugerencia p/Taller', type: 'textarea' },
    client_suggestion: { label: 'Sugerencia p/Cliente', type: 'textarea' },
    plan_id: { label: 'Plan de Tareas (inicial/tentativo)', type: 'select' },
    reworked_number: { label: 'Es retrabajo de', check: 'integer' },
    notify_client: { label: 'Notificar eventos al cliente', type: 'select_yn', default_value: 'n' }
  },

  buttons: { create: true, save: true, cancel: true, delete: false },

  isCRUD: true,

  relations: { clients: null, equipments: null, interventions: null, plans: null },

  initialize: function() {
    var me = this;

    // Get next O/T number and show it on form field
    F.getNextOtNumber(function(data) {
      me.fields.number.value = data.n;

      F.getAllFromModel('client', function(clients) {
        me.relations.clients = clients;
        F.getAllFromModel('equipment', function(equipments) {
          me.relations.equipments = equipments;
          F.getAllFromModel('intervention', function(interventions) {
            me.relations.interventions = interventions;
            F.getAllFromModel('plan', function(plans) {
              me.relations.plans = plans;

              F.createForm(me, false, function() {
                $('#right').trigger('ot_form_loaded', [me]);

                // Check if Equipment already has an O/T for Client
                $('.ot_form select[name=equipment_id]').after(
                  $('<span>', { class: 'equipment_ot_exists' })
                );
                $('.ot_form select[name=equipment_id]').on('change', function() {
                  var me = this,
                      client_id = $('.ot_form select[name=client_id]').val();

                  $.ajax({
                    url: '/ot/findByEquipmentAndClient/' + $(this).val() + '/' + client_id,
                    success: function(response) {
                      $('span.equipment_ot_exists').empty();

                      if (response.result === true && response.ots.length) {
                        var ot_number = response.ots[response.ots.length - 1].number;
                        $('span.equipment_ot_exists').html(
                          'Este equipo ya ingres&oacute; con la O/T N&ordm; ' + ot_number
                        );
                      }
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  },

  events: {
    "click .ot_form .BUTTON_create": "addOt",
    "click .ot_form .BUTTON_save": "editOt"
  },

  // Methods

  getTable: function() {
    return this.options.ot_table;
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
    var values = F.JSONValuesToArray($('.ot_form').serializeObject());

    values.unshift(new_id);
    this.getDataTable().fnAddData(values);
  },

  editTableRow: function(new_values) {
    //this.getDataTable().fnUpdate(new_values, this.getSelectionRow());
  },

  addOt: function() {
    var me = this;

    this.collection.create(
      $('.ot_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          //me.addTableRow(response.id);
          F.msgOK('La O/T ha sido creada');
        }
      }
    );
  },

  editOt: function() {
    var me = this;

    this.collection.get(this.getSelectionID()).save(
      $('.ot_form').serializeObject(),
      {
        success: function(model, response) {
          var x = model.attributes;

          //me.editTableRow(F.JSONValuesToArray(model.attributes));
          F.msgOK('La O/T ha sido actualizada');
        }
      }
    );
  }

});
