var ps, shell;

console.log('--------------------- Tests ---------------------');

shell = require('shelljs/global');

ps = require('ps-node');

ps.lookup({
  command: ''
}, function(err, resultList) {
  return console.log(resultList, err);
});
