C.View.MaterialOrderInfoCard = Backbone.View.extend({
  // Configuration

  name: 'material_order_infocard',

  title: 'Datos del Pedido de Material',

  initialize: function() {
    F.createInfoCard(this, $('#material_right'));
  }

});
