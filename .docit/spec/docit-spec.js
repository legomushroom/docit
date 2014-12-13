var DocIt, docit, fs, jf, testHelpers, util,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  describe('initialization', function() {
    return it('should create folders and files if needed', function() {
      var items;
      items = fs.readdirSync('../');
      expect(__indexOf.call(items, 'css') >= 0).toBe(true);
      return expect(__indexOf.call(items, 'docit-pages') >= 0).toBe(true);
    });
  });
  return describe('methods', function() {
    describe('generateJSONMap method', function() {
      return it('should return generated map', function() {
        var files, map;
        files = {
          './': ['docit-pages/'],
          'docit-pages/': ['buttons.html']
        };
        map = docit.generateJSONMap(null, files);
        return expect(JSON.stringify(map)).toBe('{"pages":["buttons"]}');
      });
    });
    describe('writeMap method', function() {
      return it('should write passed map to package.json file', function() {
        var files, map, pages;
        files = {
          './': ['docit-pages/'],
          'docit-pages/': ['colors.html']
        };
        map = docit.generateJSONMap(null, files);
        docit.writeMap(map);
        pages = jf.readFileSync('../pages.json');
        expect(JSON.stringify(pages)).toBe('{"pages":["colors"]}');
        return expect(JSON.stringify(docit.map)).toBe('{"pages":["colors"]}');
      });
    });
    describe('isFolder method', function() {
      return it('check if passed path ends with "/"', function() {
        var isFolder1, isFolder2, path1, path2;
        path1 = '/user/bin/pages/';
        path2 = '/user/bin/pages';
        isFolder1 = docit.isFolder(path1);
        isFolder2 = docit.isFolder(path2);
        expect(isFolder1).toBe(true);
        return expect(isFolder2).toBe(false);
      });
    });
    return describe('getFolder method', function() {
      return it('should return "pages" if passed path is "docit-pages"', function() {
        var folder, path;
        path = '/user/bin/docit-pages/buttons.html';
        folder = docit.getFolder(path);
        return expect(folder).toBe('pages');
      });
    });
  });
});
