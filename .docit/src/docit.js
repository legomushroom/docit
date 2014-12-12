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
    !this.o.isLivereloadLess && this.createLivereloadServer();
    this.listenPages();
    return this;
  }

  DocIt.prototype.createFolders = function() {
    var items, _ref;
    items = fs.readdirSync('../');
    if (!(__indexOf.call(items, 'css') >= 0)) {
      fse.copySync('./project-folders/css/', '../css');
    }
    if (!(_ref = "" + this.projectName + "-pages", __indexOf.call(items, _ref) >= 0)) {
      return fse.copySync('./project-folders/docit-pages/', '../docit-pages');
    }
  };

  DocIt.prototype.vars = function() {
    this.projectName = "docit";
    this.pagesFolder = "" + this.projectName + "-pages";
    this.pagFiles = "" + this.pagesFolder + "/**/*.html";
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
    return gaze(this.pagFiles, function(err, watcher) {
      this.relative(it.generateJSONMap);
      this.on('added', function(filepath) {
        console.log('add');
        return it.addPageToMap(filepath);
      });
      this.on('deleted', function(filepath) {
        console.log('delete');
        return it.removePageFromMap(filepath);
      });
      return this.on('renamed', function(filepath, oldpath) {
        if (filepath.match(/\.trash/gi)) {
          return it.removePageFromMap(oldpath);
        }
      });
    });
  };

  DocIt.prototype.addPageToMap = function(filepath, isRefresh) {
    var file, fileName, folder;
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    folder = this.map[folder];
    fileName = file.fileName;
    if (__indexOf.call(folder, fileName) >= 0) {
      return;
    } else {
      folder.push(fileName);
    }
    return this.writeMap();
  };

  DocIt.prototype.removePageFromMap = function(filepath) {
    var file, folder, newPages, pages;
    console.log(filepath);
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    newPages = [];
    pages = this.map[folder];
    console.log(pages);
    pages.forEach(function(page) {
      var fileName;
      fileName = file.fileName.replace('.html', '');
      if (page !== fileName) {
        return newPages.push(page);
      }
    });
    this.map[folder] = newPages;
    return this.writeMap();
  };

  DocIt.prototype.writeMap = function() {
    return jf.writeFile('pages.json', this.map, (function(_this) {
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
    this.map = {};
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
        return _this.map[folder] = items;
      };
    })(this));
    return this.writeMap();
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
