window.App = Ember.Application.create({
  Resolver: Ember.DefaultResolver.extend({
    resolveTemplate: function(parsedName) {
      var resolvedTemplate;
      console.log(parsedName.name);
      resolvedTemplate = this._super(parsedName);
      if (resolvedTemplate) {
        return resolvedTemplate;
      }
      return Ember.TEMPLATES['not_found'];
    }
  })
});
