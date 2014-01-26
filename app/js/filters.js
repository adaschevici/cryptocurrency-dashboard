angular.module('dashboardApp.filters', [])

    .filter('digits', function() {

        function roundToDecimalPlaces(number, decimalPlaces) {
            decimalPlaces = decimalPlaces || 0
            var string = String(number)
            if(number % 1) {
                string = string.replace(/5$/, '6')
            }
            return Number((+string)).toFixed(decimalPlaces)
        }

        function isNumber(val) {
            return !isNaN(parseFloat(val)) && isFinite(val)
        }

        return function(val, digits) {
            if(isNumber(val) && digits) {
                var filteredVal
                if(val == 0) {
                    filteredVal = 0;
                } else {
                    var number = val.toString(),
                        parts  = number.split('.'),
                        decimalPlaces = digits - parts[0].length

                    filteredVal = decimalPlaces < 1 ? Math.round(val) : roundToDecimalPlaces(number, decimalPlaces)
                }
                return filteredVal.toString()

            } else return val
        }
    })


    .filter('dollarize', ['$filter', function($filter) {
        return function (val, useCents) {
            var decimalPlaces = angular.isDefined(useCents) ? 2 : 0
            return '$' + $filter('number')(val, decimalPlaces)
        }
    }])


    .filter('titleCase', function() {
        return function(val) {
            return val ?  val.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            }) : val
        }
    })

    
    .filter('trackerUnits', ['$filter', function($filter) {
        return function(val, digits) {
            if(val < 0)
                return "N/A"
            else return $filter('digits')(val, digits)
        }
    }])








