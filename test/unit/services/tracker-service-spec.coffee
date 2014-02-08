describe "trackerService", ->

  $rootScope       = null
  apiInterface     = null
  trackerService   = null
  dashboardService = null
  mockData         = null

  beforeEach ->
    module 'app'
    module 'app.mock.apiInterface'
    module 'app.mock.dashboardService'
    inject ($injector) ->
      $rootScope       = $injector.get '$rootScope'
      apiInterface     = $injector.get 'apiInterface'
      trackerService   = $injector.get 'trackerService'
      dashboardService = $injector.get 'dashboardService'
      mockData         = $injector.get 'mockData'
      mockCurrentTime()


  describe "public methods", ->

    describe "loadTrackers", ->

      it "should return a promise", ->
        trackerService.loadTrackers('usertwo')
        expect(trackerService.loadTracker('arg')).toBeUndefined()
        $rootScope.$digest()
        expect(trackerService.loadTracker('arg')).toBeDefined()


      it "should replace all existing trackers stored in the service", ->
        trackers = []
        oldKeys  = []
        newKeys  = []
        trackerService.loadTrackers('userone').then (data) -> trackers = data
        $rootScope.$digest()
        oldKeys = Object.keys trackers
        trackerService.loadTrackers('usertwo').then (data) -> trackers = data
        $rootScope.$digest()
        newKeys = Object.keys trackers
        expect(newKeys).not.toEqual oldKeys


      it "should create a tracker object for each user tracker", ->
        trackerService.loadTrackers 'userone'
        $rootScope.$digest()
        angular.forEach mockData.trackers.userone, (obj) ->
          tracker  = trackerService.loadTracker obj.id
          expect(tracker).toBeDefined()



    describe "loadTracker", ->

      it "should return a Tracker object belonging to the id passed in", ->
        trackerService.loadTrackers 'userone'
        $rootScope.$digest()
        id = mockData.trackers.userone[0].id
        tracker = trackerService.loadTracker id
        expect(tracker.id).toEqual id



  describe "Tracker", ->

    tracker      = null
    liteTracker  = null
    userTrackers = null

    beforeEach ->
      trackerService.loadTrackers 'userone'
      $rootScope.$digest()
      userTrackers = mockData.trackers.userone
      tracker      = trackerService.loadTracker(userTrackers[0].id)
      liteTracker  = trackerService.loadTracker(userTrackers[1].id)


    forceFailedRequest = (type) ->
      inject ($q, apiInterface) ->
        spyOn(apiInterface, 'loadTrackerData').andCallFake ->
          defer = $q.defer()
          switch type
            when 'noData' then defer.resolve {data: ""}
            when 'noUserData' then defer.resolve {data: { getuserstatus: {} }}
            when 'stringData' then defer.resolve {data: { getuserstatus: { data: "Error!"} }}
            else defer.reject()
          defer.promise


    poll = ->
      tracker.pollData()
      $rootScope.$digest()


    it "should instantiate the default values", ->
      expect(liteTracker.name).toEqual liteTracker.coin.name
      expect(tracker.id).toEqual userTrackers[0].id
      expect(tracker.hasPool).toEqual userTrackers[0].hasPool
      expect(tracker.coin).toEqual dashboardService.coins[userTrackers[0].coinID]
      expect(tracker.name).toEqual userTrackers[0].name
      expect(tracker.lastUpdated).toEqual -1


    describe "Methods", ->

      describe "startPolling", ->

        describe "errors", ->

          it "should immediately re-poll up to 5 times if an error is found", ->
            forceFailedRequest()
            tracker.startPolling()
            $rootScope.$digest()
            expect(tracker.pollCount).toEqual 5


          it "should poll for data immediately and then every 3 seconds", inject ($interval) ->
            tracker.startPolling()
            $rootScope.$digest()
            $interval.flush 2999
            expect(tracker.pollCount).toEqual 1
            $interval.flush 1
            expect(tracker.pollCount).toEqual 2


      describe "pollData", ->

        it "resets all errors when polling occurs successfully", ->
          tracker.errors = [1,2,3,4,5]
          poll()
          expect(tracker.errors.length).toEqual 0


        it "adds an error if the remote tracker data is empty", ->
          forceFailedRequest 'noData'
          poll()
          expect(tracker.errors.length).toBeGreaterThan 0
          expect(tracker.getErrorMessage()).toEqual 'The user tracker returned no data.'


        it "adds an error if the user tracker is absent", ->
          forceFailedRequest 'noUserData'
          poll()
          expect(tracker.errors.length).toBeGreaterThan 0
          expect(tracker.getErrorMessage()).toEqual 'Invalid tracker.'


        it "adds an error if the user data is not an object", ->
          forceFailedRequest 'noUserData'
          poll()
          expect(tracker.errors.length).toBeGreaterThan 0
          expect(tracker.getErrorMessage()).toEqual 'Invalid tracker.'


        it "should set the lastUpdated time when polling is successful", ->
          poll()
          oldTime = _.clone(tracker).lastUpdated
          poll()
          newTime = _.clone(tracker).lastUpdated
          expect(newTime).toBeGreaterThan oldTime
          forceFailedRequest()
          poll()
          expect(tracker.lastUpdated).toEqual newTime


        it "should add all transactions data to the Tracker", ->
          transactions = mockData.trackerData.active.getuserstatus.data.transactions
          poll()
          expect(tracker.credit).toEqual transactions.Credit
          expect(tracker.debitAuto).toEqual transactions.Debit_AP
          expect(tracker.debitManual).toEqual transactions.Debit_MP
          expect(tracker.debitTotal).toEqual tracker.debitAuto + tracker.debitManual
          expect(tracker.balance).toEqual tracker.credit - tracker.debitTotal


        it "should set each transaction value to -1 if the required data is unavailable", ->
          liteTracker.pollData()
          $rootScope.$digest()
          expect(liteTracker.credit).toEqual -1
          expect(liteTracker.debitAuto).toEqual -1
          expect(liteTracker.debitManual).toEqual -1
          expect(liteTracker.debitTotal).toEqual -1
          expect(liteTracker.balance).toEqual -1


        it "should create the pool object if the tracker has a pool", ->
          poll()
          expect(tracker.pool).toEqual mockData.poolData.getpoolstatus.data


      describe "getErrorMessage", ->

        it "returns the most recent error messages", ->
          tracker.errors = ['Alpha', 'Beta', 'Gamma']
          expect(tracker.getErrorMessage()).toEqual 'Gamma'


      describe "stopPolling", ->

        it "should reset the polling data", ->
          tracker.errors = ['Error', 'Error']
          tracker.pollCount = 3
          tracker.lastUpdated = new Date().getTime()
          tracker.stopPolling()
          expect(tracker.errors.length).toEqual 0
          expect(tracker.pollCount).toEqual 0
          expect(tracker.lastUpdated).toEqual -1


        it "should stop the tracker from polling", inject ($interval) ->
          tracker.startPolling()
          expect(tracker.pollCount).toEqual(1)
          tracker.stopPolling()
          $interval.flush(3000)
          expect(tracker.pollCount).toEqual(0)


      describe "isActive", ->

        it "should return whether the Tracker is active", ->
          tracker.hashrate  = 0
          tracker.sharerate = 0
          expect(tracker.isActive()).toBe false
          tracker.hashrate  = 1
          tracker.sharerate = 0
          expect(tracker.isActive()).toBe true
          tracker.hashrate  = 0
          tracker.sharerate = 1
          expect(tracker.isActive()).toBe true
          tracker.hashrate  = 1
          tracker.sharerate = 1
          expect(tracker.isActive()).toBe true


      describe "getValue", ->

        it "should return the value in dollars for the specified market", ->
          value = tracker.coin.price_usd.bitfinex * 100
          expect(tracker.getValue('bitfinex', 100)).toEqual value