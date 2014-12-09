jade = require("jade")
watch = require("watch")
gaze = require("gaze")
concat = require("concat")

pName = "docit"
pagesFolder = "../" + pName + "-pages/"
pagFiles = pagesFolder + "**/*.jade"
splitFilePath = (p) ->
  pathArr = p.split("/")
  fileName = pathArr[pathArr.length - 1]
  path = pathArr.slice(0, pathArr.length - 1)
  pathStr = path.join("/") + "/"
  path: pathStr
  fileName: fileName


# Watch all .js files/dirs in process.cwd()
gaze pagFiles, (err, watcher) ->
  
  # On file changed
  @on "changed", (filepath) ->
    file = splitFilePath(filepath)
    console.log file
    console.log filepath + " was changed"
  
  # On file added
  @on "added", (filepath) ->
    console.log filepath + " was added"
  
  # On file deleted
  @on "deleted", (filepath) ->
    console.log filepath + " was deleted"

console.log "it works"