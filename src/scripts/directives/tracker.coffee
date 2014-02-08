angular.module('app').directive 'tracker',

  (trackerService) ->

    restrict: "E"
    replace: false
    scope: true
    templateUrl: "views/tracker.html"
    link: (scope, element, attrs) ->

      scope.tracker = trackerService.loadTracker attrs.trackerId
      scope.tracker.startPolling()

      scope.errorMessage = null
      scope.requestCompleted = false
      scope.trackerLoaded = false

      scope.$watch 'tracker', (data) ->
        if scope.tracker.lastUpdated > -1 or scope.tracker.errors.length > 4
          scope.requestCompleted = true

        scope.coinID  = data.coin.id
        scope.coinPriceBtc = data.coin.price_btc

        if scope.tracker.lastUpdated is -1
          scope.trackerLoaded = false
        else
          scope.trackerLoaded = true

        if scope.tracker.errors.length < 5
          scope.errorMessage = null
        else
          scope.errorMessage = scope.tracker.getErrorMessage()
          scope.trackerLoaded = false
      , true