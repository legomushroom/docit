#!/usr/bin/env node

var jade  = require('jade');
var watch = require('watch');
var gaze  = require('gaze');

var pName = 'docit';
var pagesFolder = '../' + pName + '-pages/';
var pagFiles    = pagesFolder + '**/*.jade'

// Watch all .js files/dirs in process.cwd()
gaze(pagFiles, function(err, watcher) {
  // Files have all started watching
  // watcher === this

  // Get all watched files
  this.watched(function(watched) {
    console.log(watched);
  });

  // On file changed
  this.on('changed', function(filepath) {
    console.log(filepath + ' was changed');
  });

  // On file added
  this.on('added', function(filepath) {
    console.log(filepath + ' was added');
  });

  // On file deleted
  this.on('deleted', function(filepath) {
    console.log(filepath + ' was deleted');
  });

  // On changed/added/deleted
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
  });

  // Get watched files with relative paths
  this.relative(function(err, files) {
    console.log(files);
  });
});



console.log('it works');
