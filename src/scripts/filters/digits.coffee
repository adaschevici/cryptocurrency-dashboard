angular.module('app').filter 'digits', ->

  roundToDecimalPlaces = (number, decimalPlaces) ->
    decimalPlaces = decimalPlaces or 0
    string = String(number)
    if number % 1
      string = string.replace /5$/, '6'
    Number((+string)).toFixed decimalPlaces

  isNumber = (val) ->
    !isNaN(parseFloat val) and isFinite val

  (val, digits) ->
    if isNumber(val) and digits
      if val is 0
        filteredVal = 0
      else
        number = val.toString()
        parts  = number.split '.'
        decimalPlaces = digits - parts[0].length
        filteredVal = if decimalPlaces < 1 then Math.round val else roundToDecimalPlaces number, decimalPlaces
      filteredVal.toString()
    else val
