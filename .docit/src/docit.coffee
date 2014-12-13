jade = require 'jade'
gaze = require 'gaze'
jf   = require 'jsonfile'
fs   = require 'fs'
fse  = require 'fs-extra'
shell = require 'shell'

mkdirp     = require 'mkdirp'
livereload = require 'livereload'

shell      = require 'shelljs/global'

class DocIt
  constructor:(@o={})->
    @vars()
    @createFolders()
    !@o.isLivereloadLess and @createLivereloadServer()
    @listenPages()
    return @
  createFolders:->
    nBaseurl = if @isDev then './' else '.docit/'
    @baseUrl  = if @isDev then '../' else './'
    items = fs.readdirSync @baseUrl
    if !('css' in items)
      fse.copySync "#{nBaseurl}project-folders/css/", "#{@baseUrl}css"
    if !("#{@projectName}-pages" in items)
      fromDir = "#{nBaseurl}./project-folders/docit-pages/"
      fse.copySync fromDir, "#{@baseUrl}docit-pages"
  vars:->
    @isDev = @o.isDev
    @projectName = "docit"
    @pagesFolder = "./#{@projectName}-pages"
    @pageFiles    = "#{@pagesFolder}/**/*.html"
    @removePageFromMap  = @removePageFromMap.bind @
    @generateJSONMap    = @generateJSONMap.bind   @
  createLivereloadServer:-> @server = livereload.createServer({ port: 41000 })
  listenPages:->
    it = @
    gaze @pageFiles, (err, watcher) ->
      @relative (err,files)=>
        map = @generateJSONMap(err,files)

      @on 'added',   it.addPageToMap
      @on 'deleted', it.removePageFromMap
      @on 'renamed', (filepath, oldpath)->
        if filepath.match /\.trash/gi
          it.removePageFromMap oldpath
        else
          it.renamePageInMap filepath, oldpath
          watcher.close(); it.listenPages()
        true
      @on 'all', (e, filepath)->
        console.log 'all', e
  # compilePage:(filepath)->
  #   console.log filepath
  #   file = @splitFilePath(filepath)
  #   console.log file
  #   if !file.path.match /\/partials\//
  #     console.log 'yup'
  #     jade.renderFile(filepath)
  #     @server.refresh(filepath)
  renamePageInMap:(filepath, oldpath)->
    newFile   = @splitFilePath filepath
    newFolder = @getFolder filepath
    oldFile   = @splitFilePath oldpath
    oldFolder = @getFolder oldpath
    folder = @map[oldFolder]
    for page, i in folder
      if page is oldFile.fileName
        folder[i] = newFile.fileName
    @writeMap @map
  addPageToMap:(filepath, isRefresh)->
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"
    folder = @map[folder]; fileName = file.fileName
    if fileName in folder then return
    else folder.push fileName
    @writeMap @map
  removePageFromMap:(filepath)->
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"
    newPages = []
    pages = @map[folder]
    pages.forEach (page)->
      fileName = file.fileName.replace '.html', ''
      if page isnt fileName
        newPages.push page
    @map[folder] = newPages
    @writeMap @map
  writeMap:(map)->
    @map = map
    jf.writeFile "./pages.json", map, (err)=>
      if err then console.error 'could not write to pages.json'
      else @server.refresh('pages.json')

  generateJSONMap:(err, files)->
    map = {}
    Object.keys(files).forEach (key)=>
      return if key is "#{@pagesFolder}/partials/" or key is './'
      folder = @getFolder key
      if folder is "#{@projectName}-pages" then folder = 'pages'
      items = []
      files[key].forEach (item)=>
        if !@isFolder item then items.push item.replace('.html', '')
      map[folder] = items
    map
    # @writeMap()
  isFolder:(path)-> path.substr(path.length-1) is '/'
  getFolder:(path)->
    pathArr = path.split '/'
    folder = pathArr[pathArr.length-2]
    if folder is "#{@projectName}-pages" then 'pages' else folder
  splitFilePath:(p)->
    pathArr = p.split("/")
    fileName = pathArr[pathArr.length - 1]
    extension = fileName.split('.')
    extension = extension[extension.length-1]
    path = pathArr.slice(0, pathArr.length - 1)
    pathStr = path.join("/") + "/"
    regex = new RegExp "\.#{extension}", 'gi'
    file =
      path:       pathStr
      fileName:   fileName.replace regex, ''
      extension:  extension
  stop:->
    
# new DocIt
module.exports = DocIt


