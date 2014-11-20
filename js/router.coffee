# ROUTER

App.Router.map ->
  @route('colors')
  @route('icons')
  # @resource 'lock', path: 'lock', -> console.log 'b'

App.ColorsRoute = Ember.Route.extend
  model:->
    console.log 'a'
    {}
