angular.module('dashboardApp.controllers', [])

    .controller('MainCtrl', ['$scope', '$cookieStore', 'dashboardService', 'trackers', function($scope, $cookieStore, dashboardService, trackers) {

        $scope.trackers = trackers
        $scope.trackerList = _.toArray(trackers)
        $scope.watchedMarkets  = $cookieStore.get('watchedMarkets') || $scope.defaultMarkets
        $scope.watchedTrackers = $cookieStore.get('watchedTrackers:'+$scope.user) || _.pluck(trackers, 'id')

        $scope.$watch(function() { return dashboardService.coins   }, function(data) { $scope.coins   = _.toArray(data) }, true)
        $scope.$watch(function() { return dashboardService.markets }, function(data) { $scope.markets = _.toArray(data) }, true)

        $scope.isTrackerWatched = function(val) {
            var id = _.isObject(val) ? val.id : val
            return _.contains($scope.watchedTrackers, id)
        }

        $scope.isMarketWatched = function(val) {
           var id = _.isObject(val) ? val.id : val
           return _.contains($scope.watchedMarkets, id)
        }

        $scope.toggleWatchMarket = function(id) {
            if(_.contains($scope.watchedMarkets, id)) {
                $scope.watchedMarkets = _.without($scope.watchedMarkets, id)
            } else {
                $scope.watchedMarkets.push(id)
            }
            $cookieStore.put('watchedMarkets', $scope.watchedMarkets)
        }

        $scope.toggleWatchTracker = function(id) {
            if(_.contains($scope.watchedTrackers, id)) {
                $scope.watchedTrackers = _.without($scope.watchedTrackers, id)
                $scope.trackers[id].stopPolling()
            } else {
                $scope.watchedTrackers.push(id)
                $scope.trackers[id].startPolling()
            }
            $cookieStore.put('watchedTrackers:'+$scope.user, $scope.watchedTrackers)
        }

    }])