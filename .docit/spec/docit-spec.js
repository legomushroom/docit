var DocIt, docit, fs, h, jf, testHelpers, util,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

util = require('util');

util.print('\u001b[2J\u001b[0;0H');

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
      return expect(__indexOf.call(items, 'docit-pages') >= 0).toBe(true);
    });
  });
  describe('helpers methods ->', function() {
    describe('splitFilePath method ->', function() {
      return it('should split path to pieces', function() {
        var file;
        file = h.splitFilePath('./docit-pages/forms/form.html');
        expect(file.fileName).toBe('form');
        expect(file.extension).toBe('jade');
        return expect(file.pathStr).toBe('./docit-pages/forms/form.html');
      });
    });
    describe('removeSon method ->', function() {
      return it('should not throw', function() {
        return expect(function() {
          return h.removeSon('no such file name');
        }).not.toThrow();
      });
    });
    describe('isFolder method', function() {
      return it('check if passed path ends with "/"', function() {
        var isFolder1, isFolder2, path1, path2;
        path1 = '/user/bin/pages/';
        path2 = '/user/bin/pages';
        isFolder1 = h.isFolder(path1);
        isFolder2 = h.isFolder(path2);
        expect(isFolder1).toBe(true);
        return expect(isFolder2).toBe(false);
      });
    });
    describe('getFolder method', function() {
      return it('should return "pages" if passed path is "docit-pages"', function() {
        var folder, path;
        path = '/user/bin/docit-pages/buttons.html';
        folder = h.getFolder(path);
        expect(folder).toBe('pages');
        path = '/user/bin/docit-pages/about-page/buttons.html';
        folder = h.getFolder(path);
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
        map = h.addPageToMap({
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
        map = h.removePageFromMap({
          map: map,
          filepath: path
        });
        return expect(JSON.stringify(map)).toBe('{"pages":["colors"]}');
      });
    });
    describe('renamePageInMap method', function() {
      it('should rename page name in map', function() {
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
        map = h.renamePageInMap(options);
        return expect(JSON.stringify(map)).toBe('{"pages":["type","forms"]}');
      });
      it('should add page name if folder is empty', function() {
        var map, newPath, oldPath, options;
        oldPath = '/user/bin/docit-pages/type2.html';
        newPath = '/user/bin/docit-pages/type.html';
        map = {
          pages: []
        };
        options = {
          map: map,
          oldPath: oldPath,
          newPath: newPath
        };
        map = h.renamePageInMap(options);
        return expect(JSON.stringify(map)).toBe('{"pages":["type"]}');
      });
      return it('should add page name if folder doesn\'t contain the page name ', function() {
        var map, newPath, oldPath, options;
        oldPath = '/user/bin/docit-pages/type2.html';
        newPath = '/user/bin/docit-pages/type.html';
        map = {
          pages: ['buttons']
        };
        options = {
          map: map,
          oldPath: oldPath,
          newPath: newPath
        };
        map = h.renamePageInMap(options);
        return expect(JSON.stringify(map)).toBe('{"pages":["buttons","type"]}');
      });
    });
    describe('parseFolderToMap method', function() {
      it('should parse file and folders to map object', function() {
        var files, filesString, map;
        files = ['/user/bin/docit-pages/type.html', '/user/bin/docit-pages/partials/icon.jade', '/user/bin/docit-pages/about-us/header.html', '/user/bin/docit-pages/about-us/footer.html'];
        map = h.parseFolderToMap(files);
        filesString = '{"pages":["type"],"about-us":["header","footer"]}';
        return expect(JSON.stringify(map)).toBe(filesString);
      });
      it('should add only .html files to map', function() {
        var files, filesString, map;
        files = ['/user/bin/docit-pages/type.html', '/user/bin/docit-pages/.DS_store'];
        map = h.parseFolderToMap(files);
        filesString = '{"pages":["type"]}';
        return expect(JSON.stringify(map)).toBe(filesString);
      });
      return it('should warn if more the 1 level nested', function() {
        var files, filesString, map;
        files = ['/user/bin/docit-pages/type.html', '/user/bin/docit-pages/partials/icon.jade', '/user/bin/docit-pages/about-us/header.html', '/user/bin/docit-pages/about-us/another-folder/footer.html'];
        spyOn(console, 'warn');
        map = h.parseFolderToMap(files);
        expect(console.warn).toHaveBeenCalled();
        filesString = '{"pages":["type"],"about-us":["header","footer"]}';
        return expect(JSON.stringify(map)).toBe(filesString);
      });
    });
    return describe('writeMap method', function() {
      return it('should write passed map to package.json file', function() {
        var files, map, pages;
        files = ['/user/bin/docit-pages/buttons.html', '/user/bin/docit-pages/partials/icon.jade'];
        map = h.parseFolderToMap(files);
        docit.writeMap(map);
        pages = jf.readFileSync('pages.json');
        return expect(JSON.stringify(pages)).toBe('{"pages":["buttons"]}');
      });
    });
  });
  return describe('file listeners ->', function() {
    describe('html files ->', function() {
      it('should generate map on file add', function(done) {
        fs.writeFileSync('../docit-pages/colors.html', '<h2>Heading</h2>');
        return setTimeout(function() {
          var mapStr, pages;
          mapStr = JSON.stringify(docit.map);
          expect(mapStr).toBe('{"pages":["buttons","colors"]}');
          pages = jf.readFileSync('./pages.json');
          expect(JSON.stringify(pages)).toBe('{"pages":["buttons","colors"]}');
          return done();
        }, 1000);
      });
      it('should generate map on file delete', function(done) {
        fs.unlink('../docit-pages/colors.html');
        return setTimeout(function() {
          var pages;
          pages = jf.readFileSync('./pages.json');
          expect(JSON.stringify(docit.map)).toBe('{"pages":["buttons"]}');
          expect(JSON.stringify(pages)).toBe('{"pages":["buttons"]}');
          return done();
        }, 1000);
      });
      return it('should generate map on file rename', function(done) {
        var newName, oldName;
        oldName = '../docit-pages/buttons.html';
        newName = '../docit-pages/buttons-new.html';
        fs.renameSync(oldName, newName);
        return setTimeout(function() {
          var pages;
          pages = jf.readFileSync('./pages.json');
          expect(JSON.stringify(docit.map)).toBe('{"pages":["buttons-new"]}');
          expect(JSON.stringify(pages)).toBe('{"pages":["buttons-new"]}');
          return done();
        }, 1000);
      });
    });
    return describe('jade files ->', function() {
      it('should compile jade files on add', function(done) {
        fs.writeFileSync('../docit-pages/type.jade', 'h1 Heading from spec');
        return setTimeout(function() {
          var html;
          html = '';
          expect(function() {
            return html = fs.readFileSync('../docit-pages/type.html');
          }).not.toThrow();
          expect(html.toString()).toBe('<h1>Heading from spec</h1>');
          return done();
        }, 1000);
      });
      it('should compile jade files on change', function(done) {
        fs.writeFileSync('../docit-pages/type.jade', 'h1 Heading from spec #2');
        return setTimeout(function() {
          var htmlBuffer;
          htmlBuffer = fs.readFileSync('../docit-pages/type.html');
          expect(htmlBuffer.toString()).toBe('<h1>Heading from spec #2</h1>');
          return done();
        }, 1000);
      });
      it('should remove html file if jade file was removed(removeSon)', function(done) {
        var filePath;
        filePath = '../docit-pages/type';
        fs.unlinkSync("" + filePath + ".jade");
        return setTimeout(function() {
          expect(function() {
            return fs.readFileSync("" + filePath + ".html");
          }).toThrow();
          return done();
        }, 1000);
      });
      return it('should rename html file if jade file was renamed', function(done) {
        var newFile, oldFile;
        fs.writeFileSync('../docit-pages/forms-1.jade', 'h1 Heading');
        oldFile = '../docit-pages/forms-1.jade';
        newFile = '../docit-pages/forms.jade';
        fs.renameSync(oldFile, newFile);
        return setTimeout(function() {
          expect(function() {
            return fs.readFileSync('../docit-pages/forms.html');
          }).not.toThrow();
          return done();
        }, 1000);
      });
    });
  });
});
