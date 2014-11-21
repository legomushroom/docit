var ProtoView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ProtoView = (function(_super) {
  __extends(ProtoView, _super);

  function ProtoView() {
    return ProtoView.__super__.constructor.apply(this, arguments);
  }

  ProtoView.prototype.initialize = function(o) {
    var tplDeferred;
    this.o = o != null ? o : {};
    this.vars();
    tplDeferred = this.parseTemplate();
    if (tplDeferred != null ? tplDeferred.then : void 0) {
      tplDeferred.then(this.afterTemplate.bind(this));
    } else {
      this.afterTemplate();
    }
    return this;
  };

  ProtoView.prototype.afterTemplate = function() {
    this.stripTemplate();
    this.o.isInitRender && this.render();
    return this.inject && this.injectScripts();
  };

  ProtoView.prototype.vars = function() {
    this.h = {};
    this.isInitRender = true;
    if (this.Model && !this.model) {
      this.model = new this.Model(this.o.data);
    }
    if (!this.Model && !this.model) {
      this.model = new Backbone.Model(this.o.data);
    }
    return this.model.on('destroy', this.h.bind(this.teardown, this));
  };

  ProtoView.prototype.parseTemplate = function() {
    var dfr, firstChar, isClass, isHtml, isId;
    if (!this.template) {
      this.template = '';
      return;
    }
    if (typeof this.template === 'string') {
      this.template = $(this.template).text();
    }
    if (typeof this.template === 'function') {
      this.template = this.template();
    }
    this.template = $.trim(this.template);
    firstChar = this.template.charAt(0);
    isId = firstChar === '#';
    isClass = firstChar === '.';
    isHtml = firstChar === '<';
    if (!isId && !isClass && !isHtml && firstChar) {
      dfr = new $.Deferred;
      $('<div />').load(this.template, (function(_this) {
        return function(text) {
          _this.template = text;
          return dfr.resolve();
        };
      })(this));
      return dfr.promise();
    }
  };

  ProtoView.prototype.stripTemplate = function() {
    this.template = this.template.replace(/\&lt;/gi, '<');
    this.template = this.template.replace(/\&gt;/gi, '>');
    this.template = this.template.replace(/\&quot;/gi, '"');
    this.template = this.template.replace(/\<.script/gi, '');
    return this.template = _.template(this.template);
  };

  ProtoView.prototype.render = function() {
    var data, _ref;
    this.trigger('render:before');
    data = (_ref = this.model) != null ? _ref.toJSON() : void 0;
    data.h = this.h;
    this.$el.html(this.template ? this.template({
      data: data
    }) : '');
    this.trigger('render:after');
    return this;
  };

  ProtoView.prototype.teardown = function() {
    this.undelegateEvents();
    return this;
  };

  return ProtoView;

})(Backbone.View);

ProtoView;
