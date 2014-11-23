
PageView = window.DocIt.views.ProtoPageV
class Router extends Backbone.Router
  constructor:->
    super; @vars()
  vars:->   @on 'route', @change

  change:(route)->
    return if route is @previousRoute

    @currentPage?.teardown()
    @currentPage = new PageView
      route: route
      el: $('#js-pages')[0]

    @previousRoute = route

window.DocIt ?= {}
window.DocIt.Router = Router