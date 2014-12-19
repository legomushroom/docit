jade = require 'jade'
gaze = require 'gaze'
jf   = require 'jsonfile'
fs   = require 'fs'
fse  = require 'fs-extra'
shell = require 'shell'
mkdirp     = require 'mkdirp'
livereload = require 'livereload'
shell      = require 'shelljs/global'
recursive  = require  'readdir-recursive'

# trim = require 'trim'

h = require './helpers'

# TODO
#   BUG: it doesnt react on new folder/file
#   search
#   element page
#   regression testing
#   document + website

class DocIt
  constructor:(@o={})->
    @vars()
    @createFolders()
    @getProjectFiles()
    !@o.isLivereloadLess and @createLivereloadServer()
    @listenPages()
    @listenJadePages()
    return @
  vars:->
    @isDev = @o.isDev
    @projectName = "docit"
    @jsonFilePrefix = if @isDev then './' else '.docit/'
    # for testing purposes
    prefix = if @isDev then '../' else ''
    @pagesFolder = "#{prefix}#{@projectName}-pages"
    @pageFiles    = "#{@pagesFolder}/**/*"
    @pageFilesJade= "#{@pagesFolder}/**/*"
  createFolders:->
    nBaseurl = if @isDev then './' else '.docit/'
    @baseUrl  = if @isDev then '../' else './'
    items = fs.readdirSync @baseUrl
    if !('css' in items)
      fse.copySync "#{nBaseurl}project-folders/css/", "#{@baseUrl}css"
    if !("#{@projectName}-pages" in items)
      fromDir = "#{nBaseurl}./project-folders/docit-pages/"
      fse.copySync fromDir, "#{@baseUrl}docit-pages"

    fromFile = "#{nBaseurl}./index.html"
    toFile   = "#{@baseUrl}index.html"
    fs.createReadStream(fromFile).pipe(fs.createWriteStream(toFile))
    # fse.copySync fromDir, "#{@baseUrl}"
  getProjectFiles:->
    files = recursive.fileSync "#{@baseUrl}docit-pages/"
    map = h.parseFolderToMap files
    @writeMap map
  createLivereloadServer:-> @server = livereload.createServer({ port: 41000 })
  listenPages:->
    it = @
    gaze @pageFiles, (err, watcher) ->
      it.watcher = watcher
      @relative (err, files)-> console.log files
      @on 'added',   (filepath)->
        file = h.splitFilePath filepath
        return if !(file.extension is 'html')
        map = h.addPageToMap filepath: filepath, map: it.map
        it.writeMap map

        if file.extension is ''
          it.watcher.add filepath

      @on 'deleted', (filepath)->
        file = h.splitFilePath filepath
        return if !(file.extension is 'html')
        map = h.removePageFromMap filepath: filepath, map: it.map
        it.writeMap map
      @on 'renamed', (filepath, oldpath)->
        file = h.splitFilePath filepath
        return if !(file.extension is 'html')
        if filepath.match /\.trash/gi
          map = h.removePageFromMap filepath: oldpath, map: it.map
          it.writeMap map
        else
          options = newPath: filepath, oldPath: oldpath, map: it.map
          map = h.renamePageInMap options
          it.writeMap map
      
      @on 'all', (e, filepath)->
        console.log e, filepath

  listenJadePages:->
    it = @
    gaze @pageFilesJade, (err, watcher) ->
      it.watcherJade = watcher
      @on 'added',   (filepath)->
        if filepath.match /\.jade/gi then h.compilePage filepath
      @on 'changed', (filepath)->
        if filepath.match /\.jade/gi then h.compilePage filepath
      @on 'deleted', (filepath)->
        if filepath.match /\.jade/gi then h.removeSon filepath
      true

  parsePageToJson:(filepath)->
    file = h.splitFilePath filepath
    contents = fs.readFileSync filepath

    json = {}
    h.parseHtmlToJson(contents.toString())
      .then (json)->
        json = json
        folder = if file.folder is 'docit-pages' then '' else "#{file.folder}/"

        console.log 'folder', folder, file.folder, file.fileName
        if folder
          console.log 'create dir', folder
          fs.mkdirSync "./json-pages/#{folder}"
        jf.writeFileSync  "./json-pages/#{folder}#{file.fileName}.json", json

    # console.log file

  writeMap:(map)->
    @map = map
    jf.writeFileSync "#{@jsonFilePrefix}pages.json", map
    @server?.refresh('#{@jsonFilePrefix}pages.json')
  
# new DocIt
module.exports = DocIt


