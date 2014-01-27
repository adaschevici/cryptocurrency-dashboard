describe("titleCase", function() {

    var filter

    beforeEach(function() {
        module('dashboardApp')
        inject(function ($injector) {
            filter =  $injector.get('$filter')('titleCase')
        })
    })

    it("should return undefined when undefined is passed in", function() {
        expect(filter(undefined)).toBeUndefined()
    })

    it("should return null when null is passed in", function() {
        expect(filter(null)).toBeNull()
    })

    it("should return a blank string when a blank string is passed in", function() {
        expect(filter("")).toEqual("")
    })

    it("should chase the casing of a lower-cased word", function() {
        expect(filter("bitcoin mining")).toEqual("Bitcoin Mining")
    })

    it("should chase the casing of an upper-cased word", function() {
        expect(filter("COIN")).toEqual("Coin")
    })

    it("should chase the casing of random", function() {
        expect(filter("BiTCoiN")).toEqual("Bitcoin")
    })

    it("should place nice with a normal phrase", function() {
        expect(filter("Bitcoin Mining")).toEqual("Bitcoin Mining")
    })

})
