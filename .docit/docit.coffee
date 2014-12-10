jade = require("jade")
gaze = require("gaze")
jf   = require('jsonfile')

class Main
  constructor:(@o={})->
    @vars()
    @listenPages()
  vars:->
    @projectName = "docit"
    @pagesFolder = "../#{@projectName}-pages"
    @pagFiles = "#{@pagesFolder}/**/*.jade"
    @compilePage = @compilePage.bind @
    @removePage  = @removePage.bind @
    @generateJSONMap = @generateJSONMap.bind @
  listenPages:->
    it = @
    gaze @pagFiles, (err, watcher) ->
      @relative it.generateJSONMap
      @on 'changed', it.compilePage
      @on 'added',   it.compilePage
      @on 'deleted', it.removePage
  
  compilePage:(filepath)->
    file = @splitFilePath(filepath)
    if !file.path.match /\/partials\//
      jade.renderFile(filepath)

  removePage:(filepath)->


  generateJSONMap:(err, files)->
    map = {}
    Object.keys(files).forEach (key)=>
      return if key is "#{@pagesFolder}/partials/"
      folder = @getFolder key
      if folder is "#{@projectName}-pages" then folder = 'pages'
      items = []
      files[key].forEach (item)=>
        if !@isFolder item then items.push item.replace('.jade', '')
      map[folder] = items

    jf.writeFile 'pages.json', map, (err)->
      if err then console.error 'could not write to pages.json'
      
  isFolder:(path)-> path.substr(path.length-1) is '/'
  getFolder:(path)->
    pathArr = path.split '/'
    folder = pathArr[pathArr.length-2]
    folder


  splitFilePath:(p)->
    pathArr = p.split("/")
    fileName = pathArr[pathArr.length - 1]
    extension = fileName.split('.')
    extension = extension[extension.length-1]
    path = pathArr.slice(0, pathArr.length - 1)
    pathStr = path.join("/") + "/"
    
    file =
      path:       pathStr
      fileName:   fileName
      extension:  extension

new Main

console.log "it works"