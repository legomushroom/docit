#!/usr/bin/env node

var Main, gaze, jade, jf, livereload;

jade = require("jade");

gaze = require("gaze");

jf = require('jsonfile');

livereload = require('livereload');

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
    this.removePage = this.removePage.bind(this);
    return this.generateJSONMap = this.generateJSONMap.bind(this);
  };

  Main.prototype.createLivereloadServer = function() {
    return this.server = livereload.createServer();
  };

  Main.prototype.listenPages = function() {
    var it;
    it = this;
    return gaze(this.pagFiles, function(err, watcher) {
      this.relative(it.generateJSONMap);
      this.on('changed', it.compilePage);
      this.on('added', it.compilePage);
      return this.on('deleted', it.removePage);
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

  Main.prototype.removePage = function(filepath) {};

  Main.prototype.generateJSONMap = function(err, files) {
    var map;
    map = {};
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
        return map[folder] = items;
      };
    })(this));
    return jf.writeFile('pages.json', map, function(err) {
      if (err) {
        return console.error('could not write to pages.json');
      }
    });
  };

  Main.prototype.isFolder = function(path) {
    return path.substr(path.length - 1) === '/';
  };

  Main.prototype.getFolder = function(path) {
    var folder, pathArr;
    pathArr = path.split('/');
    folder = pathArr[pathArr.length - 2];
    return folder;
  };

  Main.prototype.splitFilePath = function(p) {
    var extension, file, fileName, path, pathArr, pathStr;
    pathArr = p.split("/");
    fileName = pathArr[pathArr.length - 1];
    extension = fileName.split('.');
    extension = extension[extension.length - 1];
    path = pathArr.slice(0, pathArr.length - 1);
    pathStr = path.join("/") + "/";
    return file = {
      path: pathStr,
      fileName: fileName,
      extension: extension
    };
  };

  return Main;

})();

new Main;

console.log("it works");
