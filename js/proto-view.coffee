class ProtoView extends Backbone.View
  initialize:(@o={})->
    # vars could be async since template could be async
    # so check if return value of the vars call has the
    # "then" method(promise) and act respectively
    @vars(); tplDeferred = @parseTemplate()
    if tplDeferred?.then then tplDeferred.then @afterTemplate.bind @
    else @afterTemplate()
    @

  afterTemplate:->
    @stripTemplate()
    @isInitRender and @render()
    @inject and @injectScripts()

  vars:->
    @h = {}
    @isInitRender = true
    if @Model and !@model
      @model = new @Model @o.data

    if !@Model and !@model
      @model = new Backbone.Model @o.data

    @model.on 'destroy', @teardown.bind @

  parseTemplate:->
    if !@template
      @template = ''; return

    if typeof @template is 'function'
      @template = @template()

    @template = $.trim @template
    firstChar = @template.charAt(0)
    isId    = firstChar is '#'
    isClass = firstChar is '.'
    isHtml  = firstChar is '<'
    if firstChar and isId or isClass or isHtml
      @template = $(@template).text()
    if !isId and !isClass and !isHtml and firstChar
      dfr = new $.Deferred
      $('<div />').load @template, (text)=>
        @template = text; dfr.resolve()
      return dfr.promise()

  stripTemplate:->
    @template = @template.replace /\&lt;/gi, '<'
    @template = @template.replace /\&gt;/gi, '>'
    @template = @template.replace /\&quot;/gi, '"'
    @template = @template.replace /\<.script/gi, ''
    @template = _.template @template

  render:->
    @trigger 'render:before'
    # expose helpers to templates
    data = @model?.toJSON(); data.h = @h
    @$el.html if @template then @template data: data else ''
    @trigger 'render:after'
    @


  teardown:-> @undelegateEvents(); @

window.DocIt ?= {}
window.DocIt.views ?= {}
window.DocIt.views.ProtoV = ProtoView


