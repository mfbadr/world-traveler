'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    vacations      = require('../controllers/vacations'),
    home           = require('../controllers/home');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/about', home.about);
  app.get('/faq', home.faq);
  app.get('/contact', home.contact);

  app.get('/vacations/new', vacations.init);
  app.get('/vacations', vacations.index);
  app.post('/vacations', vacations.create);
  app.get('/vacations/:id', vacations.view);
  app.post('/vacations/:id/photos/download', vacations.downloadPhoto);
  app.post('/vacations/:id/photos/upload', vacations.uploadPhotos);
  console.log('Routes Loaded');
};

