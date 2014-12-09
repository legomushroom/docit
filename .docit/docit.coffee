jade = require("jade")
gaze = require("gaze")

class Main
  constructor:(@o={})->
    @vars()
    @listenPages()
  vars:->
    @projectName = "docit"
    @pagesFolder = "../#{@projectName}-pages"
    @pagFiles = "#{@pagesFolder}/**/*.jade"
  listenPages:->
    it = @
    gaze @pagFiles, (err, watcher) ->
      # On file changed
      @on 'changed', (filepath) ->
        file = it.splitFilePath(filepath)
        jade.renderFile(filepath)
        console.log filepath + ' was changed'
      # On file added
      @on 'added', (filepath) ->
        console.log filepath + ' was added'
      # On file deleted
      @on 'deleted', (filepath) ->
        console.log filepath + ' was deleted'
      @on 'all', (filepath) ->
  splitFilePath:(p)->
    pathArr = p.split("/")
    fileName = pathArr[pathArr.length - 1]
    path = pathArr.slice(0, pathArr.length - 1)
    pathStr = path.join("/") + "/"
    
    file =
      path: pathStr
      fileName: fileName

new Main

console.log "it works"