#!/usr/bin/env node

var concat, gaze, jade, pName, pagFiles, pagesFolder, splitFilePath, watch;

jade = require("jade");

watch = require("watch");

gaze = require("gaze");

concat = require("concat");

pName = "docit";

pagesFolder = "../" + pName + "-pages/";

pagFiles = pagesFolder + "**/*.jade";

splitFilePath = function(p) {
  var fileName, path, pathArr, pathStr;
  pathArr = p.split("/");
  fileName = pathArr[pathArr.length - 1];
  path = pathArr.slice(0, pathArr.length - 1);
  pathStr = path.join("/") + "/";
  return {
    path: pathStr,
    fileName: fileName
  };
};

gaze(pagFiles, function(err, watcher) {
  this.on("changed", function(filepath) {
    var file;
    file = splitFilePath(filepath);
    console.log(file);
    return console.log(filepath + " was changed");
  });
  this.on("added", function(filepath) {
    return console.log(filepath + " was added");
  });
  return this.on("deleted", function(filepath) {
    return console.log(filepath + " was deleted");
  });
});

console.log("it works");
