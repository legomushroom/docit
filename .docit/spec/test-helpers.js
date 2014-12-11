var TestHelpers, fs, rimraf,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

fs = require('fs');

rimraf = require('rimraf');

TestHelpers = (function() {
  function TestHelpers() {}

  TestHelpers.prototype.cleanProject = function() {
    var items;
    rimraf.sync('../docit-pages', function(err) {
      return console.log(err);
    });
    rimraf.sync('../css', function(err) {
      return console.log(err);
    });
    items = fs.readdirSync('../');
    if (__indexOf.call(items, 'index.html') >= 0) {
      return fs.unlink('../index.html', function(err) {
        return console.log(err);
      });
    }
  };

  return TestHelpers;

})();

module.exports = new TestHelpers;
