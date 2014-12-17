var DocIt, fs, fse, gaze, h, jade, jf, livereload, mkdirp, recursive, shell,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

jade = require('jade');

gaze = require('gaze');

jf = require('jsonfile');

fs = require('fs');

fse = require('fs-extra');

shell = require('shell');

mkdirp = require('mkdirp');

livereload = require('livereload');

shell = require('shelljs/global');

recursive = require('readdir-recursive');

h = require('./helpers');

DocIt = (function() {
  function DocIt(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.createFolders();
    this.getProjectFiles();
    return this;
  }

  DocIt.prototype.vars = function() {
    var prefix;
    this.isDev = this.o.isDev;
    this.projectName = "docit";
    this.jsonFilePrefix = this.isDev ? './' : '.docit/';
    prefix = this.isDev ? '../' : '';
    this.pagesFolder = "" + prefix + this.projectName + "-pages";
    this.pageFiles = "" + this.pagesFolder + "/**/*.html";
    return this.pageFilesJade = "" + this.pagesFolder + "/**/*";
  };

  DocIt.prototype.createFolders = function() {
    var fromDir, items, nBaseurl, _ref;
    nBaseurl = this.isDev ? './' : '.docit/';
    this.baseUrl = this.isDev ? '../' : './';
    items = fs.readdirSync(this.baseUrl);
    if (!(__indexOf.call(items, 'css') >= 0)) {
      fse.copySync("" + nBaseurl + "project-folders/css/", "" + this.baseUrl + "css");
    }
    if (!(_ref = "" + this.projectName + "-pages", __indexOf.call(items, _ref) >= 0)) {
      fromDir = "" + nBaseurl + "./project-folders/docit-pages/";
      return fse.copySync(fromDir, "" + this.baseUrl + "docit-pages");
    }
  };

  DocIt.prototype.getProjectFiles = function() {
    var files, map;
    files = recursive.fileSync("" + this.baseUrl + "docit-pages/");
    map = h.parseFolderToMap(files);
    return this.writeMap(map);
  };

  DocIt.prototype.createLivereloadServer = function() {
    return this.server = livereload.createServer({
      port: 41000
    });
  };

  DocIt.prototype.listenPages = function() {
    var it;
    it = this;
    return gaze(this.pageFiles, function(err, watcher) {
      it.watcher = watcher;
      this.on('added', function(filepath) {
        var map;
        map = h.addPageToMap({
          filepath: filepath,
          map: it.map
        });
        return it.writeMap(map);
      });
      this.on('deleted', function(filepath) {
        var map;
        map = h.removePageFromMap({
          filepath: filepath,
          map: it.map
        });
        return it.writeMap(map);
      });
      return this.on('renamed', function(filepath, oldpath) {
        var map, options;
        if (filepath.match(/\.trash/gi)) {
          map = h.removePageFromMap({
            filepath: oldpath,
            map: it.map
          });
          it.writeMap(map);
        } else {
          options = {
            newPath: filepath,
            oldPath: oldpath,
            map: it.map
          };
          map = h.renamePageInMap(options);
          it.writeMap(map);
        }
        return true;
      });
    });
  };

  DocIt.prototype.listenJadePages = function() {
    var it;
    it = this;
    return gaze(this.pageFilesJade, function(err, watcher) {
      it.watcherJade = watcher;
      this.on('added', function(filepath) {
        if (filepath.match(/\.jade/gi)) {
          return h.compilePage(filepath);
        }
      });
      this.on('changed', function(filepath) {
        if (filepath.match(/\.jade/gi)) {
          return h.compilePage(filepath);
        }
      });
      this.on('deleted', function(filepath) {
        if (filepath.match(/\.jade/gi)) {
          return h.removeSon(filepath);
        }
      });
      return true;
    });
  };

  DocIt.prototype.writeMap = function(map) {
    var _ref;
    this.map = map;
    jf.writeFileSync("" + this.jsonFilePrefix + "pages.json", map);
    return (_ref = this.server) != null ? _ref.refresh('#{@jsonFilePrefix}pages.json') : void 0;
  };

  return DocIt;

})();

module.exports = DocIt;
