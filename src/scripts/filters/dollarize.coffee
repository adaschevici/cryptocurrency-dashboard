angular.module('app').filter 'dollarize',

  ($filter) ->

    (val, useCents) ->
      decimalPlaces = if angular.isDefined useCents then 2 else 0
      '$' + $filter('number')(val, decimalPlaces)