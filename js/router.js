var Router,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Router = (function(_super) {
  __extends(Router, _super);

  Router.prototype.routes = {
    '/': 'indexRoute',
    'colors': 'colorsRoute',
    '*notFound': '404Route'
  };

  function Router() {
    Router.__super__.constructor.apply(this, arguments);
    this.vars();
  }

  Router.prototype.vars = function() {
    return this.on('route', this.change);
  };

  return Router;

})(Backbone.Router);

if (window.DocIt == null) {
  window.DocIt = {};
}

window.DocIt.Router = Router;
