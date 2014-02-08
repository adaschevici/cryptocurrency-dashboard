angular.module('app').filter 'titleCase', ->

  (val) ->
    if val
      val.replace /\w\S*/g, (txt) -> txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    else val