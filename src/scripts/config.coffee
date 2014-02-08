angular.module('app')

.config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise "/captain"
  $stateProvider
  # NOTE! manually proof resolve methods against minification as they are unsupported by ngmin
  .state 'dashboard',
      url: '/{user:ben|captain}'
      controller: 'MainCtrl'
      templateUrl: "views/dashboard.html"
      resolve:
        user: ['$rootScope', '$stateParams', ($rootScope, $stateParams) ->
          $rootScope.user = $stateParams.user
        ]
        dashboard: ['dashboardService', (dashboardService) ->
          dashboardService.initialize()
        ]
        trackers: ['dashboard', '$stateParams', 'trackerService', (dashboard, $stateParams, trackerService) ->
          trackerService.loadTrackers $stateParams.user
        ]

.run ($rootScope) ->
  $rootScope.marketNames =
    anx_hk:         "anx_hk"
    bitfinex:       "bitfinex"
    bitkonan:       "bitkonan"
    bitstamp:       "bitstamp"
    btce:           "btce"
    campbx:         "campbx"
    cryptotrade:    "cryptotrade"
    justcoin:       "justcoin"
    kraken:         "kraken"
    localbitcoins:  "localbitcoins"
    mtgox:          "mtgox"
    rocktrading:    "rocktrading"
    vircurex:       "vircurex"

  $rootScope.defaultMarkets = [
    'anx_hk'
    'btce'
    'cryptotrade'
    'mtgox'
    'localbitcoins'
  ]

