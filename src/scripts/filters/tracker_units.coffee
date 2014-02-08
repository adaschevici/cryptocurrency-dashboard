angular.module('app').filter 'trackerUnits',

  ($filter) ->

    (val, digits) ->
      if val < 0 then 'N/A' else $filter('digits')(val, digits)