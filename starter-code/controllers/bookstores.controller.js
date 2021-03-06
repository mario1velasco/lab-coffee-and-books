const Bookstore = require('../models/bookstore.model');
const path = require('path');

module.exports.show = (req, res, next) => {
  Bookstore.find().then(bookstores=>{
    res.render("bookstore/index",{bookstores});
  });
};
module.exports.new = (req, res, next) => {
  res.render("bookstore/new");
};
module.exports.create = (req, res, next) => {
  const {
    name,
    description,
    lat,
    lng
  } = req.body;
  if (!name || !description || !lat || !lng) {
    res.json({
      error: {
        name: name ? '' : 'name is required',
        description: description ? '' : 'description is required',
        lat: lat ? '' : 'lat is required',
        lng: lng ? '' : 'lng is required'
      }
    });
  }else{
    Bookstore.findOne({
        name: req.body.name
      })
      .then(bookstore => {
        if (bookstore != null) {
          res.json({
            bookstore: bookstore,
            error: {
              name: 'Bookstore name already exists'
            }
          });
        } else {
          bookstore = new Bookstore(req.body);
          bookstore.save()
            .then(() => {
              res.json({success:"Bookstore save successfully"});
            }).catch(error => {
              if (error instanceof mongoose.Error.ValidationError) {
                res.json({
                  bookstore: bookstore,
                  error: error.errors
                });
              } else {
                next(error);
              }
            });
        }
      }).catch(error => next(error));
  }
};

module.exports.delete = (req, res, next) => {
  const _id = req.params.id;
  if (!_id) {
    res.json({
      error: {
        id: _id ? '' : 'id is required'
      }
    });
  } else {
    Bookstore.findByIdAndRemove(req.params.id)
      .then((bookstore) => {
        Bookstore.find()
          .sort({
            createdAt: -1
          })
          .then((bookstores) => {
            res.json({
              bookstores: bookstores,
              success: 'Bookstore Deleted succesfully!!'
            });
          }).catch(error => next(error));
      }).catch(error => next(error));
  }
};