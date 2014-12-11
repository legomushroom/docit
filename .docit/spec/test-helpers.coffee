
fs = require 'fs'
rimraf = require 'rimraf'

class TestHelpers
  cleanProject:->
    rimraf.sync '../docit-pages', (err)-> console.log err
    rimraf.sync '../css', (err)-> console.log err
    items = fs.readdirSync '../'
    if 'index.html' in items
      fs.unlink '../index.html', (err)-> console.log err

module.exports = new TestHelpers