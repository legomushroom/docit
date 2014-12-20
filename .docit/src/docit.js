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
    !this.o.isLivereloadLess && this.createLivereloadServer();
    this.listenPages();
    this.listenJadePages();
    return this;
  }

  DocIt.prototype.vars = function() {
    var prefix;
    this.isDev = this.o.isDev;
    this.map = {};
    this.projectName = "docit";
    this.jsonFilePrefix = this.isDev ? './' : '.docit/';
    prefix = this.isDev ? '../' : '';
    this.pagesFolder = "" + prefix + this.projectName + "-pages";
    this.pageFiles = "" + this.pagesFolder + "/**/*.html";
    return this.pageFilesJade = "" + this.pagesFolder + "/**/*";
  };

  DocIt.prototype.createFolders = function() {
    var fromDir, fromFile, items, nBaseurl, toFile, _ref;
    nBaseurl = this.isDev ? './' : '.docit/';
    this.baseUrl = this.isDev ? '../' : './';
    items = fs.readdirSync(this.baseUrl);
    if (!(__indexOf.call(items, 'css') >= 0)) {
      fse.copySync("" + nBaseurl + "project-folders/css/", "" + this.baseUrl + "css");
    }
    if (!(_ref = "" + this.projectName + "-pages", __indexOf.call(items, _ref) >= 0)) {
      fromDir = "" + nBaseurl + "./project-folders/docit-pages/";
      fse.copySync(fromDir, "" + this.baseUrl + "docit-pages");
    }
    fromFile = "" + nBaseurl + "./index.html";
    toFile = "" + this.baseUrl + "index.html";
    return fs.createReadStream(fromFile).pipe(fs.createWriteStream(toFile));
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
      this.relative(function(err, files) {
        return console.log(files);
      });
      this.on('added', function(filepath) {
        var file, map;
        file = h.splitFilePath(filepath);
        if (!(file.extension === 'html')) {
          return;
        }
        map = h.addPageToMap({
          filepath: filepath,
          map: it.map
        });
        it.writeMap(map);
        if (file.extension === '') {
          return it.watcher.add(filepath);
        }
      });
      this.on('deleted', function(filepath) {
        var file, map;
        file = h.splitFilePath(filepath);
        if (!(file.extension === 'html')) {
          return;
        }
        map = h.removePageFromMap({
          filepath: filepath,
          map: it.map
        });
        return it.writeMap(map);
      });
      this.on('renamed', function(filepath, oldpath) {
        var file, map, options;
        file = h.splitFilePath(filepath);
        if (!(file.extension === 'html')) {
          return;
        }
        if (filepath.match(/\.trash/gi)) {
          map = h.removePageFromMap({
            filepath: oldpath,
            map: it.map
          });
          return it.writeMap(map);
        } else {
          options = {
            newPath: filepath,
            oldPath: oldpath,
            map: it.map
          };
          map = h.renamePageInMap(options);
          return it.writeMap(map);
        }
      });
      return this.on('all', function(e, filepath) {
        return console.log(e, filepath);
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

  DocIt.prototype.parsePageToJson = function(filepath) {
    var contents, file, json;
    file = h.splitFilePath(filepath);
    contents = fs.readFileSync(filepath);
    json = {};
    return h.parseHtmlToJson(contents.toString()).then(function(json) {
      var folder;
      json = json;
      folder = file.folder === 'docit-pages' ? '' : "" + file.folder + "/";
      console.log('folder', folder, file.folder, file.fileName);
      if (folder) {
        console.log('create dir', folder);
        fs.mkdirSync("./json-pages/" + folder);
      }
      return jf.writeFileSync("./json-pages/" + folder + file.fileName + ".json", json);
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
