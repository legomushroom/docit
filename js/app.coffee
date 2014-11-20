window.App = Ember.Application.create
  Resolver: Ember.DefaultResolver.extend
    resolveTemplate: (parsedName)->
      console.log parsedName.name
      resolvedTemplate = @_super(parsedName)
      if (resolvedTemplate) then return resolvedTemplate
      Ember.TEMPLATES['not_found']