#!/usr/bin/env node

var Main, gaze, jade;

jade = require("jade");

gaze = require("gaze");

Main = (function() {
  function Main(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.listenPages();
  }

  Main.prototype.vars = function() {
    this.projectName = "docit";
    this.pagesFolder = "../" + this.projectName + "-pages";
    return this.pagFiles = "" + this.pagesFolder + "/**/*.jade";
  };

  Main.prototype.listenPages = function() {
    var it;
    it = this;
    return gaze(this.pagFiles, function(err, watcher) {
      this.on('changed', function(filepath) {
        var file;
        file = it.splitFilePath(filepath);
        jade.renderFile(filepath);
        return console.log(filepath + ' was changed');
      });
      this.on('added', function(filepath) {
        return console.log(filepath + ' was added');
      });
      this.on('deleted', function(filepath) {
        return console.log(filepath + ' was deleted');
      });
      return this.on('all', function(filepath) {});
    });
  };

  Main.prototype.splitFilePath = function(p) {
    var file, fileName, path, pathArr, pathStr;
    pathArr = p.split("/");
    fileName = pathArr[pathArr.length - 1];
    path = pathArr.slice(0, pathArr.length - 1);
    pathStr = path.join("/") + "/";
    return file = {
      path: pathStr,
      fileName: fileName
    };
  };

  return Main;

})();

new Main;

console.log("it works");
