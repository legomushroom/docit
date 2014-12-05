var PageView, Router,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PageView = window.DocIt.views.ProtoPageV;

Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    Router.__super__.constructor.apply(this, arguments);
    this.vars();
  }

  Router.prototype.vars = function() {
    return this.on('route', this.change);
  };

  Router.prototype.change = function(route) {
    var key, keys, _ref;
    if (route === 'index') {
      keys = Object.keys(this.app.routes);
      key = keys[0] === 'index' ? keys[1] : keys[0];
      this.previousRoute = key;
      this.navigate("#/" + key, {
        trigger: true
      });
      return;
    }
    if (route === this.previousRoute) {
      return;
    }
    if ((_ref = this.currentPage) != null) {
      _ref.teardown();
    }
    this.currentPage = new PageView({
      route: route,
      el: $('#js-pages')[0]
    });
    this.app.navigation.setChecked(route);
    return this.previousRoute = route;
  };

  return Router;

})(Backbone.Router);

if (window.DocIt == null) {
  window.DocIt = {};
}

window.DocIt.Router = Router;
