# ROUTER

App.Router.map ->
  @route('lock')
  # @resource 'lock', path: 'lock', -> console.log 'b'

# App.PostsRoute = Ember.Route.extend
#   model:->
#     clearInterval @interval
#     @interval = setInterval =>
#       @store.find 'post'
#     , 30000
#     @store.find 'post'


App.LockRoute = Ember.Route.extend
  model:->
    console.log 'a'
    {}
    # clearInterval @interval
    # @interval = setInterval =>
    #   @store.find 'post'
    # , 30000
    # @store.find 'post'


# App.UserRoute = Ember.Route.extend
#   model:-> @store.find 'user'

# App.CommentRoute = Ember.Route.extend
#   model:-> @store.find 'comment'
