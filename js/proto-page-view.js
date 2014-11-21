var ProtoPageView, _base,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ProtoPageView = (function(_super) {
  __extends(ProtoPageView, _super);

  function ProtoPageView() {
    return ProtoPageView.__super__.constructor.apply(this, arguments);
  }

  return ProtoPageView;

})(ProtoView);

ProtoPageView;

if (window.DocIt == null) {
  window.DocIt = {};
}

if ((_base = window.DocIt).views == null) {
  _base.views = {};
}

window.DocIt.views.ProtoPageV = ProtoPageView;
