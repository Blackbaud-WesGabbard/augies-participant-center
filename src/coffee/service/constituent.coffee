angular.module 'trPcApp'
  .factory 'ConstituentService', [
    'LuminateRESTService'
    (LuminateRESTService) ->
      getUser: ->
        LuminateRESTService.consRequest 'method=getUser', true
          .then (response) ->
            response
      
      listUserFields: (requestData) ->
        dataString = 'method=listUserFields'
        dataString += '&include_choices=true'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.consRequest dataString
          .then (response) ->
            response
      
      listUserFieldChoices: (requestData) ->
        dataString = 'method=listUserFieldChoices&field='
        dataString += requestData if requestData and requestData isnt ''
        LuminateRESTService.consRequest dataString
          .then (response) ->
            response
      
      update: (requestData) ->
        dataString = 'method=update'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.consRequest dataString, true
          .then (response) ->
            response
      
      changePassword: (requestData) ->
        dataString = 'method=changePassword'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.consRequest dataString, true
          .then (response) ->
            response

      logSocialShare: (requestData) ->
        dataString = 'method=logSocialShare'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.consRequest dataString, true
          .then (response) ->
            response
  ]