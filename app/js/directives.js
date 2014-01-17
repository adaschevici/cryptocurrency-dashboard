angular.module('dashboardApp.directives', [])

    .directive('highlighter', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.hlWatch, function (newVal, oldVal) {
                    var duration = attrs.hlDuration || 2000,
                        klass

                    if(newVal !== oldVal) {
                        if(attrs.highlighter === 'number') {
                            if(newVal > oldVal) {
                                klass = attrs.hlClassIncrease || "highlighted-increase"
                            }
                            if(oldVal > newVal) {
                                klass = attrs.hlClassDecrease || "highlighted-decrease"
                            }
                        } else {
                            klass = attrs.hlClass || 'highlighted'
                        }
                        element.addClass(klass)
                        $timeout(function () {
                            element.removeClass(klass)
                        }, duration)
                    }
                }, true)
            }
        }
    }])


    .directive('tracker', ['trackerService', function (trackerService) {
        return {
            restrict: "E",
            replace: true,
            scope: true,
            templateUrl: "views/tracker.html",
            link: function (scope, element, attrs) {

                scope.tracker = trackerService.loadTracker(attrs.trackerId)
                scope.$watch('tracker', function(data) {
                    scope.coinID  = data.coin.id
                    scope.coinPriceBtc  = data.coin.price_btc
                }, true)

                scope.loadTracker = function() {
                    scope.requestCompleted = false
                    scope.trackerLoaded = false
                    scope.tracker.startPolling().then(function() {
                        scope.trackerLoaded = true
                    }, function(errorMessage) {
                        scope.errorMessage = errorMessage
                    }).finally(function() {
                        scope.requestCompleted = true
                    })
                }
                scope.loadTracker()
            }
        }
    }])