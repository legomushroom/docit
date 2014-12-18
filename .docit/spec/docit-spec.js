var DocIt, docit, fs, h, jf, testHelpers, util,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

util = require('util');

util.print('\u001b[2J\u001b[0;0H');

process.on('uncaughtException', function(error) {
  return console.log(error.stack);
});

console.log('--------------------- Tests ---------------------');

DocIt = require('../src/docit');

h = require('../src/helpers');

testHelpers = require('./test-helpers');

fs = require('fs');

jf = require('jsonfile');

testHelpers.cleanProject();

docit = new DocIt({
  isLivereloadLess: true,
  isDev: true
});

describe('docit', function() {
  describe('initialization', function() {
    return it('should create folders and files if needed', function() {
      var items;
      items = fs.readdirSync('../');
      expect(__indexOf.call(items, 'css') >= 0).toBe(true);
      expect(__indexOf.call(items, 'docit-pages') >= 0).toBe(true);
      return expect(__indexOf.call(items, 'index.html') >= 0).toBe(true);
    });
  });
  return describe('helpers methods ->', function() {
    return describe('parseHtmlToJson method ->', function() {
      it('should return a promise', function() {
        return expect(h.parseHtmlToJson('').then).toBeDefined();
      });
      return it('should parse html to json', function(done) {
        var expectedString, html, obj1, obj2, string1, string2;
        html = "<card> <name>Button</name> <tags>buttons, press, thin shadow </tags> <hash>af877455f5f70d21e4f999220c5c0e7f</hash> <div class=\"button\"></div> </card> <card> <name>icon</name> <tags>icons, social, facebook</tags> <hash>0380d4f55cd58c7717e4dc4662b38f99</hash> <div class=\"icon\"> <p>whis is</p> <p>an icon</p> </div> </card>";
        obj1 = {
          name: 'Button',
          hash: 'af877455f5f70d21e4f999220c5c0e7f',
          tags: ['buttons', 'press', 'thin shadow'],
          html: '<div class=\"button\"></div>'
        };
        string1 = JSON.stringify(obj1);
        obj2 = {
          name: 'icon',
          hash: '0380d4f55cd58c7717e4dc4662b38f99',
          tags: ['icons', 'social', 'facebook'],
          html: '<div class=\"icon\"> <p>whis is</p> <p>an icon</p> </div>'
        };
        string2 = JSON.stringify(obj2);
        expectedString = "[" + string1 + "," + string2 + " ]";
        return h.parseHtmlToJson(html).then(function(json) {
          expect(JSON.stringify(json)).toBe(expectedString);
          return done();
        });
      });
    });
  });
});
