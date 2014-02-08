angular.module('app')

.factory 'dashboardService', ($q, $interval, apiInterface) ->

  data =
    markets:     {}
    coins:       {}
    pollCount:    0
    pollsFailed:  0
    lastUpdated: -1

  pollData = ->
    $q
    .all([
      apiInterface.loadCoinlist()
      apiInterface.loadMarkets().then (newData) ->
        markets = {}
        _.each newData, (market, key) ->
          if _.isObject(market)
            markets[key] = _.extend market, {id: key}
        data.markets = markets
    ])
    .then(
      # success
      (newData) ->
        coins = {}
        _.each newData[0], (coinData) ->
          rates = {}
          _.each data.markets, (market) ->
            rates[market.id] = coinData.price_btc * market.rates.bid
          coinData.volume_btc = Number coinData.volume_btc
          coinData.price_btc  = Number coinData.price_btc
          coins[coinData.id]  = _.extend coinData, { price_usd: rates }
        data.coins = coins
        data.lastUpdated = new Date().getTime()
      # fail
      -> data.pollsFailed++
    )
    .finally -> data.pollCount++


  data.initialize = ->
    pollData().then ->
      $interval (-> pollData()), 3000
      return # prevent coffeescript from returning interval promise from initialize

  data