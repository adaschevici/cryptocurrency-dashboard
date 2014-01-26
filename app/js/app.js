'use strict'

angular.module('dashboardApp', [
    'dashboardApp.filters',
    'dashboardApp.services',
    'dashboardApp.directives',
    'dashboardApp.controllers',
    'ngCookies',
    'ui.router'
])

angular.module('dashboardApp')

    .factory('test', function($q) {


        function Tracker() {
            _.extend(this, {
                "id":"anc",
                "name":"AnonCoin",
                "coinID":"anc",

                "lastUpdated": new Date().getTime(),
                "pollCount":1,
                "pollsFailed":0,
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
            }
        }

        return {
            loadTracker: function() { return new Tracker() }
        }
    })


    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise("/captain")

        $stateProvider
            .state('dashboard', {
                url: "",
                abstract: true,
                controller: 'MainCtrl',
                templateUrl: "views/dashboard.html",
                resolve: {
                    dashboard: function(dashboardService) {
                        return dashboardService.initialize()
                    }
                }
            })
            .state('dashboard.trackers', {
                url: '/{user:ben|captain}',
                templateUrl: "views/trackerList.html",
                controller: ['$cookieStore', '$scope', '$stateParams', 'trackers', function($cookieStore, $scope, $stateParams, trackers) {
                    $scope.$parent.user = $stateParams.user
                    $scope.$parent.trackers = trackers
                    $scope.$parent.trackerList = _.toArray(trackers)
                    $scope.$parent.watchedTrackers = $cookieStore.get('watchedTrackers:'+$stateParams.user) || _.pluck(trackers, 'id')
                }],
                resolve: {
                    trackers: ['$stateParams', 'dashboard', 'trackerService', function($stateParams, dashboard, trackerService) {
                        return trackerService.loadTrackers($stateParams.user)
                    }]
                }
            })
    }])

    .run(['$cookieStore', '$rootScope', function($cookieStore, $rootScope) {
        $rootScope.marketNames = {
            anx_hk:         "anx_hk",
            bitfinex:       "bitfinex",
            bitkonan:       "bitkonan",
            bitstamp:       "bitstamp",
            btce:           "btce",
            campbx:         "campbx",
            cryptotrade:    "cryptotrade",
            justcoin:       "justcoin",
            kraken:         "kraken",
            localbitcoins:  "localbitcoins",
            mtgox:          "mtgox",
            rocktrading:    "rocktrading",
            vircurex:       "vircurex"
        }
        $rootScope.watchedMarkets = $cookieStore.get('watchedMarkets') || [
            'anx_hk',
            'btce',
            'cryptotrade',
            'mtgox',
            'localbitcoins'
        ]
    }])

var TestDependencies = [
    'dashboardApp.controllers',
    'dashboardApp.directives',
    'dashboardApp.filters',
    'dashboardApp.services',
    'templates'
]