describe("trackerService", function() {

    var $rootScope, apiInterface, trackerService, dashboardService, mockData;

    beforeEach(function() {
        module('dashboardApp')
        module('dashboardApp.mock.apiInterface')
        module('dashboardApp.mock.dashboardService')
        inject(function ($injector) {
            $rootScope       = $injector.get('$rootScope')
            apiInterface     = $injector.get('apiInterface')
            trackerService   = $injector.get('trackerService')
            dashboardService = $injector.get('dashboardService')
            mockData         = $injector.get('mockData')
            mockCurrentTime()
        })
    })


    describe("public methods", function() {

        describe("loadTrackers", function() {

            it("should return a promise", function() {
                trackerService.loadTrackers('usertwo')
                expect(trackerService.loadTracker('arg')).toBeUndefined()
                $rootScope.$digest()
                expect(trackerService.loadTracker('arg')).toBeDefined()
            })

            it("should replace all existing trackers stored in the service", function() {
                var trackers = [], oldKeys, newKeys;

                trackerService.loadTrackers('userone').then(function(data) { trackers = data })
                $rootScope.$digest()
                oldKeys = Object.keys(trackers)
                trackerService.loadTrackers('usertwo').then(function(data) { trackers = data })
                $rootScope.$digest()
                newKeys = Object.keys(trackers)
                expect(newKeys).not.toEqual(oldKeys)
            })

            it("should create a tracker object for each user tracker", function() {
                trackerService.loadTrackers('userone')
                $rootScope.$digest()
                angular.forEach(mockData.trackers.userone, function(obj) {
                    var tracker  = trackerService.loadTracker(obj.id)
                    expect(tracker).toBeDefined()
                })
            })
        })

        describe("loadTracker", function() {

            it("should return a Tracker object belonging to the id passed in", function() {
                trackerService.loadTrackers('userone')
                $rootScope.$digest()
                var id = mockData.trackers.userone[0].id,
                    tracker = trackerService.loadTracker(id)
                expect(tracker.id).toEqual(id)
            })
        })
    })


    describe("Tracker", function() {

        var tracker, liteTracker, userTrackers;

        beforeEach(function() {
            trackerService.loadTrackers('userone')
            $rootScope.$digest()
            userTrackers = mockData.trackers.userone
            tracker      = trackerService.loadTracker(userTrackers[0].id)
            liteTracker  = trackerService.loadTracker(userTrackers[1].id)
        })

        function forceFailedRequest(type) {
            return inject(function($q, apiInterface) {
                spyOn(apiInterface, 'loadTrackerData').andCallFake(function() {
                    var defer = $q.defer()
                    switch(type) {
                        case 'noData': defer.resolve({data: ""}); break;
                        case 'noUserData': defer.resolve({data: { getuserstatus: {} }}); break;
                        case 'stringData': defer.resolve({data: { getuserstatus: { data: "Error!"} }}); break
                        default: defer.reject()
                    }
                    return defer.promise
                })
            })
        }

        function startPolling() {
            tracker.startPolling()
            $rootScope.$digest()
        }


        it("should instantiate the default values", function() {
            expect(liteTracker.name).toEqual(liteTracker.coin.name)
            expect(tracker.id).toEqual(userTrackers[0].id)
            expect(tracker.hasPool).toEqual(userTrackers[0].hasPool)
            expect(tracker.coin).toEqual(dashboardService.coins[userTrackers[0].coinID])
            expect(tracker.name).toEqual(userTrackers[0].name)
            expect(tracker.lastUpdated).toEqual(-1)
        })


        describe("Methods", function() {

            describe("startPolling", function() {

                describe("errors", function() {

                    it("should immediately re-poll up to 5 times if an error is found", function() {
                        forceFailedRequest()
                        startPolling()
                        expect(tracker.pollCount).toEqual(5)
                    })

                    it("resets all errors when polling occurs successfully", function() {
                        tracker.errors = [1,2,3,4,5]
                        startPolling()
                        expect(tracker.errors.length).toEqual(0)
                    })

                    it("adds an error if the remote tracker data is empty", function() {
                        forceFailedRequest('noData')
                        startPolling()
                        expect(tracker.errors.length).toBeGreaterThan(0)
                        expect(tracker.getErrorMessage()).toEqual('The user tracker returned no data.')
                    })

                    it("adds an error if the user tracker is absent", function() {
                        forceFailedRequest('noUserData')
                        startPolling()
                        expect(tracker.errors.length).toBeGreaterThan(0)
                        expect(tracker.getErrorMessage()).toEqual('Invalid tracker.')
                    })

                    it("adds an error if the user data is not an object", function() {
                        forceFailedRequest('noUserData')
                        startPolling()
                        expect(tracker.errors.length).toBeGreaterThan(0)
                        expect(tracker.getErrorMessage()).toEqual('Invalid tracker.')
                    })
                })


                it("should poll for data immediately and then every 3 seconds", inject(function($interval) {
                    startPolling()
                    $interval.flush(2999)
                    expect(tracker.pollCount).toEqual(1)
                    $interval.flush(1)
                    expect(tracker.pollCount).toEqual(2)
                }))


                it("should set the lastUpdated time when polling is successful", inject(function($interval) {
                    startPolling()
                    var oldTime = _.clone(tracker).lastUpdated
                    $interval.flush(3000)
                    var newTime = _.clone(tracker).lastUpdated
                    expect(newTime).toBeGreaterThan(oldTime)
                    forceFailedRequest()
                    $interval.flush(3000)
                    expect(tracker.lastUpdated).toEqual(newTime)
                }))


                it("should add all transactions data to the Tracker", function() {
                    var transactions = mockData.trackerData.active.getuserstatus.data.transactions
                    startPolling()
                    expect(tracker.credit).toEqual(transactions.Credit)
                    expect(tracker.debitAuto).toEqual(transactions.Debit_AP)
                    expect(tracker.debitManual).toEqual(transactions.Debit_MP)
                    expect(tracker.debitTotal).toEqual(tracker.debitAuto + tracker.debitManual)
                    expect(tracker.balance).toEqual(tracker.credit - tracker.debitTotal)
                })


                it("should set each transaction value to -1 if the required data is unavailable", function() {
                    liteTracker.startPolling()
                    $rootScope.$digest()
                    expect(liteTracker.credit).toEqual(-1)
                    expect(liteTracker.debitAuto).toEqual(-1)
                    expect(liteTracker.debitManual).toEqual(-1)
                    expect(liteTracker.debitTotal).toEqual(-1)
                    expect(liteTracker.balance).toEqual(-1)
                })


                it("should create the pool object if the tracker has a pool", function() {
                    startPolling()
                    expect(tracker.pool).toEqual(mockData.poolData.getpoolstatus.data)
                })
            })


            describe("getErrorMessage", function() {

                it("returns the most recent error messages", function() {
                    tracker.errors = ['Alpha', 'Beta', 'Gamma']
                    expect(tracker.getErrorMessage()).toEqual('Gamma')
                })
            })


            describe("stopPolling", function() {

                it("should reset the polling data", function() {
                    tracker.errors = ['Error', 'Error']
                    tracker.pollCount = 3
                    tracker.lastUpdated = new Date().getTime()
                    tracker.stopPolling()
                    expect(tracker.errors.length).toEqual(0)
                    expect(tracker.pollCount).toEqual(0)
                    expect(tracker.lastUpdated).toEqual(-1)
                })


                it("should stop the tracker from polling", inject(function($interval) {
                    startPolling()
                    expect(tracker.pollCount).toEqual(1)
                    tracker.stopPolling()
                    $interval.flush(3000)
                    expect(tracker.pollCount).toEqual(0)
                }))
            })

            describe("isActive", function() {

                it("should return whether the Tracker is active", function() {
                    tracker.hashrate  = 0
                    tracker.sharerate = 0
                    expect(tracker.isActive()).toBe(false)
                    tracker.hashrate  = 1
                    tracker.sharerate = 0
                    expect(tracker.isActive()).toBe(true)
                    tracker.hashrate  = 0
                    tracker.sharerate = 1
                    expect(tracker.isActive()).toBe(true)
                    tracker.hashrate  = 1
                    tracker.sharerate = 1
                    expect(tracker.isActive()).toBe(true)
                })
            })

            describe("getValue", function() {

                it("should return the value in dollars for the specified market", function() {
                    var value = tracker.coin.price_usd.bitfinex * 100
                    expect(tracker.getValue('bitfinex', 100)).toEqual(value)
                })
            })
        })
    })
})