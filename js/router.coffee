
PageView = window.DocIt.views.ProtoPageV
class Router extends Backbone.Router
  constructor:-> super; @vars()
  vars:->   @on 'route', @change

  change:(route)->
    if route is 'index'
      keys = Object.keys(@app.routes)
      key = if keys[0] is 'index' then keys[1] else keys[0]
      @previousRoute = key
      @navigate "#/#{key}", trigger: true
      return
    
    return if route is @previousRoute

    @currentPage?.teardown()
    @currentPage = new PageView
      route: route
      el: $('#js-pages')[0]

    @app.navigation.setChecked route
    @previousRoute = route

window.DocIt ?= {}
window.DocIt.Router = Router