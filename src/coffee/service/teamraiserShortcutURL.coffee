angular.module 'trPcApp'
  .factory 'TeamraiserShortcutURLService', [
    '$rootScope'
    'LuminateRESTService'
    ($rootScope, LuminateRESTService) ->
      updateShortcut: (requestData) ->
        dataString = 'method=updateShortcut'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getShortcut: ->
        LuminateRESTService.teamraiserRequest 'method=getShortcut', true, true
          .then (response) ->
            response
      
      updateTeamShortcut: (requestData) ->
        dataString = 'method=updateTeamShortcut'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getTeamShortcut: ->
        LuminateRESTService.teamraiserRequest 'method=getTeamShortcut', true, true
          .then (response) ->
            response

      updateCompanyShortcut: (requestData) ->
        dataString = 'method=updateCompanyShortcut&company_id=' + $rootScope.participantRegistration.companyInformation.companyId
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getCompanyShortcut: ->
        dataString = 'method=getCompanyShortcut&company_id=' + $rootScope.participantRegistration.companyInformation.companyId
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
  ]