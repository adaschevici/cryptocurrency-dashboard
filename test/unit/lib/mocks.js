function mockCurrentTime() {
    var time = 1
    spyOn(Date.prototype, 'getTime').andCallFake(function(){
        time++
        return time
    })
}

;(function() {

    'use strict'

    angular.module('dashboardApp.mock.data', [])
        .value('mockData', {
            coins:[
                {"id":"anc","name":"AnonCoin","website":"http:\/\/anoncoin.net","price_btc":"0.00435794","volume_btc":"16.5662850249374"},
                {"id":"arg","name":"Argentum","website":"","price_btc":"0.00029002","volume_btc":"4.37655014589324"},
                {"id":"bec","name":"BeaoCoin","website":"http:\/\/cur.lv\/62fdg","price_btc":"0.00141805","volume_btc":"0"},
                {"id":"bet","name":"BET","website":"","price_btc":"0.00004236","volume_btc":"13.522518265685"}
            ],
            markets: {
                "bitfinex": { "rates": { "ask": 839.67, "bid": 838.21, "last": 838.2 }, "source": "api", "volume_btc": 4663.57, "volume_percent": 13.81 },
                "bitkonan": { "rates": { "ask": 849.0, "bid": 822.02, "last": 849.0 }, "source": "api", "volume_btc": 0.31, "volume_percent": 0.0 }
            },
            trackers: {
                "userone": [{ id: 'active', coinID: 'anc', name: 'AnonCoin Tracker', hasPool: true}, { id: 'inactive', coinID: 'bet' }],
                "usertwo": [{ id: 'arg', coinID: 'arg'}, { id: 'bec', coinID: 'bec' }]
            },
            trackerData: {
                "active":   {"getuserstatus":{"version":"1.0.0","runtime":124.54581260681,"data":{"username":"megalort","shares":{"valid":0,"invalid":0,"donate_percent":0,"is_anonymous":0},"hashrate":4567,"sharerate":"1.23456","transactions":{"Credit":70.68859613,"Debit_AP":34.24877323,"Debit_MP":35.62481143,"Donation":0.35151997,"Fee":0.35344288,"TXFee":0.11}}}},
                "inactive": {"getuserstatus":{"version":"1.0.0","runtime":1396.4970111847,"data":{"username":"megajew","shares":{"valid":0,"invalid":0},"hashrate":0,"sharerate":"0.0000"}}}
            },
            poolData: {"getpoolstatus":{"version":"1.0.0","runtime":6.1590671539307,"data":{"pool_name":"Dogechain Pool","hashrate":1609808,"efficiency":92.72,"workers":2419,"currentnetworkblock":69771,"nextnetworkblock":69772,"lastblock":69694,"networkdiff":1185.20819714,"esttime":3162.1351401331,"estshares":606826.59693568,"timesincelast":5231,"nethashrate":90269196612}}}
        })


    angular.module('dashboardApp.mock.apiInterface', ['dashboardApp.mock.data'])

        .factory('apiInterface', function($q, mockData) {
            return {
                loadCoinlist: function() {
                    var defer = $q.defer()
                    defer.resolve(mockData.coins)
                    return defer.promise
                },
                loadMarkets: function() {
                    var defer = $q.defer()
                    defer.resolve(mockData.markets)
                    return defer.promise
                },
                loadPoolData: function() {
                    var defer = $q.defer()
                    defer.resolve({data: mockData.poolData})
                    return defer.promise
                },
                loadTrackers: function(user) {
                    var defer = $q.defer()
                    defer.resolve(mockData.trackers[user])
                    return defer.promise
                },
                loadTrackerData: function(id) {
                    var defer = $q.defer()
                    defer.resolve({data: mockData.trackerData[id] })
                    return defer.promise
                }
            }
        })

    angular.module('dashboardApp.mock.dashboardService', [])

        .value('dashboardService', {
            coins: {
                "alf":{"id":"alf","name":"AlphaCoin","website":"http://cur.lv/5rzs5","price_btc":0.00000964,"volume_btc":2.34774278023382,"price_usd":{"anx_hk":0.007650207599999999,"bitfinex":0.007607020399999999,"bitkonan":0.007615599999999999,"bitstamp":0.007606152799999999,"btce":0.0076192631999999995,"campbx":0.007673536399999999,"cryptotrade":0.00770477,"justcoin":0.007597765999999999,"kraken":0.007673439999999999,"localbitcoins":0.0086009044,"mtgox":0.009085989199999998,"rocktrading":0.007760199999999999,"vircurex":0.007240121999999999}},
                "alp":{"id":"alp","name":"ALP","website":"","price_btc":0.0000108,"volume_btc":0.157241537530195,"price_usd":{"anx_hk":0.008570772,"bitfinex":0.008522388,"bitkonan":0.008532,"bitstamp":0.008521416,"btce":0.008536104,"campbx":0.008596908,"cryptotrade":0.0086319,"justcoin":0.00851202,"kraken":0.0085968,"localbitcoins":0.009635868,"mtgox":0.010179324,"rocktrading":0.008694,"vircurex":0.00811134}},
                "amc":{"id":"amc","name":"AmericanCoin","website":"","price_btc":0.00000997,"volume_btc":0.602442678138312,"price_usd":{"anx_hk":0.0079120923,"bitfinex":0.0078674267,"bitkonan":0.0078763,"bitstamp":0.007866529399999999,"btce":0.0078800886,"campbx":0.0079362197,"cryptotrade":0.0079685225,"justcoin":0.0078578555,"kraken":0.00793612,"localbitcoins":0.008895333699999999,"mtgox":0.0093970241,"rocktrading":0.00802585,"vircurex":0.007487968499999999}},
                "anc":{"id":"anc","name":"AnonCoin","website":"http://anoncoin.net","price_btc":0.0041,"volume_btc":11.0161350564543,"price_usd":{"anx_hk":3.2537190000000002,"bitfinex":3.2353510000000005,"bitkonan":3.2390000000000003,"bitstamp":3.234982,"btce":3.240558,"campbx":3.2636410000000002,"cryptotrade":3.2769250000000003,"justcoin":3.231415,"kraken":3.2636000000000003,"localbitcoins":3.6580610000000005,"mtgox":3.864373,"rocktrading":3.3005000000000004,"vircurex":3.079305}},
                "arg":{"id":"arg","name":"Argentum","website":"","price_btc":0.00022255,"volume_btc":1.28295588565036,"price_usd":{"anx_hk":0.1766134545,"bitfinex":0.1756164305,"bitkonan":0.17581449999999998,"bitstamp":0.17559640099999999,"btce":0.175899069,"campbx":0.17715202549999998,"cryptotrade":0.1778730875,"justcoin":0.1754027825,"kraken":0.1771498,"localbitcoins":0.1985613355,"mtgox":0.2097600515,"rocktrading":0.17915275,"vircurex":0.1671461775}},
                "asc":{"id":"asc","name":"ASC","website":"","price_btc":0.00000148,"volume_btc":4.71465165283976,"price_usd":{"anx_hk":0.0011745132000000001,"bitfinex":0.0011678828000000001,"bitkonan":0.0011692,"bitstamp":0.0011677496,"btce":0.0011697624,"campbx":0.0011780948,"cryptotrade":0.00118289,"justcoin":0.001166462,"kraken":0.00117808,"localbitcoins":0.0013204708,"mtgox":0.0013949443999999999,"rocktrading":0.0011914,"vircurex":0.0011115539999999998}},
                "asr":{"id":"asr","name":"AstroCoin","website":"","price_btc":0.0270001,"volume_btc":33.0426030002645,"price_usd":{"anx_hk":21.427009359,"bitfinex":21.306048911,"bitkonan":21.330078999999998,"bitstamp":21.303618902,"btce":21.340339038,"campbx":21.492349601,"cryptotrade":21.579829925,"justcoin":21.280128814999998,"kraken":21.4920796,"localbitcoins":24.089759221,"mtgox":25.448404253,"rocktrading":21.7350805,"vircurex":20.278425104999997}},
                "bcx":{"id":"bcx","name":"BCX","website":"","price_btc":0.00002748,"volume_btc":7.47773991358738,"price_usd":{"anx_hk":0.0218078532,"bitfinex":0.0216847428,"bitkonan":0.0217092,"bitstamp":0.0216822696,"btce":0.0217196424,"campbx":0.021874354800000002,"cryptotrade":0.02196339,"justcoin":0.021658362,"kraken":0.02187408,"localbitcoins":0.0245179308,"mtgox":0.025900724400000002,"rocktrading":0.0221214,"vircurex":0.020638853999999998}},
                "bec":{"id":"bec","name":"BeaoCoin","website":"http://cur.lv/62fdg","price_btc":0.00146799,"volume_btc":0,"price_usd":{"anx_hk":1.1649821841,"bitfinex":1.1584055889,"bitkonan":1.1597121,"bitstamp":1.1582734698,"btce":1.1602699362,"campbx":1.1685347199,"cryptotrade":1.1732910075,"justcoin":1.1569963184999998,"kraken":1.16852004,"localbitcoins":1.3097553579,"mtgox":1.3836246147,"rocktrading":1.1817319499999999,"vircurex":1.1025338894999999}},
                "bet":{"id":"bet","name":"BET","website":"","price_btc":0.0000383,"volume_btc":3.46815750123726,"price_usd":{"anx_hk":0.030394497000000003,"bitfinex":0.030222913000000004,"bitkonan":0.030257000000000003,"bitstamp":0.030219466,"btce":0.030271554000000003,"campbx":0.030487183,"cryptotrade":0.030611275000000004,"justcoin":0.030186145,"kraken":0.0304868,"localbitcoins":0.034171643,"mtgox":0.036098899000000004,"rocktrading":0.0308315,"vircurex":0.028765215}}
            },
            markets: {
                "anx_hk":{"rates":{"ask":823.35,"bid":793.59,"last":810.6},"source":"bitcoincharts","volume_btc":0,"volume_percent":0,"id":"anx_hk"},
                "bitfinex":{"rates":{"ask":789.02,"bid":789.11,"last":790.7},"source":"api","volume_btc":2089.42,"volume_percent":9.58,"id":"bitfinex"},
                "bitkonan":{"rates":{"ask":839.95,"bid":790,"last":795},"source":"api","volume_btc":1.56,"volume_percent":0.01,"id":"bitkonan"},
                "bitstamp":{"rates":{"ask":789.02,"bid":789,"last":789.02},"source":"api","volume_btc":7689.1,"volume_percent":35.25,"id":"bitstamp"},
                "btce":{"rates":{"ask":790.9,"bid":790.01,"last":790.9},"source":"api","volume_btc":6491.74,"volume_percent":29.76,"id":"btce"},
                "campbx":{"rates":{"ask":805,"bid":796.01,"last":805},"source":"bitcoincharts","volume_btc":58.93,"volume_percent":0.27,"id":"campbx"},
                "cryptotrade":{"rates":{"ask":808,"bid":799.25,"last":808},"source":"api","volume_btc":2.15,"volume_percent":0.01,"id":"cryptotrade"},
                "justcoin":{"rates":{"ask":799.28,"bid":788.17,"last":788.77},"source":"api","volume_btc":7.17,"volume_percent":0.03,"id":"justcoin"},
                "kraken":{"rates":{"ask":810.97,"bid":796,"last":810.97},"source":"api","volume_btc":3.45,"volume_percent":0.02,"id":"kraken"},
                "localbitcoins":{"rates":{"ask":883.7,"bid":883.7,"last":883.7},"source":"api","volume_btc":384.12,"volume_percent":1.76,"id":"localbitcoins"},
                "mtgox":{"rates":{"ask":951.31,"bid":942.58,"last":951.37},"source":"api","volume_btc":5080,"volume_percent":23.29,"id":"mtgox"},
                "rocktrading":{"rates":{"ask":807,"bid":805,"last":805.01},"source":"api","volume_btc":1.09,"volume_percent":0,"id":"rocktrading"},
                "vircurex":{"rates":{"ask":800.95,"bid":751.05,"last":753},"source":"api","volume_btc":3.7,"volume_percent":0.02,"id":"vircurex"}
            }
        })


    angular.module('dashboardApp.mock.trackerService', ['dashboardApp.mock.dashboardService'])

        .factory('trackerService', function(dashboardService, $q) {

            function Tracker() {
                _.extend(this, {
                    "id":"anc",
                    "name":"AnonCoin",
                    "coinID":"anc",
                    "coin": dashboardService.coins['anc'],
                    "lastUpdated": new Date().getTime(),
                    "pollCount":1,
                    "errors": [],
                    "hashrate":2199,
                    "sharerate":"1.0417",
                    "credit":72.44912078,
                    "debitAuto":34.24877323,
                    "debitManual":35.62481143,
                    "debitTotal":69.87358466,
                    "balance":2.5755361199999953,
                    "pool": {
                        "pool_name":"Coinpool.{in,i2p}",
                        "hashrate":105529,
                        "efficiency":99.48,
                        "workers":162,
                        "currentnetworkblock":129806,
                        "nextnetworkblock":129807,
                        "lastblock":129805,
                        "networkdiff":33.93535337,
                        "esttime":1381.1486217282,
                        "estshares":138999.20740352,
                        "timesincelast":408,
                        "nethashrate":820679527
                    }
                })
            }

            Tracker.prototype = {
                startPolling: function() {
                    var defer = $q.defer()
                    defer.resolve()
                    return defer.promise
                },
                getErrorMessage: function() {
                    return 'There was an error!'
                }
            }

            var tracker = new Tracker()

            return {
                loadTracker: function() { return tracker }
            }
        })

})()
