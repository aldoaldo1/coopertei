var DB, Everyone;

var Person = function(db, everyone) {
  DB = db;
  Everyone = everyone;
  
  return Person;
};

Person.get = function(req, res, next) {
  var q = " \
    SELECT *, CONCAT(lastname, ', ', firstname) AS name \
    FROM person \
    WHERE deleted_at IS NULL \
  ";
  
  DB._.query(q, function(err, data) {
    res.send(data);
  });
};

Person.getOne = function(req, res, next) {
  DB.Person.findAll(DB.whereID(req.params.id)).on('success', function(x) {
    res.send(DB.dataToArray(x));
  });
};

Person.post = function(req, res, next) {
  DB.Person.build({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email
  }).save().on('success', function(person) {
    // Send the news
    DB.News.build({
      name: 'Nueva Persona',
      description: 'La Persona "' + person.firstname + ' ' + person.lastname + '" ha sido creada',
      related_model: 'person',
      related_model_id: person.id
    }).save();
    
    res.send({ "id": person.id });
  }).on('error', function(err) {
    res.send(false);
  });
};

Person.put = function(req, res, next) {
  DB.Person.find({ where: { id: req.body.id } }).on('success', function(p) {
    if (p) {
      //req.body.created_at = DB.toMySqlDate(req.body.created_at.substr(0, 10));
      //req.body.updated_at = DB.toMySqlDate(req.body.updated_at.substr(0, 10));
      delete req.body.created_at;
      delete req.body.updated_at;
      
      p.updateAttributes(req.body).on('success', function() {
        res.send(req.body);
      }).on('error', function(err) {
        res.send(false);
      });
    }
  });
};

Person.delete = function(req, res, next) {
  DB.Person.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(p) {
      res.send({ "id": p.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Person;

