var DocIt, docit, fs, testHelpers,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

console.log('--------------------- Tests ---------------------');

DocIt = require('../src/docit');

testHelpers = require('./test-helpers');

fs = require('fs');

docit = new DocIt({
  isLivereloadLess: true
});

describe('docit', function() {
  return describe('initialization', function() {
    return it('should create folders and files if needed', function() {
      var cssFolder, items, pagesFolder, partialsFolder;
      items = fs.readdirSync('../');
      pagesFolder = fs.readdirSync('../docit-pages/');
      cssFolder = fs.readdirSync('../css');
      partialsFolder = fs.readdirSync('../docit-pages/partials/');
      expect(__indexOf.call(items, 'css') >= 0).toBe(true);
      expect(__indexOf.call(items, 'docit-pages') >= 0).toBe(true);
      expect(__indexOf.call(pagesFolder, 'buttons.html') >= 0).toBe(true);
      expect(__indexOf.call(pagesFolder, 'partials') >= 0).toBe(true);
      expect(__indexOf.call(cssFolder, 'buttons.css') >= 0).toBe(true);
      return expect(__indexOf.call(partialsFolder, 'icon.jade') >= 0).toBe(true);
    });
  });
});
