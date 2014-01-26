angular.module('dashboardApp.directives', [])

    .directive('highlighter', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                var timeout, klass,
                    duration = Number(attrs.hlDuration) || 2000

                scope.$watch(attrs.hlWatch, function (newVal, oldVal) {
                    $timeout.cancel(timeout)
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
                        timeout = $timeout(function () {
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
            templateUrl: "app/views/tracker.html",
            link: function (scope, element, attrs) {

                scope.tracker = trackerService.loadTracker(attrs.trackerId)
                scope.tracker.startPolling()

                scope.errorMessage = null
                scope.requestCompleted = false
                scope.trackerLoaded = false

                scope.$watch('tracker', function(data) {

                    if(scope.tracker.lastUpdated > -1 || scope.tracker.errors.length > 4)
                        scope.requestCompleted = true

                    scope.coinID  = data.coin.id
                    scope.coinPriceBtc = data.coin.price_btc

                    if(scope.tracker.lastUpdated == -1)
                        scope.trackerLoaded = false
                    else scope.trackerLoaded = true

                    if(scope.tracker.errors.length < 5)
                        scope.errorMessage = null
                    else scope.errorMessage = scope.tracker.getErrorMessage()

                }, true)
            }
        }
    }])