angular.module('dashboardApp.filters', [])

    .filter('digits', function() {
        return function(val, digits) {
            if(!_.isUndefined(val)) {
                if(val == 0)
                    return "0";
                var number = val.toString(),
                    parts  = number.split('.'),
                    decimalPlaces = digits - parts[0].length

                if(decimalPlaces < 1)
                    return parts[0]
                return Number(number).toFixed(decimalPlaces)
            } else return val
        }
    })

    .filter('dollarize', ['$filter', function($filter) {
        return function (val, decimalPlaces) {
            return '$' + $filter('number')(val, decimalPlaces)
        }
    }])

    .filter('timelapse', ['$filter', function($filter) {
        return function(val) {
            var elapsed = (new Date().getTime() - val) / 1000
            switch(true) {
                case (elapsed < 10): return 'just now'
                case (elapsed < 30): return 'a moment ago'
                case (elapsed < 60): return 'under a minute ago'
                default: return $filter('date')(val, 'mediumTime')
            }
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








