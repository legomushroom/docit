var App;

App = (function() {
  function App(o) {
    this.o = o != null ? o : {};
    this.vars();
    this.handleLinks();
  }

  App.prototype.vars = function() {
    this.$d = $(document);
    $.ajax({
      dataType: 'json',
      url: 'pages.json',
      success: function(data) {
        return console.log(data.pages);
      },
      error: function(data) {
        var msg;
        msg = 'can not get pages.json file, please rerun DocIt';
        throw new Error("" + msg + " :: " + data.statusText);
      }
    });
    this.router = new window.DocIt.Router;
    Backbone.history.start();
    return setTimeout((function(_this) {
      return function() {
        return _this.router.navigate('#/colors', {
          trigger: true
        });
      };
    })(this), 2000);
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

  return App;

})();

if (window.DocIt == null) {
  window.DocIt = {};
}

window.DocIt.App = new App;
