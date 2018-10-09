angular.module 'trPcApp'
  .factory 'TeamraiserParticipantService', [
    '$rootScope'
    'LuminateRESTService'
    ($rootScope, LuminateRESTService) ->
      getParticipants: (requestData) ->
        dataString = 'method=getParticipants'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, false, true
          .then (response) ->
            response
      
      getParticipant: ->
        this.getParticipants 'first_name=' + encodeURIComponent('%%%') + '&list_filter_column=reg.cons_id&list_filter_text=' + $rootScope.consId
  ]