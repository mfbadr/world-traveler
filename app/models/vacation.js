'use strict';

var Mongo = require('mongodb'),
       cp = require('child_process'),
       fs = require('fs'),
     path = require('path'),
        _ = require('lodash');

function Vacation(o){
  this.name = o.name;
  this.lat = parseFloat(o.lat);
  this.lng = parseFloat(o.lng);
  this.start = new Date(o.start);
  this.end = new Date(o.end);
  this.photos = [];
}

Object.defineProperty(Vacation, 'collection', {
  get: function(){return global.mongodb.collection('vacations');}
});

Vacation.all = function(cb){
  Vacation.collection.find().toArray(cb);
};

Vacation.findById = function(id, cb){
  id = Mongo.ObjectID(id);
  Vacation.collection.findOne({_id:id}, function(err, obj){
    obj = _.create(Vacation.prototype, obj);
    cb(obj);
  });
};

Vacation.prototype.downloadPhoto = function(url, cb){
  var extensions = url.split('.'),
      extension  = extensions[extensions.length -1],
      dir        = this._id,
      file       = this.photos.length + '.' + extension,
      self       = this;

  console.log(url, dir, file);
  cp.execFile(__dirname + '/../scripts/download.sh', [url, file, dir], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
    console.log(stdout, stderr);
    var photo = '/img/' + dir + '/' + file;
    self.photos.push(photo);
    Vacation.collection.save(self, cb);
  });
};

Vacation.prototype.uploadPhotos = function(files, cb){
  var dir   = __dirname + '/../static/img/' + this._id,
      self  = this,
      exist = fs.existsSync(dir); //true if the directory already exists
  if(!exist){
    fs.mkdirSync(dir); //Nodes way of making a file, uses the fs module
  }

  files.photos.forEach(function(photo){
    var ext    = path.extname(photo.path),
        rel = '/img/' + self._id + '/' + self.photos.length +  ext,
        abs = dir + '/' + self.photos.length + ext;

    fs.renameSync(photo.path, abs); //move and rename
    self.photos.push(rel);
  });
  Vacation.collection.save(self, cb);
};

module.exports = Vacation;

