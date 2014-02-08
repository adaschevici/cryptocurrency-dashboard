angular.module('app')

  .factory 'apiInterface', ($http) ->

    loadData = (query) ->
      $http.get("api/requestHandler.php?#{query}", {timeout: 15000}).error (response) ->
        throw response

    loadCoinlist: ->
      loadData('resource=coinlist').then (response) ->
        response.data

    loadMarkets: ->
      loadData('resource=markets').then (response) ->
        response.data

    loadPoolData: (id) ->
      loadData "poolById=#{id}"

    loadTrackerData: (id) ->
      loadData "trackerById=#{id}"

    loadTrackers: (user) ->
      loadData("trackersByUser=#{user}").then (response) ->
        response.data