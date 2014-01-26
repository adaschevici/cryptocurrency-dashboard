describe("trackerUnits", function() {

    var filter

    beforeEach(function() {
        module.apply(this, TestDependencies)
        inject(function ($injector) {
            filter =  $injector.get('$filter')('trackerUnits')
        })
    })
    
    it("should return N/A if the number is negative", function() {
        expect(filter(-1)).toEqual("N/A")
    })

})
