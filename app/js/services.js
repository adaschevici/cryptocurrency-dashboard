angular.module('dashboardApp.services', [])

    .factory('apiInterface', ['$http', function($http) {
        function loadData(query) {
            return $http.get('api/requestHandler.php?'+query, {timeout: 10000}).error(function(errorMessage) {
                console.error(errorMessage)
            })
        }
        return {
            loadCoinlist: function() {
                return loadData('resource=coinlist').then(function(response) {
                    return response.data
                })
            },
            loadMarkets: function() {
                return loadData('resource=markets').then(function(response) {
                    return response.data
                })
            },
            loadTrackers: function(user) {
                return loadData('trackersByUser='+user).then(function(response) {
                    return response.data
                })
            },
            loadTrackerData: function(id) {
                return loadData('trackerById='+id)
            }
        }
    }])


    .factory('dashboardService', ['$q', '$interval', 'apiInterface', function($q, $interval, apiInterface) {
        var data = {
                markets:   {},
                coins:     {}
            }

        function pollData() {
            return $q.all([
                apiInterface.loadCoinlist(),
                apiInterface.loadMarkets().then(function(newData) {
                    var markets = {}
                    _.each(newData, function(market, key) {
                        if(_.isObject(market)) {
                            markets[key] = _.extend(market, {
                                id: key
                            })
                        }
                    })
                    data.markets = markets
                })
            ]).then(function(newData) {
                var coins     = {},
                    coinNames = {}

                _.each(newData[0], function(coinData) {
                    var rates = {}
                    _.each(data.markets, function(market) {
                        rates[market.id] = coinData.price_btc * market.rates.bid
                    })
                    coinData.volume_btc = Number(coinData.volume_btc)
                    coins[coinData.id] = _.extend(coinData, { price_usd: rates })
                    coinNames[coinData.id] = coinData.name
                })
                data.coins = coins
            }, function(errorMessage) {
                console.error(errorMessage)
            })
        }

        data.getCoin = function(id) {
            return data.coins[id]
        }

        data.getCoinName = function(id) {
            return data.coins[id].name
        }

        data.initialize = function() {
            return pollData().then(function() {
                $interval(function(){
                    pollData()
                }, 3000)
            })
        }

        return data;
    }])


    .factory('trackerService', ['$q', '$interval', 'apiInterface', 'dashboardService', function($q, $interval, apiInterface, dashboardService) {

        var trackers = {}

        function Tracker(data) {
            _.extend(this, data, {
                coin: dashboardService.coins[data.coinID],
                name: data.name || dashboardService.coins[data.coinID].name
            })
        }

        Tracker.prototype = (function() {

            var interval

            return {
                startPolling: function() {
                    var tracker = this
                    function pollData() {
                        return apiInterface.loadTrackerData(tracker.id).then(function(response) {
                            if(response.data == "")
                                throw "The tracker returned no data."
                            var trackerData = response.data.getuserstatus.data
                            if(_.isUndefined(trackerData))
                                throw 'Invalid tracker.'
                            if(!_.isObject(trackerData))
                                throw trackerData
                            var activity = _.has(trackerData, 'transactions'),
                                transactions = {
                                    credit:      activity ? trackerData.transactions.Credit   : 0,
                                    debitAuto:   activity ? trackerData.transactions.Debit_AP : 0,
                                    debitManual: activity ? trackerData.transactions.Debit_MP : 0
                                }
                            transactions.debitTotal = transactions.debitAuto + transactions.debitManual
                            transactions.balance    = transactions.credit - transactions.debitTotal
                            _.extend(tracker, _.pick(trackerData, 'hashrate', 'sharerate'), transactions)
                        })
                    }
                    return pollData().then(function() {
                        interval = $interval(function() {
                            pollData()
                        }, 5000)
                    })
                },
                stopPolling: function() {
                    $interval.cancel(interval)
                },
                isActive: function() {
                    return this.hashrate > 0 || this.sharerate > 0
                },
                getValue: function(market, count) {
                    return this.coin.price_usd[market] * count
                }
            }
        })()


        return {
            loadTracker: function(id) {
                return trackers[id]
            },
            loadTrackers: function(user) {
                trackers = {}
                return apiInterface.loadTrackers(user).then(function(data) {
                    _.each(data, function(trackerData) {
                        trackers[trackerData.id] = new Tracker(trackerData)
                    })
                    return trackers
                })
            }
        }
    }])

