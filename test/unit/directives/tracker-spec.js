describe("tracker", function() {

    var $scope, element, $compile, $rootScope, tracker;

    beforeEach(function() {
        module('dashboardApp')
        module('dashboardApp.mock.trackerService')
        module('templates')
        inject(function ($injector) {
            $compile   = $injector.get('$compile')
            $rootScope = $injector.get('$rootScope')
            tracker    = $injector.get('trackerService').loadTracker()
        })
    })

    function compileElement() {
        element = $compile(jQuery('<tracker tracker-id="active"></tracker>'))($rootScope)
        $scope  = $rootScope.$$childTail
        $rootScope.$digest()
    }


    it("should set the trackerLoaded if the tracker's lastUpdated is greater than -1", function() {
        compileElement()
        $scope.tracker.lastUpdated = -1
        $scope.$digest()
        expect($scope.trackerLoaded).toBe(false)
        $scope.tracker.lastUpdated = 1
        $scope.$digest()
        expect($scope.trackerLoaded).toBe(true)
    })


    it("should display an error message if the tracker error count reaches 5", inject(function($q) {
        compileElement()
        tracker.errors = ['A','B','C','D']
        $scope.$digest()
        expect(element.find('.error-message').length).toEqual(0)
        tracker.errors = ['A','B','C','D','E']
        $scope.$digest()
        expect(element.find('.error-message').length).toEqual(1)
    }))


    it("should instantiate the default values", function() {
        compileElement()
        expect($scope.tracker).toEqual(tracker)
        expect($scope.coinID).toEqual(tracker.coinID)
        expect($scope.coinPriceBtc).toEqual(tracker.coin.price_btc)
        expect($scope.requestCompleted).toBe(true)
        expect($scope.trackerLoaded).toBe(true)
        expect($scope.errorMessage).toBeNull()
    })


    it("should display the ajax-loader until the request is completed", function() {
        compileElement()
        expect(element.find('.loading').length).toEqual(0)
        $scope.requestCompleted = false
        $scope.$digest()
        expect(element.find('.loading').length).toEqual(1)
    })


    it("should display the user data if it exists on the tracker", function() {
        compileElement()
        expect(element.find('.user-data').length).toEqual(1)
        $scope.trackerLoaded = false
        $scope.$digest()
        expect(element.find('.user-data').length).toEqual(0)
    })


    it("should display the pool data if it exists on the tracker", function() {
        compileElement()
        expect(element.find('.pool-data').length).toEqual(1)
        $scope.tracker.pool = null
        $scope.$digest()
        expect(element.find('.pool-data').length).toEqual(0)
    })

})