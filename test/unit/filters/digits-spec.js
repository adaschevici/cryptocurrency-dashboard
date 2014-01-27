describe("digits", function() {

    var filter

    beforeEach(function() {
        module('dashboardApp')
        inject(function($injector) {
            filter = $injector.get("$filter")("digits")
        })
    })

    it("should do nothing if a non-number is passed in", function() {
        expect(filter("Hello", 2)).toEqual("Hello")
        expect(filter("1234!", 2)).toEqual("1234!")
        expect(filter(undefined, 2)).toEqual(undefined)
        expect(filter(null, 2)).toEqual(null)
    })

    it("should do nothing if no digits are passed in", function() {
        expect(filter(200)).toEqual(200)
    })
    
    it("should return a string once filtered", function() {
        expect(filter(50, 2)).toEqual("50")
    })

    it("should return a single digit if 0 is passed in", function() {
        expect(filter(0, 5)).toEqual("0")
    })

    it("should round the integer component if the decimal places are discarded", function() {
        expect(filter(1234.456, 4)).toEqual("1234")
        expect(filter(2345.678, 4)).toEqual("2346")
    })

    it("should return the desired number of digits", function() {
        expect(filter(10.1, 2)).toEqual("10")
        expect(filter(100, 4)).toEqual("100.0")
        expect(filter(0.2345, 4)).toEqual("0.235")
        expect(filter(1234.56, 4)).toEqual("1235")
    })

    it("should never crop digits from the integer component", function() {
        expect(filter(12345, 3)).toEqual("12345")
    })


})



