angular.module('dashboardApp.controllers', [])

    .controller('MainCtrl', ['$scope', '$cookieStore', 'dashboardService', function($scope, $cookieStore, dashboardService) {

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

