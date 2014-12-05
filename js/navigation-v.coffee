class Nav extends window.DocIt.views.ProtoV
  template: '#js-navigation-item-template'

  setChecked:(route)->
    @$('.k-navigation-link').removeClass 'is-check'
    @$(".js-nav-#{route}").addClass 'is-check'
    console.log @$(".js-nav-#{route}")[0]


window.DocIt.views.NavigaionV = Nav