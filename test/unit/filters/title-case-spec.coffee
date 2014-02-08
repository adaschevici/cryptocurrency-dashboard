describe "titleCase", ->

  filter = null

  beforeEach ->
    module 'app'
    inject ($injector) ->
      filter = $injector.get('$filter')('titleCase')


  it "should return undefined when undefined is passed in", ->
    expect(filter(undefined)).toBeUndefined()


  it "should return null when null is passed in", ->
    expect(filter(null)).toBeNull()


  it "should return a blank string when a blank string is passed in", ->
    expect(filter("")).toEqual ""


  it "should chase the casing of a lower-cased word", ->
    expect(filter("bitcoin mining")).toEqual "Bitcoin Mining"


  it "should chase the casing of an upper-cased word", ->
    expect(filter("COIN")).toEqual "Coin"


  it "should chase the casing of random", ->
    expect(filter("BiTCoiN")).toEqual "Bitcoin"


  it "should place nice with a normal phrase", ->
    expect(filter("Bitcoin Mining")).toEqual "Bitcoin Mining"