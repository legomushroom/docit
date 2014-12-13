var DocIt, fs, fse, gaze, jade, jf, livereload, mkdirp, shell,
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

DocIt = (function() {
  function DocIt(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.createFolders();
    !this.o.isLivereloadLess && this.createLivereloadServer();
    this.listenPages();
    return this;
  }

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

  DocIt.prototype.vars = function() {
    this.isDev = this.o.isDev;
    this.projectName = "docit";
    this.pagesFolder = "./" + this.projectName + "-pages";
    this.pageFiles = "" + this.pagesFolder + "/**/*.html";
    this.removePageFromMap = this.removePageFromMap.bind(this);
    return this.generateJSONMap = this.generateJSONMap.bind(this);
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
      this.relative((function(_this) {
        return function(err, files) {
          var map;
          map = it.generateJSONMap(err, files);
          return _this.writeMap(map);
        };
      })(this));
      this.on('added', (function(_this) {
        return function(filepath) {
          var map;
          map = it.addPageToMap({
            filepath: filepath,
            map: _this.map
          });
          return _this.writeMap(map);
        };
      })(this));
      this.on('deleted', it.removePageFromMap);
      this.on('renamed', function(filepath, oldpath) {
        if (filepath.match(/\.trash/gi)) {
          this.writeMap(it.removePageFromMap({
            filepath: oldpath,
            map: this.map
          }));
        } else {
          it.renamePageInMap(filepath, oldpath);
          watcher.close();
          it.listenPages();
        }
        return true;
      });
      return this.on('all', function(e, filepath) {
        return console.log('all', e);
      });
    });
  };

  DocIt.prototype.renamePageInMap = function(o) {
    var folder, i, map, newFile, newFilePath, newFolder, oldFile, oldFilePath, oldFolder, page, _i, _len;
    newFilePath = o.newPath;
    oldFilePath = o.oldPath;
    map = o.map;
    newFile = this.splitFilePath(newFilePath);
    newFolder = this.getFolder(newFilePath);
    oldFile = this.splitFilePath(oldFilePath);
    oldFolder = this.getFolder(oldFilePath);
    folder = map[oldFolder];
    for (i = _i = 0, _len = folder.length; _i < _len; i = ++_i) {
      page = folder[i];
      if (page === oldFile.fileName) {
        folder[i] = newFile.fileName;
      }
    }
    return map;
  };

  DocIt.prototype.addPageToMap = function(o) {
    var file, fileName, filepath, folder, map;
    map = o.map;
    filepath = o.filepath;
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    folder = map[folder];
    fileName = file.fileName;
    if (__indexOf.call(folder, fileName) >= 0) {
      return;
    } else {
      folder.push(fileName);
    }
    return map;
  };

  DocIt.prototype.removePageFromMap = function(o) {
    var file, filepath, folder, map, newPages, pages;
    map = o.map;
    filepath = o.filepath;
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    newPages = [];
    pages = map[folder];
    pages.forEach(function(page) {
      var fileName;
      fileName = file.fileName.replace('.html', '');
      if (page !== fileName) {
        return newPages.push(page);
      }
    });
    map[folder] = newPages;
    return map;
  };

  DocIt.prototype.writeMap = function(map) {
    this.map = map;
    return jf.writeFile("./pages.json", map, (function(_this) {
      return function(err) {
        if (err) {
          return console.error('could not write to pages.json');
        } else {
          return _this.server.refresh('pages.json');
        }
      };
    })(this));
  };

  DocIt.prototype.generateJSONMap = function(err, files) {
    var map;
    map = {};
    Object.keys(files).forEach((function(_this) {
      return function(key) {
        var folder, items;
        if (key === ("" + _this.pagesFolder + "/partials/") || key === './') {
          return;
        }
        folder = _this.getFolder(key);
        if (folder === ("" + _this.projectName + "-pages")) {
          folder = 'pages';
        }
        items = [];
        files[key].forEach(function(item) {
          if (!_this.isFolder(item)) {
            return items.push(item.replace('.html', ''));
          }
        });
        return map[folder] = items;
      };
    })(this));
    return map;
  };

  DocIt.prototype.isFolder = function(path) {
    return path.substr(path.length - 1) === '/';
  };

  DocIt.prototype.getFolder = function(path) {
    var folder, pathArr;
    pathArr = path.split('/');
    folder = pathArr[pathArr.length - 2];
    if (folder === ("" + this.projectName + "-pages")) {
      return 'pages';
    } else {
      return folder;
    }
  };

  DocIt.prototype.splitFilePath = function(p) {
    var extension, file, fileName, path, pathArr, pathStr, regex;
    pathArr = p.split("/");
    fileName = pathArr[pathArr.length - 1];
    extension = fileName.split('.');
    extension = extension[extension.length - 1];
    path = pathArr.slice(0, pathArr.length - 1);
    pathStr = path.join("/") + "/";
    regex = new RegExp("\." + extension, 'gi');
    return file = {
      path: pathStr,
      fileName: fileName.replace(regex, ''),
      extension: extension
    };
  };

  DocIt.prototype.stop = function() {};

  return DocIt;

})();

module.exports = DocIt;
