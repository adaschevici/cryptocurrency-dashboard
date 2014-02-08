describe "dollarize", ->

  filter = null

  beforeEach ->
    module 'app'
    inject ($injector) ->
      filter = $injector.get('$filter')('dollarize')


  it "should prefix results with a dollar sign", ->
    expect(filter(20)).toEqual("$20")


  it "should round to the nearest dollar by default", ->
    expect(filter(20.67)).toEqual("$21")
    expect(filter(20.47)).toEqual("$20")


  it "should round to 2 decimal places when cents are required", ->
    expect(filter(20.4444, true)).toEqual "$20.44"
    expect(filter(100, true)).toEqual "$100.00"