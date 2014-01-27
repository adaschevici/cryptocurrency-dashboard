describe("MainCtrl", function() {

    var $rootScope,
        $scope,
        $cookieStore,
        $controller,
        dashboardService,
        trackers,
        controller;

    beforeEach(function() {
        module('dashboardApp')
        module('dashboardApp.mock.dashboardService')
        module('dashboardApp.mock.trackerService')
        module('templates')
        inject(function($injector) {
            $rootScope       = $injector.get('$rootScope')
            $scope           = $rootScope.$new()
            $controller      = $injector.get('$controller')
            $cookieStore     = $injector.get('$cookieStore')
            dashboardService = $injector.get('dashboardService'),
            trackers         = $injector.get('trackerService').loadTrackers()
            controller       = $controller("MainCtrl", {$scope: $scope, $cookieStore: $cookieStore, trackers: trackers})
        })
        $rootScope.user = 'test-user'
    })

    describe("cookies", function() {
        beforeEach(function() {
            spyOn($cookieStore, 'get').andCallFake(function(key) {
                switch(key) {
                    case 'watchedMarkets':  return ['mtgox', 'btce']
                    case 'watchedTrackers:test-user': return ['trackerone', 'trackertwo']
                }
            })
            controller = $controller("MainCtrl", {$scope: $scope, trackers: trackers})
        })

        it("should populate the watchedMarkets from a cookie, if present", function() {
            expect($scope.watchedMarkets).toEqual(['mtgox', 'btce'])
        })

        it("should populate the watchedTrackers from a cookie, if present", function() {
            expect($scope.watchedTrackers).toEqual(['trackerone', 'trackertwo'])
        })
    })


    it("should instantiate its default values", function() {
        expect($scope.user).toEqual('test-user')
        expect($scope.trackers).toEqual(trackers)
        expect($scope.trackerList).toEqual(_.toArray(trackers))
        expect($scope.watchedTrackers).toEqual(_.pluck(trackers, 'id'))
    })


    describe("isTrackerWatched", function() {
        it("returns true or false depending on whether the passed tracker is watched", function() {
            $scope.watchedTrackers = ['yes']
            expect($scope.isTrackerWatched('no')).toBe(false)
            expect($scope.isTrackerWatched({id: 'no'})).toBe(false)
            expect($scope.isTrackerWatched('yes')).toBe(true)
            expect($scope.isTrackerWatched({id: 'yes'})).toBe(true)
        })
    })


    describe("isMarketWatched", function() {
        it("returns true or false depending on whether the passed market is watched", function() {
            $scope.watchedMarkets = ['mtgox']
            expect($scope.isMarketWatched('btce')).toBe(false)
            expect($scope.isMarketWatched({id: 'btce'})).toBe(false)
            expect($scope.isMarketWatched('mtgox')).toBe(true)
            expect($scope.isMarketWatched({id: 'mtgox'})).toBe(true)
        })
    })

    describe("toggleWatchMarket", function() {
        it("switches the passed market in and out of the watchedMarkets array", function() {
            $scope.watchedMarkets = ['one']
            $scope.toggleWatchMarket('one')
            expect($scope.watchedMarkets).toEqual([])
            $scope.toggleWatchMarket('one')
            expect($scope.watchedMarkets).toEqual(['one'])
        })

        it("saves the watched trackers in the cookie store", function() {
            $scope.watchedMarkets = ['market']
            $scope.toggleWatchMarket('btce')
            expect($cookieStore.get('watchedMarkets')).toEqual(['market', 'btce'])
            $scope.toggleWatchMarket('market')
            expect($cookieStore.get('watchedMarkets')).toEqual(['btce'])
        })
    })

    describe("toggleWatchTracker", function() {

        it("switches the passed tracker in and out of the watched trackers", function() {
            $scope.watchedTrackers = ['anc']
            $scope.toggleWatchTracker('anc')
            expect($scope.watchedTrackers).toEqual([])
            $scope.toggleWatchTracker('anc')
            expect($scope.watchedTrackers).toEqual(['anc'])
        })

        it("sets the tracker polling when adding it to the watched trackers", function() {
            var tracker = tracker = $scope.trackers.anc,
                spy = spyOn(tracker, 'startPolling').andCallThrough()
            $scope.watchedTrackers = []
            $scope.toggleWatchTracker(tracker.id)
            expect(spy).toHaveBeenCalled()
        })

        it("stops the tracker polling when removing from the watched trackers", function() {
            var tracker = $scope.trackers.anc,
                spy = spyOn(tracker, 'stopPolling').andCallThrough()
            $scope.watchedTrackers = ['anc']
            $scope.toggleWatchTracker(tracker.id)
            expect(spy).toHaveBeenCalled()
        })

        it("saves the watched trackers in the cookie store", function() {
            $scope.watchedTrackers = []
            $scope.toggleWatchTracker('anc')
            expect($cookieStore.get('watchedTrackers:test-user')).toEqual(['anc'])
            $scope.toggleWatchTracker('anc')
            expect($cookieStore.get('watchedTrackers:test-user')).toEqual([])
        })
    })



})

