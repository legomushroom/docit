var Helpers, Q, env, fs, jade, trim,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

fs = require('fs');

jade = require('jade');

env = require('jsdom').env;

trim = require('trim');

Q = require('q');

Helpers = (function() {
  function Helpers(o) {
    this.o = o != null ? o : {};
    this.vars();
  }

  Helpers.prototype.vars = function() {
    var jqueryPath;
    this.projectName = "docit";
    jqueryPath = './node_modules/jquery/dist/jquery.js';
    return this.jquerySrc = fs.readFileSync(jqueryPath).toString();
  };

  Helpers.prototype.splitFilePath = function(p) {
    var extension, file, fileName, path, pathArr, pathStr, regex;
    pathArr = p.split("/");
    fileName = pathArr[pathArr.length - 1];
    extension = fileName.split('.');
    extension = extension[extension.length - 1];
    path = pathArr.slice(0, pathArr.length - 1);
    pathStr = path.join("/") + "/";
    regex = new RegExp("\." + extension, 'gi');
    return file = {
      path: pathStr,
      fileName: fileName.replace(regex, ''),
      extension: extension
    };
  };

  Helpers.prototype.renamePageInMap = function(o) {
    var folder, i, isChanged, map, newFile, newFilePath, newFolder, oldFile, oldFilePath, oldFolder, page, _i, _len;
    newFilePath = o.newPath;
    oldFilePath = o.oldPath;
    map = o.map;
    newFile = this.splitFilePath(newFilePath);
    newFolder = this.getFolder(newFilePath);
    oldFile = this.splitFilePath(oldFilePath);
    oldFolder = this.getFolder(oldFilePath);
    folder = map[oldFolder];
    isChanged = false;
    if (folder.length > 0) {
      for (i = _i = 0, _len = folder.length; _i < _len; i = ++_i) {
        page = folder[i];
        if (page === oldFile.fileName) {
          folder[i] = newFile.fileName;
          isChanged = true;
        }
        if (i === folder.length - 1 && isChanged === false) {
          folder.push(newFile.fileName);
        }
      }
    } else {
      folder.push(newFile.fileName);
    }
    return map;
  };

  Helpers.prototype.removePageFromMap = function(o) {
    var file, filepath, folder, map, newPages, pages;
    map = o.map;
    filepath = o.filepath;
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    newPages = [];
    pages = map[folder];
    pages.forEach(function(page) {
      var fileName;
      fileName = file.fileName.replace('.html', '');
      if (page !== fileName) {
        return newPages.push(page);
      }
    });
    map[folder] = newPages;
    return map;
  };

  Helpers.prototype.getFolder = function(path) {
    var folder, pathArr;
    pathArr = path.split('/');
    folder = pathArr[pathArr.length - 2];
    if (folder === ("" + this.projectName + "-pages")) {
      return 'pages';
    } else {
      return folder;
    }
  };

  Helpers.prototype.isFolder = function(path) {
    return path.substr(path.length - 1) === '/';
  };

  Helpers.prototype.removeSon = function(filepath) {
    try {
      return fs.unlinkSync(filepath.replace('.jade', '.html'));
    } catch (_error) {}
  };

  Helpers.prototype.parseFolderToMap = function(files) {
    var base, file, fileName, filePathArr, folderName, i, map, _i, _len;
    map = {};
    for (i = _i = 0, _len = files.length; _i < _len; i = ++_i) {
      file = files[i];
      base = file.split('docit-pages/')[1];
      filePathArr = base.split('/');
      if (filePathArr.length === 1) {
        fileName = filePathArr[0];
        if (fileName.match(/\.html$/gi)) {
          if (map['pages'] == null) {
            map['pages'] = [];
          }
          map['pages'].push(fileName.replace('.html', ''));
        }
      } else {
        fileName = filePathArr[filePathArr.length - 1];
        if (!fileName.match(/\.html$/gi)) {
          continue;
        }
        filePathArr = filePathArr.slice(0, filePathArr.length - 1);
        if (filePathArr.length > 1) {
          console.warn("only one level of nesting allowed: \"" + filePathArr[1] + "\" would be ignored");
        }
        if ((folderName = filePathArr[0]) !== 'partials') {
          if (map[folderName] == null) {
            map[folderName] = [];
          }
          map[folderName].push(fileName.replace('.html', ''));
        }
      }
    }
    return map;
  };

  Helpers.prototype.addPageToMap = function(o) {
    var file, fileName, filepath, folder, map;
    map = o.map;
    filepath = o.filepath;
    file = this.splitFilePath(filepath);
    folder = this.getFolder(filepath);
    if (folder === ("" + this.pagesFolder + "/partials/")) {
      return;
    }
    folder = map[folder];
    fileName = file.fileName;
    if (__indexOf.call(folder, fileName) >= 0) {
      return;
    } else {
      folder.push(fileName);
    }
    return map;
  };

  Helpers.prototype.compilePage = function(filepath) {
    var file, html;
    file = this.splitFilePath(filepath);
    if (!file.path.match(/\/partials\//)) {
      html = jade.renderFile(filepath);
      return fs.writeFileSync(filepath.replace('.jade', '.html'), html);
    }
  };

  Helpers.prototype.parseHtmlToJson = function(html) {
    var dfr;
    dfr = Q.defer();
    html = "<html><body>" + html + "</body></html>";
    env({
      html: html,
      src: [this.jquerySrc],
      done: function(err, window) {
        var $, $body, $cards, els;
        $ = window.$;
        els = [];
        $body = $('body');
        $cards = $body.find('card');
        $cards.each(function(i, card) {
          var $card, $hash, $name, $tags, cardObj, tags, tagsArr, _ref;
          cardObj = {};
          $card = $(card);
          $name = $card.find('name');
          cardObj.name = trim($name.text());
          $name.remove();
          $hash = $card.find('hash');
          cardObj.hash = trim($hash.text());
          $hash.remove();
          tags = [];
          $tags = $card.find('tags');
          tagsArr = $tags != null ? (_ref = $tags.text()) != null ? _ref.split(',') : void 0 : void 0;
          tagsArr.forEach(function(tag) {
            return tags.push(trim(tag));
          });
          cardObj.tags = tags;
          $tags.remove();
          cardObj.html = trim($card.html());
          return els.push(cardObj);
        });
        return dfr.resolve(els);
      }
    });
    return dfr.promise;
  };

  return Helpers;

})();

module.exports = new Helpers;
