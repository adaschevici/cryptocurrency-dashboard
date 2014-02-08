describe "MainCtrl", ->

  $rootScope       = null
  $scope           = null
  $controller      = null
  $cookieStore     = null
  controller       = null
  dashboardService = null
  trackers         = null

  beforeEach ->
    module 'app'
    module 'app.mock.dashboardService'
    module 'app.mock.trackerService'
    module 'templates'
    inject ($injector) ->
      $rootScope       = $injector.get '$rootScope'
      $scope           = $rootScope.$new()
      $controller      = $injector.get '$controller'
      $cookieStore     = $injector.get '$cookieStore'
      dashboardService = $injector.get 'dashboardService'
      trackers         = $injector.get('trackerService').loadTrackers()
      controller       = $controller "MainCtrl", {$scope: $scope, $cookieStore: $cookieStore, trackers: trackers}
    $rootScope.user = 'test-user'



  it "should instantiate its default values", ->
    expect($scope.user).toEqual 'test-user'
    expect($scope.trackers).toEqual trackers
    expect($scope.trackerList).toEqual _.toArray trackers
    expect($scope.watchedTrackers).toEqual _.pluck trackers, 'id'



  describe "cookies", ->

    beforeEach ->
      spyOn($cookieStore, 'get').andCallFake (key) ->
        switch key
          when 'watchedMarkets' then return ['mtgox', 'btce']
          when 'watchedTrackers:test-user' then return ['trackerone', 'trackertwo']
      controller = $controller "MainCtrl", {$scope: $scope, trackers: trackers}


    it "should populate the watchedMarkets from a cookie, if present", ->
      expect($scope.watchedMarkets).toEqual ['mtgox', 'btce']


    it "should populate the watchedTrackers from a cookie, if present", ->
      expect($scope.watchedTrackers).toEqual ['trackerone', 'trackertwo']



  describe "isTrackerWatched", ->

    it "returns true or false depending on whether the passed tracker is watched", ->
      $scope.watchedTrackers = ['yes']
      expect($scope.isTrackerWatched('no')).toBe false
      expect($scope.isTrackerWatched({id: 'no'})).toBe false
      expect($scope.isTrackerWatched('yes')).toBe true
      expect($scope.isTrackerWatched({id: 'yes'})).toBe true



  describe "isMarketWatched", ->

    it "returns true or false depending on whether the passed market is watched", ->
      $scope.watchedMarkets = ['mtgox']
      expect($scope.isMarketWatched('btce')).toBe false
      expect($scope.isMarketWatched({id: 'btce'})).toBe false
      expect($scope.isMarketWatched('mtgox')).toBe true
      expect($scope.isMarketWatched({id: 'mtgox'})).toBe true



  describe "toggleWatchMarket", ->

    it "switches the passed market in and out of the watchedMarkets array", ->
      $scope.watchedMarkets = ['one']
      $scope.toggleWatchMarket 'one'
      expect($scope.watchedMarkets).toEqual []
      $scope.toggleWatchMarket 'one'
      expect($scope.watchedMarkets).toEqual ['one']


    it "saves the watched trackers in the cookie store", ->
      $scope.watchedMarkets = ['market']
      $scope.toggleWatchMarket 'btce'
      expect($cookieStore.get('watchedMarkets')).toEqual ['market', 'btce']
      $scope.toggleWatchMarket 'market'
      expect($cookieStore.get('watchedMarkets')).toEqual ['btce']



  describe "toggleWatchTracker", ->

    it "switches the passed tracker in and out of the watched trackers", ->
      $scope.watchedTrackers = ['anc']
      $scope.toggleWatchTracker 'anc'
      expect($scope.watchedTrackers).toEqual []
      $scope.toggleWatchTracker 'anc'
      expect($scope.watchedTrackers).toEqual ['anc']


    it "sets the tracker polling when adding it to the watched trackers", ->
      tracker = $scope.trackers.anc
      spy = spyOn(tracker, 'startPolling').andCallThrough()
      $scope.watchedTrackers = []
      $scope.toggleWatchTracker tracker.id
      expect(spy).toHaveBeenCalled()


    it "stops the tracker polling when removing from the watched trackers", ->
      tracker = $scope.trackers.anc
      spy = spyOn(tracker, 'stopPolling').andCallThrough()
      $scope.watchedTrackers = ['anc']
      $scope.toggleWatchTracker tracker.id
      expect(spy).toHaveBeenCalled()


    it "saves the watched trackers in the cookie store", ->
      $scope.watchedTrackers = []
      $scope.toggleWatchTracker 'anc'
      expect($cookieStore.get('watchedTrackers:test-user')).toEqual ['anc']
      $scope.toggleWatchTracker 'anc'
      expect($cookieStore.get('watchedTrackers:test-user')).toEqual []