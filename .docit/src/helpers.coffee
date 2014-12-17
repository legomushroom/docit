fs = require 'fs'

class Helpers
  constructor:(@o={})-> @vars()
  vars:-> @projectName = "docit"
  splitFilePath:(p)->
    pathArr   = p.split("/")
    fileName  = pathArr[pathArr.length - 1]
    extension = fileName.split('.')
    extension = extension[extension.length-1]
    path      = pathArr.slice(0, pathArr.length - 1)
    pathStr   = path.join("/") + "/"
    regex     = new RegExp "\.#{extension}", 'gi'
    file =
      path:       pathStr
      fileName:   fileName.replace regex, ''
      extension:  extension
  renamePageInMap:(o)->
    newFilePath = o.newPath; oldFilePath = o.oldPath; map = o.map
    newFile   = @splitFilePath newFilePath
    newFolder = @getFolder newFilePath
    oldFile   = @splitFilePath oldFilePath
    oldFolder = @getFolder oldFilePath
    folder    = map[oldFolder]
    isChanged = false

    if folder.length > 0
      for page, i in folder
        if page is oldFile.fileName
          folder[i] = newFile.fileName
          isChanged = true
        if i is folder.length-1 and isChanged is false
          folder.push newFile.fileName
    else folder.push newFile.fileName
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
  getFolder:(path)->
    pathArr = path.split '/'
    folder  = pathArr[pathArr.length-2]
    if folder is "#{@projectName}-pages" then 'pages' else folder
  isFolder:(path)-> path.substr(path.length-1) is '/'
  removeSon:(filepath)->
    try
      fs.unlinkSync filepath.replace '.jade', '.html'
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
  addPageToMap:(o)->
    map = o.map; filepath = o.filepath
    file   = @splitFilePath filepath
    folder = @getFolder filepath
    return if folder is "#{@pagesFolder}/partials/"
    folder = map[folder]; fileName = file.fileName
    if fileName in folder then return
    else folder.push fileName
    map
  compilePage:(filepath)->
    file = h.splitFilePath(filepath)
    if !file.path.match /\/partials\//
      html = jade.renderFile filepath
      fs.writeFileSync filepath.replace('.jade', '.html'), html


module.exports = new Helpers