var ProtoPageView, _base,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ProtoPageView = (function(_super) {
  __extends(ProtoPageView, _super);

  function ProtoPageView() {
    return ProtoPageView.__super__.constructor.apply(this, arguments);
  }

  ProtoPageView.prototype.vars = function() {
    this.route = this.o.route;
    this.projectName = 'docit';
    this.template = "" + this.projectName + "-pages/" + this.route + ".html";
    this.css = "css/pages/" + this.route + ".css";
    this.loadCSS();
    return ProtoPageView.__super__.vars.apply(this, arguments);
  };

  ProtoPageView.prototype.loadCSS = function() {
    var $link, id, rel;
    id = "js-" + this.route + "-css";
    if (!$("#" + id)[0]) {
      rel = 'stylesheet';
      $link = $("<link id='" + id + "' rel='" + rel + "' type='text/css' href='" + this.css + "'>");
      return document.head.appendChild($link[0]);
    }
  };

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
