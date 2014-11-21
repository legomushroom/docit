class App
  constructor:(@o={})->
    @vars()
    @handleLinks()

  vars:->
    @$d = $(document)

    @router = new window.DocIt.Router
    Backbone.history.start()# pushState: true


    setTimeout =>
      @router.navigate '#/colors', trigger: true
    , 2000

  handleLinks:->
    it = @
    @$d.on 'click touchstart', 'a', (e)->
      $it = $(@); href = $it.attr('href')
      if !href then e.preventDefault(); return false

      isBlank     = $it.attr('target') is '_blank'
      isEmail     = href.match(/mailto\:/g)
      isFollow    = !$it.hasClass 'js-no-follow'
      isJS        = href.match(/javascript\:/g)
      isHTTP      = href.match(/https?/g)
      if isBlank or isEmail or !isFollow or isJS or isHTTP then return true
      
      if href.match(/to\:/g)
        href = href.replace /to\:/g, ''
        it.currentPage.scrollTo(to:href,offset: -100)
        e.preventDefault()
        it.router.addToHash href
        # e.stopPropagation()
        return false

      e.preventDefault()
      it.router.navigate(href, {trigger: true})

window.DocIt ?= {}
window.DocIt.App = new App