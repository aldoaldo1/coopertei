C.View.Person = Backbone.View.extend({
  // Configuration
  
  el: $('body'),
  
  initialize: function() {
    var me = this;
    
    this.persons = new C.Collection.Persons(null, { view: this });
    
    this.persons.fetch({
      success: function(collection, response) {
        me.person_table = new C.View.PersonTable({
          el: $('#person_left'),
          collection: collection
        });
        me.person_form = new C.View.PersonForm({
          el: $('#person_right'),
          model: me.model,
          collection: collection,
          person_table: me.person_table
        });
      }
    });
  }

});

