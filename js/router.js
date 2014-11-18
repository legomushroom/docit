App.Router.map(function() {
  return this.route('lock');
});

App.LockRoute = Ember.Route.extend({
  model: function() {
    console.log('a');
    return {};
  }
});
