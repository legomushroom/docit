console.log '--------------------- Tests ---------------------'

DocIt = require '../src/docit'
docit = new DocIt isLivereloadLess: true

testHelpers = require './test-helpers'

describe 'docit', ->
  describe 'initialization', ->
    beforeEach ->
      testHelpers.cleanProject()

    it 'should create folders if needed', ->
      expect(false).toBe true
