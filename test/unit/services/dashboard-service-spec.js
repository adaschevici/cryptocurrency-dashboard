describe("dashboardService", function() {

    var $rootScope, $interval, dashboardService, mockData;

    beforeEach(function() {
        module('dashboardApp')
        module('dashboardApp.mock.apiInterface')
        inject(function ($injector) {
            $rootScope       = $injector.get('$rootScope')
            $interval        = $injector.get('$interval')
            dashboardService = $injector.get('dashboardService')
            mockData         = $injector.get('mockData')
        })
    })

    it("should instantiate default values", function() {
        expect(dashboardService.coins).toEqual({})
        expect(dashboardService.markets).toEqual({})
        expect(dashboardService.lastUpdated).toEqual(-1)
        expect(dashboardService.pollCount).toEqual(0)
        expect(dashboardService.pollsFailed).toEqual(0)
    })


    it("should return a promise when initialized", function() {
        dashboardService.initialize()
        expect(dashboardService.pollCount).toEqual(0)
        $rootScope.$digest()
        expect(dashboardService.pollCount).toEqual(1)
    })


    describe("data polling", function() {

        beforeEach(function() {
            mockCurrentTime()
            dashboardService.initialize()
            $rootScope.$digest()
        })

        function forceFailedRequest() {
            return inject(function($q, apiInterface) {
                spyOn(apiInterface, 'loadMarkets').andCallFake(function() {
                    var defer = $q.defer()
                    defer.reject()
                    return defer.promise
                })
            })
        }

        it("should poll the dashboard data immediately and then every 3 seconds", function() {
            $interval.flush(2999)
            expect(dashboardService.pollCount).toEqual(1)
            $interval.flush(1)
            expect(dashboardService.pollCount).toEqual(2)
        })


        it("increments the pollsFailed counter when polling fails", function() {
            forceFailedRequest()
            $interval.flush(3000)
            expect(dashboardService.pollsFailed).toEqual(1)
        })


        it("sets the lastUpdated time when successfully polled", function() {
            var oldTime = _.clone(dashboardService).lastUpdated
            $interval.flush(3000)
            var newTime = _.clone(dashboardService).lastUpdated
            expect(newTime).toBeGreaterThan(oldTime)
            forceFailedRequest()
            $interval.flush(3000)
            expect(dashboardService.lastUpdated).toEqual(newTime)
        })


        describe("markets", function() {

            it("should add each market to the markets object", function() {
                angular.forEach(mockData.markets, function(obj, key) {
                    expect(dashboardService.markets[key]).toBeDefined()
                    expect(dashboardService.markets[key]).toEqual(_.clone(obj))
                    expect(dashboardService.markets[key].id).toEqual(key)
                })
            })
        })


        describe("coins", function() {
            var coin

            beforeEach(function() {
                coin = dashboardService.coins[mockData.coins[0].id]
            })

            it("should add each coin to the coins object", function() {
                expect(coin).toBeDefined()
                expect(coin).toEqual(_.clone(coin))
            })

            it("should convert the 'price_btc' value to a number", function() {
                expect(typeof coin.price_btc == 'number').toBeTruthy()
            })

            it("should convert the 'volume_btc' value to a number", function() {
                expect(typeof coin.volume_btc == 'number').toBeTruthy()
            })

            it("should add market rates to each coin", function() {
                angular.forEach(dashboardService.markets, function(market, id) {
                    expect(coin.price_usd[id]).toEqual(market.rates.bid * coin.price_btc)
                })
            })
        })
    })
})