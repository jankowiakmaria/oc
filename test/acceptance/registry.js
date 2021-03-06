'use strict';

var expect = require('chai').expect;
var path = require('path');
var request = require('../../utils/request');

describe('registry', function(){

  var registry,
      oc = require('../../index'),
      conf = {          
        local: true,
        path: path.resolve('test/fixtures/components'),
        port: 3030,
        baseUrl: 'http://localhost:3030/',
        env: { name: 'local' },
        verbosity: 0
      };

  before(function(done){
    registry = new oc.Registry(conf);
    registry.start(function(err, app){
      done();
    });
  });

  after(function(done){
    registry.close(done);
  });

  describe('GET /', function(){

    var url = 'http://localhost:3030',
        result;

    before(function(done){
      request(url, function(err, res){
        result = JSON.parse(res);
        done();
      });
    });

    it('should respond with the correct href', function(){
      expect(result.href).to.equal('http://localhost:3030/');
    });

    it('should list the components', function(){
      expect(result.components).to.eql(['http://localhost:3030/hello-world', 'http://localhost:3030/oc-client']);
    });
  });

  describe('GET /hello-world', function(){

    describe('when render-mode header not specified', function(){

      var url = 'http://localhost:3030/hello-world',
          result;

      before(function(done){
        request(url, function(err, res){
          result = JSON.parse(res);
          done();
        });
      });

      it('should respond with the correct href', function(){
        expect(result.href).to.eql('http://localhost:3030/hello-world');
      });

      it('should respond with the rendered template', function(){
        expect(result.html).to.exist;
      });

      it('should respond with proper render type', function(){
        expect(result.renderMode).to.equal('rendered');
      });
    });

    describe('when render-mode header set to pre-rendered', function(){

      var url = 'http://localhost:3030/hello-world',
          result;

      before(function(done){
        request(url, { headers: {'render-mode': 'pre-rendered'}}, function(err, res){
          result = JSON.parse(res);
          done();
        });
      });

      it('should respond with the correct href', function(){
        expect(result.href).to.eql('http://localhost:3030/hello-world');
      });

      it('should respond with the pre-rendered template', function(){
        expect(result.template).to.exist;
      });

      it('should respond with proper render type', function(){
        expect(result.renderMode).to.equal('pre-rendered');
      });
    });
  });
});