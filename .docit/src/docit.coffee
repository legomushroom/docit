jade = require 'jade'
gaze = require 'gaze'
jf   = require 'jsonfile'
livereload = require('livereload')
fs   = require 'fs'
class DocIt
  constructor:(@o={})->
    console.log 'docit init'
    @vars()
    !@o.isLivereloadLess and @createLivereloadServer()
    @listenPages()
    return @

  vars:->
    @projectName = "docit"
    @pagesFolder = "../#{@projectName}-pages"
    @pagFiles    = "#{@pagesFolder}/**/*.jade"
    @compilePage        = @compilePage.bind       @
    @removePageFromMap  = @removePageFromMap.bind @
    @generateJSONMap    = @generateJSONMap.bind   @
  createLivereloadServer:-> @server = livereload.createServer({ port: 41000 })
  listenPages:->
    it = @
    gaze @pagFiles, (err, watcher) ->
      @relative it.generateJSONMap
      @on 'changed', it.compilePage
      @on 'added',  (filepath)->
        it.addPageToMap filepath
        it.compilePage  filepath
      @on 'deleted', it.removePageFromMap
  
  compilePage:(filepath)->
    file = @splitFilePath(filepath)
    if !file.path.match /\/partials\//
      jade.renderFile(filepath)
      @server.refresh(filepath)

  addPageToMap:(filepath, isRefresh)->
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"

    @map[folder].push file.fileName
    @writeMap()

  removePageFromMap:(filepath)->
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"

    fs.unlink filepath.replace('.jade', '.html')

    newPages = []
    pages = @map[folder]
    pages.forEach (page)->
      if page isnt file.fileName
        newPages.push page

    @map[folder] = newPages
    @writeMap()

  writeMap:->
    jf.writeFile 'pages.json', @map, (err)=>
      if err then console.error 'could not write to pages.json'
      else @server.refresh('pages.json')

  generateJSONMap:(err, files)->
    # console.log files
    @map = {}
    Object.keys(files).forEach (key)=>
      return if key is "#{@pagesFolder}/partials/"
      folder = @getFolder key
      if folder is "#{@projectName}-pages" then folder = 'pages'
      items = []
      files[key].forEach (item)=>
        if !@isFolder item then items.push item.replace('.jade', '')
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


