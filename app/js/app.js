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

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise("/captain")

        $stateProvider
            .state('dashboard', {
                url: '/{user:ben|captain}',
                controller: 'MainCtrl',
                templateUrl: "views/dashboard.html",
                resolve: {
                    user: ['$rootScope', '$stateParams', function($rootScope, $stateParams) {
                        $rootScope.user = $stateParams.user
                    }],
                    dashboard: ['dashboardService', function(dashboardService) {
                        return dashboardService.initialize()
                    }],
                    trackers: ['dashboard', '$stateParams', 'trackerService', function(dashboard, $stateParams, trackerService) {
                        return trackerService.loadTrackers($stateParams.user)
                    }]
                }
            })
    }])

    .run(['$rootScope', function($rootScope) {
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
        $rootScope.defaultMarkets = [
            'anx_hk',
            'btce',
            'cryptotrade',
            'mtgox',
            'localbitcoins'
        ]
    }])