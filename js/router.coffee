class Router extends Backbone.Router
  routes:
    '/':           'indexRoute'
    'colors':     'colorsRoute'
    '*notFound':  '404Route'

  constructor:()-> @vars()

  vars:->
    @bind('route', @change)

  colorsRoute:->
    console.log 'colors routes'

  change:->
    console.log 'change'

window.DocIt ?= {}
window.DocIt.Router = Router