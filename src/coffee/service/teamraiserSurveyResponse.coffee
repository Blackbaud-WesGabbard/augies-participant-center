angular.module 'trPcApp'
  .factory 'TeamraiserSurveyResponseService', [
    '$rootScope'
    'LuminateRESTService'
    ($rootScope, LuminateRESTService) ->
      getSurveyResponses: (requestData) ->
        dataString = 'method=getSurveyResponses'
        dataString += '&use_filters=true'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response

      updateSurveyResponses: (requestData) ->
        dataString = 'method=updateSurveyResponses'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
  ]