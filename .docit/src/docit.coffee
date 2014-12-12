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
    # @createFolders()
    !@o.isLivereloadLess and @createLivereloadServer()
    @listenPages()
    return @

  createFolders:->
    items = fs.readdirSync '../'
    if !('css' in items)
      fse.copySync './project-folders/css/', '../css'
    if !("#{@projectName}-pages" in items)
      fse.copySync './project-folders/docit-pages/', '../docit-pages'

  vars:->
    @projectName = "docit"
    @pagesFolder = "#{@projectName}-pages"
    @pagFiles    = "#{@pagesFolder}/**/*.html"
    # @compilePage        = @compilePage.bind       @
    @removePageFromMap  = @removePageFromMap.bind @
    @generateJSONMap    = @generateJSONMap.bind   @
  createLivereloadServer:-> @server = livereload.createServer({ port: 41000 })
  listenPages:->
    it = @
    gaze @pagFiles, (err, watcher) ->
      @relative it.generateJSONMap
      # @on 'changed', (filepath)->
      #   console.log filepath
      @on 'added',  (filepath)->
        console.log 'add'
        it.addPageToMap filepath
        # it.compilePage  filepath
      @on 'deleted', (filepath)->
        console.log 'delete'
        it.removePageFromMap filepath

      @on 'renamed', (filepath, oldpath)->
        if filepath.match /\.trash/gi
          it.removePageFromMap oldpath
        # console.log 'renamed', filepath, oldpath
        # it.removePageFromMap filepath

      # @on 'all', (e, filepath)->
      #   console.log 'all', e, filepath
  
  # compilePage:(filepath)->
  #   console.log filepath
  #   file = @splitFilePath(filepath)
  #   console.log file
  #   if !file.path.match /\/partials\//
  #     console.log 'yup'
  #     jade.renderFile(filepath)
  #     @server.refresh(filepath)

  addPageToMap:(filepath, isRefresh)->
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"

    folder = @map[folder]; fileName = file.fileName
    if fileName in folder then return
    else folder.push fileName
    @writeMap()

  removePageFromMap:(filepath)->
    console.log filepath
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"

    # fs.unlink filepath.replace('.jade', '.html')

    newPages = []
    pages = @map[folder]
    console.log pages
    pages.forEach (page)->
      fileName = file.fileName.replace '.html', ''
      if page isnt fileName
        newPages.push page

    @map[folder] = newPages
    @writeMap()

  writeMap:->
    jf.writeFile 'pages.json', @map, (err)=>
      if err then console.error 'could not write to pages.json'
      else @server.refresh('pages.json')

  generateJSONMap:(err, files)->
    @map = {}
    Object.keys(files).forEach (key)=>
      return if key is "#{@pagesFolder}/partials/" or key is './'
      folder = @getFolder key
      if folder is "#{@projectName}-pages" then folder = 'pages'
      items = []
      files[key].forEach (item)=>
        if !@isFolder item then items.push item.replace('.html', '')
      @map[folder] = items

    @writeMap()
      
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


