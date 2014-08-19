'use strict';

var Vacation = require('../models/vacation'),
    mp     =   require('multiparty'),
    Moment = require('moment');

exports.init = function(req, res){
  res.render('vacations/init');
};

exports.create = function(req, res){
  var v = new Vacation(req.body);
  Vacation.collection.save(v, function(){
    res.redirect('/vacations');
  });
};

exports.index = function(req, res){
  Vacation.all(function(err, vacations){
    res.render('vacations/index', {vacations:vacations, moment:Moment});
  });
};

exports.view = function(req, res){
  Vacation.findById(req.params.id, function(vacation){
    res.render('vacations/view', {vacation:vacation, moment:Moment});
  });
};

exports.downloadPhoto = function(req, res){
  Vacation.findById(req.params.id, function(vacation){
    vacation.downloadPhoto(req.body.url, function(){
      res.redirect('/vacations/' + req.params.id);
    });
  });
};

exports.uploadPhotos = function(req, res){
  Vacation.findById(req.params.id, function(vacation){
    var form = new mp.Form(); //multiparty
    form.parse(req, function(err, fields, files){
      vacation.uploadPhotos(files, function(){
        res.redirect('/vacations/' + req.params.id);
      });
    });
  });
};
