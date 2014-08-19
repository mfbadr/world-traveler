/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Vacation  = require('../../app/models/vacation'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'world-traveler-test';

describe('vacation', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      console.log(stdout, stderr);
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Vacation object', function(){
      var o = {name:'Nashville, TN, USA', lat:'36.15', lng:'-86.8', start: '2014-08-12', end:'2014-8-22'},
          v = new Vacation(o);
      expect(v).to.be.instanceof(Vacation);
      expect(v.name).to.equal('Nashville, TN, USA');
      expect(v.lat).to.be.a('number');
      expect(v.lng).to.be.a('number');
      expect(v.start).to.respondTo('getDay');
      expect(v.end).to.respondTo('getDay');

    });
  });

  describe('.all', function(){
    it('should get all vacations', function(done){
      Vacation.all(function(err, people){
        expect(people).to.have.length(3);
        done();
      });
    });
  });
});

