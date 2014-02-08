angular.module('app').controller 'MainCtrl',

  ($scope, $cookieStore, dashboardService, trackers, $templateCache) ->

    $scope.trackers = trackers
    $scope.trackerList = _.toArray(trackers)
    $scope.watchedMarkets  = $cookieStore.get("watchedMarkets") || $scope.defaultMarkets
    $scope.watchedTrackers = $cookieStore.get("watchedTrackers:#{$scope.user}") || _.pluck(trackers, 'id')

    $scope.$watch(
      -> dashboardService.coins
      -> $scope.coins = _.toArray dashboardService.coins
      true
    )

    $scope.$watch(
      -> dashboardService.markets
      -> $scope.markets = _.toArray dashboardService.markets
      true
    )

    $scope.loggg = ->
      console.log $templateCache.grt()

    $scope.isTrackerWatched = (val) ->
      id = if _.isObject(val) then val.id else val
      _.contains($scope.watchedTrackers, id)


    $scope.isMarketWatched = (val) ->
      id = if _.isObject(val) then val.id else val
      _.contains($scope.watchedMarkets, id)


    $scope.toggleWatchMarket = (id) ->
      if _.contains($scope.watchedMarkets, id)
        $scope.watchedMarkets = _.without($scope.watchedMarkets, id)
      else
        $scope.watchedMarkets.push(id)
      $cookieStore.put "watchedMarkets", $scope.watchedMarkets


    $scope.toggleWatchTracker = (id) ->
      if _.contains($scope.watchedTrackers, id)
        $scope.watchedTrackers = _.without($scope.watchedTrackers, id)
        $scope.trackers[id].stopPolling()
      else
        $scope.watchedTrackers.push(id)
        $scope.trackers[id].startPolling()
      $cookieStore.put "watchedTrackers:#{$scope.user}", $scope.watchedTrackers
