class Nav extends window.DocIt.views.ProtoV
  template: '#js-navigation-item-template'

  setChecked:(route)->
    @$('.k-navigation-link').removeClass 'is-check'
    @$(".js-nav-#{route}").addClass 'is-check'

window.DocIt.views.NavigaionV = Nav