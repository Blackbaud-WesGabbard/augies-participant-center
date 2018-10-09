angular.module 'trPcApp'
  .factory 'AuthService', [
    '$rootScope'
    'LuminateRESTService'
    ($rootScope, LuminateRESTService) ->
      getLoginState: ->
        LuminateRESTService.consRequest 'method=loginTest'
          .then (response) ->
            $rootScope.consId = response.data.loginResponse?.cons_id or -1
            response
      
      getAuthToken: ->
        LuminateRESTService.consRequest 'method=getLoginUrl'
          .then (response) ->
            $rootScope.authToken = response.data.getLoginUrlResponse.token
            response
      
      login: (requestData) ->
        dataString = 'method=login'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.consRequest dataString
          .then (response) ->
            $rootScope.consId = response.data.loginResponse?.cons_id or -1
            delete $rootScope.authToken
            response
  ]