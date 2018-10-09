angular.module 'trPcApp'
  .factory 'TeamraiserRecentActivityService', [
    'LuminateRESTService'
    (LuminateRESTService) ->
      getRecentActivity: ->
        LuminateRESTService.teamraiserRequest 'method=getRecentActivity', true, true
          .then (response) ->
            response
  ]