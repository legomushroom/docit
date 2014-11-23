class Router extends Backbone.Router
  # routes:
  #   '':           'index'
  #   'colors':     'colors'
  #   '*notFound':  '404'
  constructor:-> super; @vars()
  vars:->   @on 'route', @change

  change:(route)->
    console.log route

window.DocIt ?= {}
window.DocIt.Router = Router