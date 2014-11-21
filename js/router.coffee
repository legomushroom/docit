class Router extends Backbone.Router
  routes:
    '/':           'indexRoute'
    'colors':     'colorsRoute'
    '*notFound':  '404Route'

  constructor:()-> super; @vars()

  vars:->
    @on 'color', -> console.log 'a'
    @on 'route', -> console.info 'route changed'
    # console.log @handlers
    # @bind('route', @change)

  colorsRoute:->
    console.log 'colors routes'

  change:->
    console.log 'change'

window.DocIt ?= {}
window.DocIt.Router = Router