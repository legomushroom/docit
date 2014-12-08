var Nav,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Nav = (function(_super) {
  __extends(Nav, _super);

  function Nav() {
    return Nav.__super__.constructor.apply(this, arguments);
  }

  Nav.prototype.template = '#js-navigation-item-template';

  Nav.prototype.setChecked = function(route) {
    this.$('.k-navigation-link').removeClass('is-check');
    return this.$(".js-nav-" + route).addClass('is-check');
  };

  return Nav;

})(window.DocIt.views.ProtoV);

window.DocIt.views.NavigaionV = Nav;
