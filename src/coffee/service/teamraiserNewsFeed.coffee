angular.module 'trPcApp'
  .factory 'TeamraiserNewsFeedService', [
    'LuminateRESTService'
    (LuminateRESTService) ->
      getNewsFeeds: (requestData) ->
        dataString = 'method=getNewsFeeds'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
  ]