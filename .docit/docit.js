#!/usr/bin/env node

var Main, fs, gaze, jade, jf, livereload;

jade = require('jade');

gaze = require('gaze');

jf = require('jsonfile');

livereload = require('livereload');

fs = require('fs');

Main = (function() {
  function Main(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.createLivereloadServer();
    this.listenPages();
  }

  Main.prototype.vars = function() {
    this.projectName = "docit";
    this.pagesFolder = "../" + this.projectName + "-pages";
    this.pagFiles = "" + this.pagesFolder + "/**/*.jade";
    this.compilePage = this.compilePage.bind(this);
    this.removePageFromMap = this.removePageFromMap.bind(this);
    return this.generateJSONMap = this.generateJSONMap.bind(this);
  };

  Main.prototype.createLivereloadServer = function() {
    return this.server = livereload.createServer({
      port: 41000
    });
  };

  Main.prototype.listenPages = function() {
    var it;
    it = this;
    return gaze(this.pagFiles, function(err, watcher) {
      this.relative(it.generateJSONMap);
      this.on('changed', it.compilePage);
      this.on('added', function(filepath) {
        it.addPageToMap(filepath);
        return it.compilePage(filepath);
      });
      return this.on('deleted', it.removePageFromMap);
    });
  };

  Main.prototype.compilePage = function(filepath) {
    var file;
    file = this.splitFilePath(filepath);
    if (!file.path.match(/\/partials\//)) {
      jade.renderFile(filepath);
      return this.server.refresh(filepath);
    }
  };

  Main.prototype.addPageToMap = function(filepath, isRefresh) {
    var file, folder;
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    this.map[folder].push(file.fileName);
    return this.writeMap();
  };

  Main.prototype.removePageFromMap = function(filepath) {
    var file, folder, newPages, pages;
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    fs.unlink(filepath.replace('.jade', '.html'));
    newPages = [];
    pages = this.map[folder];
    pages.forEach(function(page) {
      if (page !== file.fileName) {
        return newPages.push(page);
      }
    });
    this.map[folder] = newPages;
    return this.writeMap();
  };

  Main.prototype.writeMap = function() {
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

  Main.prototype.generateJSONMap = function(err, files) {
    this.map = {};
    Object.keys(files).forEach((function(_this) {
      return function(key) {
        var folder, items;
        if (key === ("" + _this.pagesFolder + "/partials/")) {
          return;
        }
        folder = _this.getFolder(key);
        if (folder === ("" + _this.projectName + "-pages")) {
          folder = 'pages';
        }
        items = [];
        files[key].forEach(function(item) {
          if (!_this.isFolder(item)) {
            return items.push(item.replace('.jade', ''));
          }
        });
        return _this.map[folder] = items;
      };
    })(this));
    return this.writeMap();
  };

  Main.prototype.isFolder = function(path) {
    return path.substr(path.length - 1) === '/';
  };

  Main.prototype.getFolder = function(path) {
    var folder, pathArr;
    pathArr = path.split('/');
    folder = pathArr[pathArr.length - 2];
    if (folder === ("" + this.projectName + "-pages")) {
      return 'pages';
    } else {
      return folder;
    }
  };

  Main.prototype.splitFilePath = function(p) {
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

  return Main;

})();

new Main;

console.log("it works");
