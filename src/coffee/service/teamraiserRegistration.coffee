angular.module 'trPcApp'
  .factory 'TeamraiserRegistrationService', [
    '$rootScope'
    'LuminateRESTService'
    ($rootScope, LuminateRESTService) ->
      getRegistration: ->
        LuminateRESTService.teamraiserRequest 'method=getRegistration', true, true
          .then (response) ->
            participantRegistration = response.data.getRegistrationResponse?.registration
            if not participantRegistration
              $rootScope.participantRegistration = -1
            else
              $rootScope.participantRegistration = participantRegistration
            response
      
      updateRegistration: (requestData) ->
        dataString = 'method=updateRegistration'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response

      updatePersonalPagePrivacy: (requestData) ->
        dataString = 'method=updatePersonalPagePrivacy'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
  ]