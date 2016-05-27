var DB, Everyone;

var Client = function(db, everyone) {
  DB = db;
  Everyone = everyone;

  return Client;
};

Client.get = function(req, res, next) {
  DB.Client.findAll({ where: ["deleted_at IS NULL"] }).on('success', function(clients) {
    res.send({data:DB.dataToArray(clients)});
  });
};

Client.getOne = function(req, res, next) {
  DB.Client.findAll(DB.whereID(req.params.id)).on('success', function(x) {
    res.send(DB.dataToArray(x));
  });
};

Client.post = function(req, res, next) {
  console.log(req.body)
  DB.User.find({ where: { username: req.body.username } }).on('success', function(u) {
    if (u) {
      console.log(u);
      res.send({ result: false, error: 'Usuario existente' });
    } else {
      DB.User.create({
        username: req.body.username,
        password: req.body.username,
        role_id: 6 // Client
      }).on('success', function(user) {
        DB.Client.create({
          "name": req.body.name,
          "user_id": user.id,
          "tag": req.body.tag,
          "cuit": req.body.cuit,
          "iva_id": req.body.iva_id,
          "address": req.body.address,
          "addressnumber": req.body.addressnumber,
          "floor": req.body.floor,
          "apartment": req.body.apartment,
          "city_id": req.body.city_id,
          "email": req.body.email
        }).on('success', function(client) {
          // Send the news
          DB.News.create({
            name: 'Nuevo Cliente',
            description: 'El Cliente "' + client.name + '" ha sido creado',
            related_model: 'client',
            related_model_id: client.id
          });

          res.send({ result: true, client: client });
        }).on('error', function(error) {
          res.send({ result: false, error: error });
        });
      }).on('error', function(error) {
        res.send({ result: false, error: error });
      });
    }
  });
};

Client.put = function(req, res, next) {
  DB.Client.find({ where: { id: req.params.id } }).on('success', function(p) {
    if (p) {
      delete username;
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

Client.delete = function(req, res, next) {
  DB.Client.find({ where: { id: req.params.id } }).on('success', function(p) {
    p.destroy().on('success', function(p) {
      res.send({ "id": p.id });
    }).on('error', function(error) {
      res.send(error);
    });
  }).on('error', function(error) {
    res.send(error);
  });
};

module.exports = Client;
