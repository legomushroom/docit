App.Router.map(function() {
  this.route('colors');
  return this.route('icons');
});

App.ColorsRoute = Ember.Route.extend({
  model: function() {
    console.log('a');
    return {};
  }
});
