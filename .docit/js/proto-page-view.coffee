class ProtoPageView extends ProtoView

  vars:->
    @route = @o.route
    @projectName = 'docit'
    @template = "#{@projectName}-pages/#{@route}.html"
    @css = "css/pages/#{@route}.css"
    @loadCSS()
    super

  loadCSS:->
    id = "js-#{@route}-css"
    if !$("##{id}")[0]
      rel = 'stylesheet'
      $link = $("<link id='#{id}' rel='#{rel}' type='text/css' href='#{@css}'>")
      document.head.appendChild $link[0]

ProtoPageView
window.DocIt ?= {}
window.DocIt.views ?= {}
window.DocIt.views.ProtoPageV = ProtoPageView