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
    describe('getFolder method', function() {
      return it('should return "pages" if passed path is "docit-pages"', function() {
        var folder, path;
        path = '/user/bin/docit-pages/buttons.html';
        folder = docit.getFolder(path);
        expect(folder).toBe('pages');
        path = '/user/bin/docit-pages/about-page/buttons.html';
        folder = docit.getFolder(path);
        return expect(folder).toBe('about-page');
      });
    });
    describe('addPageToMap method', function() {
      return it('should add page name to map', function() {
        var map, path;
        path = '/user/bin/docit-pages/colors.html';
        map = {
          pages: []
        };
        map = docit.addPageToMap({
          map: map,
          filepath: path
        });
        return expect(JSON.stringify(map)).toBe('{"pages":["colors"]}');
      });
    });
    describe('removePageFromMap method', function() {
      return it('should remove page name from map', function() {
        var map, path;
        path = '/user/bin/docit-pages/type.html';
        map = {
          pages: ['type', 'colors']
        };
        map = docit.removePageFromMap({
          map: map,
          filepath: path
        });
        return expect(JSON.stringify(map)).toBe('{"pages":["colors"]}');
      });
    });
    describe('renamePageInMap method', function() {
      return it('should remove page name from map', function() {
        var map, newPath, oldPath, options;
        oldPath = '/user/bin/docit-pages/type2.html';
        newPath = '/user/bin/docit-pages/type.html';
        map = {
          pages: ['type2', 'forms']
        };
        options = {
          map: map,
          oldPath: oldPath,
          newPath: newPath
        };
        map = docit.renamePageInMap(options);
        return expect(JSON.stringify(map)).toBe('{"pages":["type","forms"]}');
      });
    });
    describe('parseFolderToMap method', function() {
      it('should parse file and folders to map object', function() {
        var files, filesString, map;
        files = ['/user/bin/docit-pages/type.html', '/user/bin/docit-pages/partials/icon.jade', '/user/bin/docit-pages/about-us/header.html', '/user/bin/docit-pages/about-us/footer.html'];
        map = docit.parseFolderToMap(files);
        filesString = '{"pages":["type"],"about-us":["header","footer"]}';
        return expect(JSON.stringify(map)).toBe(filesString);
      });
      it('should add only .html files to map', function() {
        var files, filesString, map;
        files = ['/user/bin/docit-pages/type.html', '/user/bin/docit-pages/.DS_store'];
        map = docit.parseFolderToMap(files);
        filesString = '{"pages":["type"]}';
        return expect(JSON.stringify(map)).toBe(filesString);
      });
      return it('should warn if more the 1 level nested', function() {
        var files, filesString, map;
        files = ['/user/bin/docit-pages/type.html', '/user/bin/docit-pages/partials/icon.jade', '/user/bin/docit-pages/about-us/header.html', '/user/bin/docit-pages/about-us/another-folder/footer.html'];
        spyOn(console, 'warn');
        map = docit.parseFolderToMap(files);
        expect(console.warn).toHaveBeenCalled();
        filesString = '{"pages":["type"],"about-us":["header","footer"]}';
        return expect(JSON.stringify(map)).toBe(filesString);
      });
    });
    return describe('writeMap method', function() {
      return it('should write passed map to package.json file', function() {
        var files, map, pages;
        files = ['/user/bin/docit-pages/buttons.html', '/user/bin/docit-pages/partials/icon.jade'];
        map = docit.parseFolderToMap(files);
        docit.writeMap(map);
        pages = jf.readFileSync('pages.json');
        return expect(JSON.stringify(pages)).toBe('{"pages":["buttons"]}');
      });
    });
  });
});
