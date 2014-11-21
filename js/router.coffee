class Router extends Backbone.Router
  routes:
    '/':           'indexRoute'
    'colors':     'colorsRoute'
    '*notFound':  '404Route'

  constructor:-> super; @vars()

  vars:->   @on 'route', @change

  change:-> console.log 'change', @

window.DocIt ?= {}
window.DocIt.Router = Router