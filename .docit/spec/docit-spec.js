var DocIt, docit, fs, jf, testHelpers,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  describe('initialization', function() {
    return it('should create folders and files if needed', function() {
      var items;
      items = fs.readdirSync('../');
      expect(__indexOf.call(items, 'css') >= 0).toBe(true);
      return expect(__indexOf.call(items, 'docit-pages') >= 0).toBe(true);
    });
  });
  return describe('compilation', function() {
    return it('should write pages json map on html file change', function() {
      var pages;
      jf.writeFileSync('../pages.json', {
        pages: []
      });
      fs.writeFileSync('../docit-pages/colors.html', '');
      pages = jf.readFileSync('../pages.json');
      console.log(pages);
      return expect(JSON.stringify(pages)).toBe('{"pages":["colors"]}');
    });
  });
});
