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
                templateUrl: "views/trackers.html",
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
