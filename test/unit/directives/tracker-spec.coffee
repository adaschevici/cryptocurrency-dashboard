describe "tracker", ->

  $scope         = null
  element        = null
  $compile       = null
  $rootScope     = null
  trackerService = null
  tracker        = null

  beforeEach ->
    module 'app'
    module 'app.mock.trackerService'
    module 'templates'
    inject ($injector) ->
      $compile       = $injector.get '$compile'
      $rootScope     = $injector.get '$rootScope'
      trackerService = $injector.get 'trackerService'
      tracker        = trackerService.loadTracker()

  compileElement = ->
    element = $compile(jQuery('<tracker tracker-id="active"></tracker>'))($rootScope)
    $scope  = $rootScope.$$childTail
    $rootScope.$digest()


  it "should load the tracker specified by the tracker-id attribute", ->
    spy = spyOn(trackerService, 'loadTracker').andCallThrough()
    compileElement()
    expect(spy).toHaveBeenCalledWith 'active'


  it "should set the trackerLoaded if the tracker's lastUpdated is greater than -1", ->
    compileElement()
    $scope.tracker.lastUpdated = -1
    $scope.$digest()
    expect($scope.trackerLoaded).toBe false
    $scope.tracker.lastUpdated = 1
    $scope.$digest()
    expect($scope.trackerLoaded).toBe true


  it "should display an error message if the tracker error count reaches 5", inject ($q) ->
    compileElement()
    tracker.errors = ['A','B','C','D']
    $scope.$digest()
    expect(element.find('.error-message').length).toEqual 0
    tracker.errors = ['A','B','C','D','E']
    $scope.$digest()
    expect(element.find('.error-message').length).toEqual 1


  it "should instantiate the default values", ->
    compileElement()
    expect($scope.tracker).toEqual tracker
    expect($scope.coinID).toEqual tracker.coinID
    expect($scope.coinPriceBtc).toEqual tracker.coin.price_btc
    expect($scope.requestCompleted).toBe true
    expect($scope.trackerLoaded).toBe true
    expect($scope.errorMessage).toBeNull()


  it "should watch for changes to the loaded tracker", ->
    compileElement()
    $scope.tracker.debitTotal = 1000
    $scope.$digest()
    expect(element.find('.user-data .debit-total').text()).toEqual '1000'


  it "should display the ajax-loader until the request is completed", ->
    compileElement()
    expect(element.find('.loading').length).toEqual 0
    $scope.requestCompleted = false
    $scope.$digest()
    expect(element.find('.loading').length).toEqual 1


  it "should display the user data if it exists on the tracker", ->
    compileElement()
    expect(element.find('.user-data').length).toEqual 1
    $scope.trackerLoaded = false
    $scope.$digest()
    expect(element.find('.user-data').length).toEqual 0


  it "should display the pool data if it exists on the tracker", ->
    compileElement()
    expect(element.find('.pool-data').length).toEqual 1
    $scope.tracker.pool = null
    $scope.$digest()
    expect(element.find('.pool-data').length).toEqual 0