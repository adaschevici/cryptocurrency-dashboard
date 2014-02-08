angular.module('app')

.factory 'trackerService', ($q, $interval, apiInterface, dashboardService) ->

  trackers = {}

  class Tracker
    constructor: (data) ->
      _.extend @, data,
        coin:         dashboardService.coins[data.coinID]
        name:         data.name or dashboardService.coins[data.coinID].name
        lastUpdated: -1
        pollCount:    0
        errors:       []

    pollData: ->
      @pollCount++
      $q.all([
        apiInterface.loadTrackerData @id
        apiInterface.loadPoolData(@id) if @hasPool
      ])
      .then (response) =>
        if response[0].data is ""
          @errors.push "The user tracker returned no data."
        else
          if _.isUndefined(response[0].data.getuserstatus.data) or !_.isObject(response[0].data.getuserstatus.data)
            @errors.push 'Invalid tracker.'
          else
            trackerData = response[0].data.getuserstatus.data
            transactions =
              credit: if trackerData.transactions? then trackerData.transactions.Credit else -1
              debitAuto: if trackerData.transactions? then trackerData.transactions.Debit_AP else -1
              debitManual: if trackerData.transactions? then trackerData.transactions.Debit_MP else -1

            transactions.debitTotal = if transactions.credit < 0 then -1 else transactions.debitAuto + transactions.debitManual
            transactions.balance    = if transactions.credit < 0 then -1 else transactions.credit - transactions.debitTotal
            _.extend @, _.pick(trackerData, 'hashrate', 'sharerate'), transactions

            if response[1]?
              if response[1].data? and response[1].data isnt ""
                _.extend @, { pool: response[1].data.getpoolstatus.data}
              else @errors.push "The tracker pool returned no data."

            @errors.length = 0
            @lastUpdated   = new Date().getTime()

      , => @errors.push "The remote server failed to respond."

    startPolling: ->
      @pollData().finally =>
        if @errors.length > 0 and @pollCount < 5
          @startPolling()
        else
          @intervalPromise = $interval (=> @pollData()), 3000

    getErrorMessage: ->
      @errors.slice(-1)[0]

    stopPolling: ->
      $interval.cancel @intervalPromise
      @pollCount = 0
      @errors.length = 0
      @lastUpdated = -1

    isActive: ->
      @hashrate > 0 or @sharerate > 0

    getValue: (market, count) ->
      @coin.price_usd[market] * count


  loadTracker: (id) ->
    trackers[id]

  loadTrackers: (user) ->
    trackers = {}
    apiInterface.loadTrackers(user).then (data) ->
      _.each data, (trackerData) ->
        trackers[trackerData.id] = new Tracker trackerData
      return trackers