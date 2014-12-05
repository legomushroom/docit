var App;

App = (function() {
  function App(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.handleLinks();
  }

  App.prototype.vars = function() {
    this.$d = $(document);
    return $.ajax({
      dataType: 'json',
      url: 'pages.json',
      success: (function(_this) {
        return function(data) {
          _this.routes = _this.createRoutes(data.pages);
          _this.createNavigation(_this.routes);
          _this.router = new window.DocIt.Router({
            routes: _this.routes
          });
          _this.router.app = _this;
          return Backbone.history.start();
        };
      })(this),
      error: function(data) {
        var msg;
        msg = 'can not get pages.json file, please rerun DocIt';
        throw new Error("" + msg + " :: " + data.statusText);
      }
    });
  };

  App.prototype.createRoutes = function(pages) {
    var page, routes, _i, _len;
    routes = {};
    for (_i = 0, _len = pages.length; _i < _len; _i++) {
      page = pages[_i];
      routes[page] = page;
    }
    routes[''] = 'index';
    return routes;
  };

  App.prototype.handleLinks = function() {
    var it;
    it = this;
    return this.$d.on('click touchstart', 'a', function(e) {
      var $it, href, isBlank, isEmail, isFollow, isHTTP, isJS;
      $it = $(this);
      href = $it.attr('href');
      if (!href) {
        e.preventDefault();
        return false;
      }
      isBlank = $it.attr('target') === '_blank';
      isEmail = href.match(/mailto\:/g);
      isFollow = !$it.hasClass('js-no-follow');
      isJS = href.match(/javascript\:/g);
      isHTTP = href.match(/https?/g);
      if (isBlank || isEmail || !isFollow || isJS || isHTTP) {
        return true;
      }
      if (href.match(/to\:/g)) {
        href = href.replace(/to\:/g, '');
        it.currentPage.scrollTo({
          to: href,
          offset: -100
        });
        e.preventDefault();
        it.router.addToHash(href);
        return false;
      }
      e.preventDefault();
      return it.router.navigate(href, {
        trigger: true
      });
    });
  };

  App.prototype.createNavigation = function(routes) {
    return this.navigation = new window.DocIt.views.NavigaionV({
      el: $('#js-main-nav'),
      data: {
        links: routes
      }
    });
  };

  return App;

})();

if (window.DocIt == null) {
  window.DocIt = {};
}

window.DocIt.App = new App;
