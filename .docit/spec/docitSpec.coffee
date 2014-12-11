console.log '--------------------- Tests ---------------------'

DocIt = require '../src/docit'
docit = new DocIt isLivereloadLess: true

describe 'docit', ->
  describe 'initialization', ->
    it 'should create folders if needed', ->
