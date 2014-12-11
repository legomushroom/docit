
fs = require 'fs'
rimraf = require 'rimraf'

class TestHelpers
  cleanProject:->
    rimraf.sync '../docit-pages', (err)-> console.log err
    rimraf.sync '../css', (err)-> console.log err
    fs.unlink '../index.html'

module.exports = new TestHelpers