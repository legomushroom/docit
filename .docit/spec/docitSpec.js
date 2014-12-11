var DocIt, docit;

console.log('--------------------- Tests ---------------------');

DocIt = require('../src/docit');

docit = new DocIt({
  isLivereloadLess: true
});

describe('docit', function() {
  return describe('initialization', function() {
    return it('should create folders if needed', function() {});
  });
});
