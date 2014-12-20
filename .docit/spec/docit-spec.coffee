util = require 'util'
util.print '\u001b[2J\u001b[0;0H'
process.on 'uncaughtException',(error)->console.log(error.stack)

console.log '--------------------- Tests ---------------------'

DocIt       = require '../src/docit'
h           = require '../src/helpers'
testHelpers = require './test-helpers'
fs          = require 'fs'
fse         = require 'fs-extra'
jf          = require 'jsonfile'
# fswin       = require 'fswin'

testHelpers.cleanProject()
docit = new DocIt
  isLivereloadLess: true
  isDev: true

describe 'docit', ->
  describe 'initialization', ->
    it 'should create folders and files if needed', ->
      items           = fs.readdirSync '../'
      expect('css' in items).toBe          true
      expect('docit-pages' in items).toBe  true
      expect('index.html'  in items).toBe  true
    
    # TODO
    # it 'should be sure that .docit folder is hidden on windows', ->
    #   attr = fswin.getAttributeSync '../docit'
    #   console.log attr

  describe 'helpers methods ->', ->
    describe 'parseHtmlToJson method ->', ->
      it 'should return a promise', ->
        expect(h.parseHtmlToJson('').then).toBeDefined()

      it 'should parse html to json', (done)->
        html = "
          <card>
            <name>Button</name>
            <tags>buttons, press, thin shadow </tags>
            <hash>af877455f5f70d21e4f999220c5c0e7f</hash>
            <div class=\"button\"></div>
          </card>
          <card>
            <name>icon</name>
            <tags>icons, social, facebook</tags>
            <hash>0380d4f55cd58c7717e4dc4662b38f99</hash>
            <div class=\"icon\">
              <p>whis is</p>
              <p>an icon</p>
            </div>
          </card>
        "
        obj1 =
          name: 'Button'
          hash: 'af877455f5f70d21e4f999220c5c0e7f'
          tags: ['buttons', 'press', 'thin shadow']
          html: '<div class=\"button\"></div>'
        string1 = JSON.stringify(obj1)
        obj2 =
          name: 'icon'
          hash: '0380d4f55cd58c7717e4dc4662b38f99'
          tags: ['icons','social','facebook']
          html: '<div class=\"icon\"> <p>whis is</p> <p>an icon</p> </div>'
        string2 = JSON.stringify(obj2)
        expectedString = "[#{string1},#{string2}]"

        h.parseHtmlToJson(html).then (json)->
          expect(JSON.stringify(json)).toBe(expectedString)
          done()

    describe 'splitFilePath method ->', ->
      it 'should split path to pieces', ->
        file = h.splitFilePath './docit-pages/forms/form.html'
        expect(file.fileName).toBe('form')
        expect(file.extension).toBe('html')
        expect(file.path).toBe('./docit-pages/forms/')
        expect(file.folder).toBe('forms')
    describe 'removeSon method ->', ->
      it 'should not throw', ->
        expect(-> h.removeSon 'no such file name').not.toThrow()
    describe 'isFolder method', ->
      it 'check if passed path ends with "/"', ->
        path1 = '/user/bin/pages/'
        path2 = '/user/bin/pages'
        isFolder1 = h.isFolder path1
        isFolder2 = h.isFolder path2
        expect(isFolder1).toBe true
        expect(isFolder2).toBe false
    describe 'getFolder method', ->
      it 'should return "pages" if passed path is "docit-pages"', ->
        path = '/user/bin/docit-pages/buttons.html'
        folder = h.getFolder path
        expect(folder).toBe 'pages'
        path = '/user/bin/docit-pages/about-page/buttons.html'
        folder = h.getFolder path
        expect(folder).toBe 'about-page'
    describe 'addPageToMap method', ->
      it 'should add page name to map', ->
        path = '/user/bin/docit-pages/colors.html'
        map = {pages:[]}
        map = h.addPageToMap { map: map, filepath: path }
        expect(JSON.stringify(map)).toBe '{"pages":["colors"]}'
      it 'should return a map if file is in folder already', ->
        path = '/user/bin/docit-pages/colors.html'
        map = {pages:['colors']}
        map = h.addPageToMap { map: map, filepath: path }
        expect(JSON.stringify(map)).toBe '{"pages":["colors"]}'

      it 'should return a map if file is in partials folder', ->
        path = '/user/bin/docit-pages/partials/colors.html'
        map = {pages:[]}
        map = h.addPageToMap { map: map, filepath: path }
        expect(JSON.stringify(map)).toBe '{"pages":[]}'

    describe 'removePageFromMap method', ->
      it 'should remove page name from map', ->
        path = '/user/bin/docit-pages/type.html'
        map = {pages:['type','colors']}
        map = h.removePageFromMap { map: map, filepath: path }
        expect(JSON.stringify(map)).toBe '{"pages":["colors"]}'
    describe 'renamePageInMap method', ->
      it 'should rename page name in map', ->
        oldPath = '/user/bin/docit-pages/type2.html'
        newPath = '/user/bin/docit-pages/type.html'
        map = {pages:['type2','forms']}
        options = { map: map, oldPath: oldPath, newPath: newPath }
        map = h.renamePageInMap options
        expect(JSON.stringify(map)).toBe '{"pages":["type","forms"]}'
      it 'should add page name if folder is empty', ->
        oldPath = '/user/bin/docit-pages/type2.html'
        newPath = '/user/bin/docit-pages/type.html'
        map = {pages:[]}
        options = { map: map, oldPath: oldPath, newPath: newPath }
        map = h.renamePageInMap options
        expect(JSON.stringify(map)).toBe '{"pages":["type"]}'
      it 'should add page name if folder doesn\'t contain the page name ', ->
        oldPath = '/user/bin/docit-pages/type2.html'
        newPath = '/user/bin/docit-pages/type.html'
        map = {pages:['buttons']}
        options = { map: map, oldPath: oldPath, newPath: newPath }
        map = h.renamePageInMap options
        expect(JSON.stringify(map)).toBe '{"pages":["buttons","type"]}'
    describe 'parseFolderToMap method', ->
      it 'should parse file and folders to map object', ->
        files = [
          '/user/bin/docit-pages/type.html'
          '/user/bin/docit-pages/partials/icon.jade'
          '/user/bin/docit-pages/about-us/header.html'
          '/user/bin/docit-pages/about-us/footer.html'
        ]
        map = h.parseFolderToMap files
        filesString = '{"pages":["type"],"about-us":["header","footer"]}'
        expect(JSON.stringify(map)).toBe filesString
      it 'should add only .html files to map', ->
        files = [
          '/user/bin/docit-pages/type.html'
          '/user/bin/docit-pages/.DS_store'
        ]
        map = h.parseFolderToMap files
        filesString = '{"pages":["type"]}'
        expect(JSON.stringify(map)).toBe filesString
      it 'should warn if more the 1 level nested', ->
        files = [
          '/user/bin/docit-pages/type.html'
          '/user/bin/docit-pages/partials/icon.jade'
          '/user/bin/docit-pages/about-us/header.html'
          '/user/bin/docit-pages/about-us/another-folder/footer.html'
        ]
        spyOn console, 'warn'
        map = h.parseFolderToMap(files)
        expect(console.warn).toHaveBeenCalled()
        filesString = '{"pages":["type"],"about-us":["header","footer"]}'
        expect(JSON.stringify(map)).toBe filesString
    describe 'writeMap method', ->
      it 'should write passed map to package.json file', ->
        files = [
          '/user/bin/docit-pages/buttons.html'
          '/user/bin/docit-pages/partials/icon.jade'
        ]
        map = h.parseFolderToMap files
        docit.writeMap map
        pages = jf.readFileSync('pages.json')
        expect(JSON.stringify(pages)).toBe('{"pages":["buttons"]}')
  

  describe 'file listeners ->', ()->
    describe 'html files ->', ()->
      it 'should generate map on file add', (done)->
        fs.writeFileSync '../docit-pages/colors.html', '<h2>Heading</h2>'
        setTimeout ->
          mapStr = JSON.stringify(docit.map)
          expect(mapStr).toBe('{"pages":["buttons","colors"]}')
          pages = jf.readFileSync('./pages.json')
          expect(JSON.stringify(pages)).toBe('{"pages":["buttons","colors"]}')
          done()
        , 1000
      it 'should generate map on file delete', (done)->
        fs.unlink '../docit-pages/colors.html'
        setTimeout ->
          pages = jf.readFileSync('./pages.json')
          expect(JSON.stringify(docit.map)).toBe('{"pages":["buttons"]}')
          expect(JSON.stringify(pages)).toBe('{"pages":["buttons"]}')
          done()
        , 1000

      # it 'should generate map on file add', (done)->

      # describe 'page to json parsing', ->
      #   it 'should generate json file on html file add', (done)->
      #     dir = '../docit-pages/forms'
      #     fs.mkdirSync dir
      #     fs.writeFileSync "#{dir}/icons.html", '<card>
      #           <name>Button</name>
      #           <tags>buttons, press, thin shadow </tags>
      #           <hash>af877455f5f70d21e4f999220c5c0e7f</hash>
      #           <div class=\"button\"></div>
      #         </card>
      #         <card>
      #           <name>icon</name>
      #           <tags>icons, social, facebook</tags>
      #           <hash>0380d4f55cd58c7717e4dc4662b38f99</hash>
      #           <div class=\"icon\">
      #             <p>whis is</p>
      #             <p>an icon</p>
      #           </div>
      #         </card>'
      #     obj1 =
      #       name: 'Button'
      #       hash: 'af877455f5f70d21e4f999220c5c0e7f'
      #       tags: ['buttons', 'press', 'thin shadow']
      #       html: '<div class=\"button\"></div>'
      #     string1 = JSON.stringify(obj1)
      #     obj2 =
      #       name: 'icon'
      #       hash: '0380d4f55cd58c7717e4dc4662b38f99'
      #       tags: ['icons','social','facebook']
      #       html: '<div class=\"icon\"> <p>whis is</p> <p>an icon</p> </div>'
      #     string2 = JSON.stringify(obj2)
      #     expectedString = "[#{string1},#{string2}]"

      #     setTimeout =>
            

      #       icons = jf.readFileSync('./json-pages/forms/icons.json')
      #       expect(JSON.stringify(icons)).toBe(expectedString)
      #       done()
      #     , 1000

      #   expect()

  describe 'jade files ->', ()->
    it 'should compile jade files on add', (done)->
      fs.writeFileSync '../docit-pages/type.jade', 'h1 Heading from spec'
      setTimeout ->
        html = ''
        expect(->
          html = fs.readFileSync  '../docit-pages/type.html'
          ).not.toThrow()
        expect(html.toString()).toBe('<h1>Heading from spec</h1>')
        done()
      , 1000
    it 'should compile jade files on change', (done)->
      fs.writeFileSync '../docit-pages/type.jade', 'h1 Heading from spec #2'
      setTimeout ->
        htmlBuffer = fs.readFileSync  '../docit-pages/type.html'
        expect(htmlBuffer.toString()).toBe('<h1>Heading from spec #2</h1>')
        done()
      , 1000
    it 'should remove html file if jade file was removed(removeSon)', (done)->
      filePath = '../docit-pages/type'
      fs.unlinkSync "#{filePath}.jade"
      setTimeout ->
        expect(-> fs.readFileSync "#{filePath}.html").toThrow()
        done()
      , 1000
    it 'should rename html file if jade file was renamed', (done)->
      fs.writeFileSync '../docit-pages/forms-1.jade', 'h1 Heading'
      oldFile = '../docit-pages/forms-1.jade'
      newFile = '../docit-pages/forms.jade'
      fs.renameSync oldFile, newFile
      setTimeout ->
        expect(-> fs.readFileSync '../docit-pages/forms.html').not.toThrow()
        done()
      , 1000








