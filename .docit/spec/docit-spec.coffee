console.log '--------------------- Tests ---------------------'

DocIt       = require '../src/docit'
testHelpers = require './test-helpers'
fs          = require 'fs'

# testHelpers.cleanProject()
docit = new DocIt isLivereloadLess: true


describe 'docit', ->
  describe 'initialization', ->
    it 'should create folders and files if needed', ->
      items           = fs.readdirSync '../'
      pagesFolder     = fs.readdirSync '../docit-pages/'
      cssFolder       = fs.readdirSync '../css'
      partialsFolder  = fs.readdirSync '../docit-pages/partials/'
      expect('css' in items).toBe                   true
      expect('docit-pages'  in items).toBe          true
      expect('buttons.html' in pagesFolder).toBe    true
      expect('partials'     in pagesFolder).toBe    true
      expect('buttons.css'  in cssFolder).toBe      true
      expect('icon.jade'    in partialsFolder).toBe true
