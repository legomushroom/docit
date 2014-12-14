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
      expect('css' in items).toBe                   true
      expect('docit-pages'  in items).toBe          true
  describe 'methods', ->
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
        path = '/user/bin/docit-pages/about-page/buttons.html'
        folder = docit.getFolder path
        expect(folder).toBe 'about-page'
    describe 'addPageToMap method', ->
      it 'should add page name to map', ->
        path = '/user/bin/docit-pages/colors.html'
        map = {pages:[]}
        map = docit.addPageToMap { map: map, filepath: path }
        expect(JSON.stringify(map)).toBe '{"pages":["colors"]}'
    describe 'removePageFromMap method', ->
      it 'should remove page name from map', ->
        path = '/user/bin/docit-pages/type.html'
        map = {pages:['type','colors']}
        map = docit.removePageFromMap { map: map, filepath: path }
        expect(JSON.stringify(map)).toBe '{"pages":["colors"]}'
    describe 'renamePageInMap method', ->
      it 'should remove page name from map', ->
        oldPath = '/user/bin/docit-pages/type2.html'
        newPath = '/user/bin/docit-pages/type.html'
        map = {pages:['type2','forms']}
        options = { map: map, oldPath: oldPath, newPath: newPath }
        map = docit.renamePageInMap options
        expect(JSON.stringify(map)).toBe '{"pages":["type","forms"]}'
    describe 'parseFolderToMap method', ->
      it 'should parse file and folders to map object', ->
        files = [
          '/user/bin/docit-pages/type.html'
          '/user/bin/docit-pages/partials/icon.jade'
          '/user/bin/docit-pages/about-us/header.html'
          '/user/bin/docit-pages/about-us/footer.html'
        ]
        map = docit.parseFolderToMap files
        filesString = '{"pages":["type"],"about-us":["header","footer"]}'
        expect(JSON.stringify(map)).toBe filesString
      it 'should throw if more the 1 level nested', ->
        files = [
          '/user/bin/docit-pages/type.html'
          '/user/bin/docit-pages/partials/icon.jade'
          '/user/bin/docit-pages/about-us/header.html'
          '/user/bin/docit-pages/about-us/another-folder/footer.html'
        ]
        spyOn console, 'warn'
        map = docit.parseFolderToMap(files)
        expect(console.warn).toHaveBeenCalled()
        filesString = '{"pages":["type"],"about-us":["header","footer"]}'
        expect(JSON.stringify(map)).toBe filesString
    describe 'writeMap method', ->
      it 'should write passed map to package.json file', ->
        files = [
          '/user/bin/docit-pages/buttons.html'
          '/user/bin/docit-pages/partials/icon.jade'
        ]
        map = docit.parseFolderToMap files
        docit.writeMap map
        pages = jf.readFileSync('pages.json')
        expect(JSON.stringify(pages)).toBe('{"pages":["buttons"]}')
  describe 'file listeners', ->
    it 'should generate map on file add', ->
      fs.writeFileSync '../docit-pages/type.html', '<h2>Heading</h2>'




