console.log '--------------------- Tests ---------------------'

shell = require 'shelljs/global'

ps = require 'ps-node'


ps.lookup { command: '' }, (err, resultList)->
  console.log resultList, err

# if exec('ctrl+c').code isnt 0
#   echo('stop failed')
#   exit(1)

# console.log process.env
# console.log exec('ps aux | grep "docit"').code

# if exec('docit').code isnt 0
#   echo('exec failed')
#   exit(1)

# describe 'docit', ->
#   it 'should run tests', ->
#     expect(true).toBe(true)
