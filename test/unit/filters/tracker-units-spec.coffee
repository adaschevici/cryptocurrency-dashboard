describe "trackerUnits", ->

  filter = null

  beforeEach ->
    module 'app'
    inject ($injector) ->
      filter =  $injector.get('$filter')('trackerUnits')


  it "should return N/A if the number is negative", ->
    expect(filter(-1)).toEqual "N/A"


  # Otherwise relies on digits unit tests