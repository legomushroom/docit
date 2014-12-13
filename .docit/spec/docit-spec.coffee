util = require 'util'
util.print '\u001b[2J\u001b[0;0H'

console.log '--------------------- Tests ---------------------'

DocIt       = require '../src/docit'
testHelpers = require './test-helpers'
fs          = require 'fs'
jf          = require 'jsonfile'

testHelpers.cleanProject()
docit = new DocIt
  isLivereloadLess: true
  isDev: true

describe 'docit', ->
  describe 'initialization', ->
    it 'should create folders and files if needed', ->
      items           = fs.readdirSync '../'
      # pagesFolder     = fs.readdirSync '../docit-pages/'
      # cssFolder       = fs.readdirSync '../css'
      # partialsFolder  = fs.readdirSync '../docit-pages/partials/'
      expect('css' in items).toBe                   true
      expect('docit-pages'  in items).toBe          true
      # expect('buttons.html' in pagesFolder).toBe    true
      # expect('partials'     in pagesFolder).toBe    true
      # expect('buttons.css'  in cssFolder).toBe      true
      # expect('icon.jade'    in partialsFolder).toBe true
  describe 'methods', ->
    describe 'generateJSONMap method', ->
      it 'should return generated map', ->
        files = { './': [ 'docit-pages/' ], 'docit-pages/': [ 'buttons.html' ] }
        map = docit.generateJSONMap null, files
        expect(JSON.stringify(map)).toBe('{"pages":["buttons"]}')
    describe 'writeMap method', ->
      it 'should write passed map to package.json file', ->
        files = { './': [ 'docit-pages/' ], 'docit-pages/': [ 'colors.html' ] }
        map = docit.generateJSONMap null, files
        docit.writeMap map
        pages = jf.readFileSync('../pages.json')
        expect(JSON.stringify(pages)).toBe('{"pages":["colors"]}')
        expect(JSON.stringify(docit.map)).toBe('{"pages":["colors"]}')
    describe 'isFolder method', ->
      it 'check if passed path ends with "/"', ->
        path1 = '/user/bin/pages/'
        path2 = '/user/bin/pages'
        isFolder1 = docit.isFolder path1
        isFolder2 = docit.isFolder path2
        expect(isFolder1).toBe true
        expect(isFolder2).toBe false
    describe 'getFolder method', ->
      it 'should return "pages" if passed path is "docit-pages"', ->
        path = '/user/bin/docit-pages/buttons.html'
        folder = docit.getFolder path
        expect(folder).toBe 'pages'



