describe "dashboardService", ->

  $rootScope       = null
  $interval        = null
  mockData         = null
  dashboardService = null

  beforeEach ->
    module 'app'
    module 'app.mock.apiInterface'
    inject ($injector) ->
      $rootScope       = $injector.get '$rootScope'
      $interval        = $injector.get '$interval'
      dashboardService = $injector.get 'dashboardService'
      mockData         = $injector.get 'mockData'


  it "should instantiate default values", ->
    expect(dashboardService.coins).toEqual {}
    expect(dashboardService.markets).toEqual {}
    expect(dashboardService.lastUpdated).toEqual -1
    expect(dashboardService.pollCount).toEqual 0
    expect(dashboardService.pollsFailed).toEqual 0


  it "should return a promise when initialized", ->
    dashboardService.initialize()
    expect(dashboardService.pollCount).toEqual 0
    $rootScope.$digest()
    expect(dashboardService.pollCount).toEqual 1



  describe "data polling", ->

    beforeEach ->
      mockCurrentTime()
      dashboardService.initialize()
      $rootScope.$digest()


    forceFailedRequest = ->
      inject ($q, apiInterface) ->
        spyOn(apiInterface, 'loadMarkets').andCallFake ->
          defer = $q.defer()
          defer.reject()
          defer.promise


    it "should poll the dashboard data immediately and then every 3 seconds", ->
      $interval.flush 2999
      expect(dashboardService.pollCount).toEqual 1
      $interval.flush 1
      expect(dashboardService.pollCount).toEqual 2


    it "increments the pollsFailed counter when polling fails", ->
      forceFailedRequest()
      $interval.flush 3000
      expect(dashboardService.pollsFailed).toEqual 1


    it "sets the lastUpdated time when successfully polled", ->
      oldTime = _.clone(dashboardService).lastUpdated
      $interval.flush 3000
      newTime = _.clone(dashboardService).lastUpdated
      expect(newTime).toBeGreaterThan oldTime
      forceFailedRequest()
      $interval.flush 3000
      expect(dashboardService.lastUpdated).toEqual newTime



    describe "markets", ->

      it "should add each market to the markets object", ->
        angular.forEach mockData.markets, (obj, key) ->
          expect(dashboardService.markets[key]).toBeDefined()
          expect(dashboardService.markets[key]).toEqual _.clone(obj)
          expect(dashboardService.markets[key].id).toEqual key



    describe "coins", ->
      coin = null

      beforeEach ->
        coin = dashboardService.coins[mockData.coins[0].id]


      it "should add each coin to the coins object", ->
        expect(coin).toBeDefined()
        expect(coin).toEqual _.clone(coin)


      it "should convert the 'price_btc' value to a number", ->
        expect(typeof coin.price_btc is 'number').toBeTruthy()


      it "should convert the 'volume_btc' value to a number", ->
        expect(typeof coin.volume_btc is 'number').toBeTruthy()


      it "should add market rates to each coin", ->
        angular.forEach dashboardService.markets, (market, id) ->
          expect(coin.price_usd[id]).toEqual market.rates.bid * coin.price_btc