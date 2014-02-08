angular.module('app').directive 'highlighter',

  ($timeout) ->

    link: (scope, element, attrs) ->
      timeout = null
      klass = null
      duration = Number(attrs.hlDuration) || 2000

      scope.$watch attrs.hlWatch, (newVal, oldVal) ->
        $timeout.cancel timeout
        if newVal isnt oldVal
          if attrs.highlighter is "number"
            if newVal > oldVal
              klass = attrs.hlClassIncrease or "highlighted-increase"
            if(oldVal > newVal)
              klass = attrs.hlClassDecrease or "highlighted-decrease"
          else
            klass = attrs.hlClass or "highlighted"
          element.addClass(klass)
          timeout = $timeout ( -> element.removeClass(klass)), duration
      , true