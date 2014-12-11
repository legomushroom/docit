var TestHelpers, fs, rimraf;

fs = require('fs');

rimraf = require('rimraf');

TestHelpers = (function() {
  function TestHelpers() {}

  TestHelpers.prototype.cleanProject = function() {
    rimraf.sync('../docit-pages', function(err) {
      return console.log(err);
    });
    rimraf.sync('../css', function(err) {
      return console.log(err);
    });
    return fs.unlink('../index.html');
  };

  return TestHelpers;

})();

module.exports = new TestHelpers;
