describe("highlighter", function() {

    var $rootScope, $compile, element

    beforeEach(function() {
        module.apply(this, TestDependencies)
        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope')
            $compile   = $injector.get('$compile')
        })
        $rootScope.exp = 100
        $rootScope.$digest()
    })

    function compileElement(markup) {
        element = $compile(jQuery(markup))($rootScope)
        $rootScope.$digest()
    }

    function setWatchedValue(val) {
        $rootScope.exp = val
        $rootScope.$digest()
    }


    describe("when the highlighter is of no explicit type", function() {

        it("should highlight when the watched value changes", function() {
            compileElement('<div highlighter hl-watch="exp"></div>')
            setWatchedValue("Hello")
            expect(element.hasClass('highlighted')).toBe(true)
            compileElement('<div highlighter hl-watch="exp" hl-class="custom-highlight"></div>')
            setWatchedValue("World")
            expect(element.hasClass('custom-highlight')).toBe(true)
        })
    })


    describe("when the highlighter is of type 'number", function() {

        it("should do nothing if the observed change features a non-number", function() {
            compileElement('<div highlighter="number" hl-watch="exp"></div>')
            var klass = element.attr('class')
            setWatchedValue('foo')
            expect(element.attr('class')).toEqual(klass)
            setWatchedValue(44)
            expect(element.attr('class')).toEqual(klass)
        })

        it("should highlight any increase to the watched value", function() {
            compileElement('<div highlighter="number" hl-watch="exp"></div>')
            setWatchedValue(101)
            expect(element.hasClass('highlighted-increase')).toBe(true)
            compileElement('<div highlighter="number" hl-class-increase="increased" hl-watch="exp"></div>')
            setWatchedValue(102)
            expect(element.hasClass('increased')).toBe(true)
        })

        it("should highlight any decrease to the watched value", function() {
            compileElement('<div highlighter="number" hl-watch="exp"></div>')
            setWatchedValue(99)
            expect(element.hasClass('highlighted-decrease')).toBe(true)
            compileElement('<div highlighter="number" hl-class-decrease="decreased" hl-watch="exp"></div>')
            setWatchedValue(98)
            expect(element.hasClass('decreased')).toBe(true)
        })

    })


    it("removes any highlight at the end of its duration", inject(function ($timeout) {
        compileElement('<div highlighter hl-watch="exp"></div>')
        setWatchedValue(99)
        $timeout.flush(1999)
        expect(element.hasClass('highlighted')).toBe(true)
        $timeout.flush(1)
        expect(element.hasClass('highlighted')).toBe(false)
        compileElement('<div highlighter hl-watch="exp" hl-duration="3000"></div>')
        setWatchedValue(100)
        $timeout.flush(2999)
        expect(element.hasClass('highlighted')).toBe(true)
        $timeout.flush(1)
        expect(element.hasClass('highlighted')).toBe(false)
    }))


    it("overrides any existing $timeout if a new highlight is applied", inject(function($timeout) {
        compileElement('<div highlighter hl-watch="exp"></div>')
        setWatchedValue(99)
        $timeout.flush(1000)
        setWatchedValue(100)
        $timeout.flush(1999)
        expect(element.hasClass('highlighted')).toBe(true)
    }))

})