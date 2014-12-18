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

# trim = require 'trim' REMOVE

h = require './helpers'

# TODO
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
    @pageFiles    = "#{@pagesFolder}/**/*.html"
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
      @on 'added',   (filepath)->
        map = h.addPageToMap filepath: filepath, map: it.map
        it.writeMap map
      @on 'deleted', (filepath)->
        map = h.removePageFromMap filepath: filepath, map: it.map
        it.writeMap map
      @on 'renamed', (filepath, oldpath)->
        if filepath.match /\.trash/gi
          map = h.removePageFromMap filepath: oldpath, map: it.map
          it.writeMap map
        else
          options = newPath: filepath, oldPath: oldpath, map: it.map
          map = h.renamePageInMap options
          it.writeMap map
        true
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
  writeMap:(map)->
    @map = map
    jf.writeFileSync "#{@jsonFilePrefix}pages.json", map
    @server?.refresh('#{@jsonFilePrefix}pages.json')
  
# new DocIt
module.exports = DocIt


