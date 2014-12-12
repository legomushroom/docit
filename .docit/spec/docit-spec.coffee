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
  describe 'compilation', ->
    it 'should write pages json map on html file change', ->
      jf.writeFileSync '../pages.json', { pages: [] }
      fs.writeFileSync '../docit-pages/colors.html', ''

      pages = jf.readFileSync('../pages.json')
      console.log pages

      expect(JSON.stringify(pages)).toBe('{"pages":["colors"]}')




