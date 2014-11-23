class ProtoPageView extends ProtoView

  vars:->
    @route = @o.route
    @template = "page-templates/#{@route}.html"
    super

ProtoPageView
window.DocIt ?= {}
window.DocIt.views ?= {}
window.DocIt.views.ProtoPageV = ProtoPageView