var DocIt, docit, testHelpers;

console.log('--------------------- Tests ---------------------');

DocIt = require('../src/docit');

docit = new DocIt({
  isLivereloadLess: true
});

testHelpers = require('./test-helpers');

describe('docit', function() {
  return describe('initialization', function() {
    beforeEach(function() {
      return testHelpers.cleanProject();
    });
    return it('should create folders if needed', function() {
      return expect(false).toBe(true);
    });
  });
});
