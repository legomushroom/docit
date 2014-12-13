var DocIt, docit, fs, jf, testHelpers, util;

util = require('util');

util.print('\u001b[2J\u001b[0;0H');

console.log('--------------------- Tests ---------------------');

DocIt = require('../src/docit');

testHelpers = require('./test-helpers');

fs = require('fs');

jf = require('jsonfile');

testHelpers.cleanProject();

docit = new DocIt({
  isLivereloadLess: true,
  isDev: true
});

describe('docit', function() {
  describe('initialization', function() {});
  return describe('json map storage', function() {
    var map;
    map = null;
    return it('should generate json map', function(done) {
      console.log(done);
      setInterval((function() {
        return console.log('a');
      }), 10);
      return setTimeout((function(_this) {
        return function() {
          console.log(docit.map);
          expect(JSON.stringify(map)).toBe('{pages:["buttons1s"]}');
          return done();
        };
      })(this), 50);
    });
  });
});
