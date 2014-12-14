jade = require 'jade'
gaze = require 'gaze'
jf   = require 'jsonfile'
fs   = require 'fs'
fse  = require 'fs-extra'
shell = require 'shell'

mkdirp     = require 'mkdirp'
livereload = require 'livereload'

shell      = require 'shelljs/global'

recursive = require  'readdir-recursive'

class DocIt
  constructor:(@o={})->
    @vars()
    @createFolders()
    @getProjectFiles()
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
  getProjectFiles:->
    files = recursive.fileSync "#{@baseUrl}docit-pages/"
    map = @parseFolderToMap files
    @writeMap map
  vars:->
    @isDev = @o.isDev
    @projectName = "docit"
    # for testing purposes
    prefix = if @isDev then '../' else ''
    @pagesFolder = "#{prefix}#{@projectName}-pages"
    @pageFiles    = "#{@pagesFolder}/**/*.html"
    @removePageFromMap  = @removePageFromMap.bind @
  createLivereloadServer:-> @server = livereload.createServer({ port: 41000 })
  listenPages:->
    it = @
    gaze @pageFiles, (err, watcher) ->
      it.watcher = watcher
      @on 'added',   (filepath)->
        map = it.addPageToMap filepath: filepath, map: it.map
        it.writeMap map
      @on 'deleted', (filepath)->
        map = it.removePageFromMap filepath: filepath, map: it.map
        it.writeMap map
      @on 'renamed', (filepath, oldpath)->
        if filepath.match /\.trash/gi
          map = it.removePageFromMap filepath: oldpath, map: it.map
          it.writeMap map
        else
          options = newPath: filepath, oldPath: oldpath, map: it.map
          map = it.renamePageInMap options
          it.writeMap map
        true
      # it.isDev and @on 'all', (e, filepath)-> console.log 'all', e
      # @on 'all', (e, filepath)-> console.log 'all', e
  parseFolderToMap:(files)->
    map = {}
    for file, i in files
      base = file.split('docit-pages/')[1]
      filePathArr = base.split '/'
      # if just a file name then
      # put it in the "pages" folder
      if filePathArr.length is 1
        fileName = filePathArr[0]
        if fileName.match /\.html$/gi
          map['pages'] ?= []
          map['pages'].push fileName.replace '.html', ''
      else
        # if file is inside another nested folder
        # save this file to map as a sibling of "pages"
        # folder but only if the folder name isnt "partials"
        fileName = filePathArr[filePathArr.length-1]
        if !fileName.match /\.html$/gi then continue
        filePathArr = filePathArr.slice(0, filePathArr.length-1)
        if filePathArr.length > 1
          console.warn "only one level of
             nesting allowed: \"#{filePathArr[1]}\" would be ignored"
        if (folderName = filePathArr[0]) isnt 'partials'
          map[folderName] ?= []
          map[folderName].push fileName.replace '.html', ''
    map
  # compilePage:(filepath)->
  #   console.log filepath
  #   file = @splitFilePath(filepath)
  #   console.log file
  #   if !file.path.match /\/partials\//
  #     console.log 'yup'
  #     jade.renderFile(filepath)
  #     @server.refresh(filepath)
  renamePageInMap:(o)->
    newFilePath = o.newPath; oldFilePath = o.oldPath; map = o.map
    newFile   = @splitFilePath newFilePath
    newFolder = @getFolder newFilePath
    oldFile   = @splitFilePath oldFilePath
    oldFolder = @getFolder oldFilePath
    folder = map[oldFolder]
    isChanged = false

    if folder.length > 0
      for page, i in folder
        if page is oldFile.fileName
          folder[i] = newFile.fileName
          isChanged = true
        # if delete event fired first
        if i is folder.length-1 and isChanged is false
          folder.push newFile.fileName
    # if delete event fired first and folder is empty
    else folder.push newFile.fileName

    map
  addPageToMap:(o)->
    map = o.map; filepath = o.filepath
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"
    folder = map[folder]; fileName = file.fileName
    if fileName in folder then return
    else folder.push fileName
    map
  removePageFromMap:(o)->
    map = o.map; filepath = o.filepath
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"
    newPages = []
    pages = map[folder]
    pages.forEach (page)->
      fileName = file.fileName.replace '.html', ''
      if page isnt fileName
        newPages.push page
    map[folder] = newPages
    map
  writeMap:(map)->
    @map = map
    jf.writeFileSync "./pages.json", map
    @server?.refresh('./pages.json')

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


