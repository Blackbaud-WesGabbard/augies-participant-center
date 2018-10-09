angular.module 'trPcApp'
  .factory 'TeamraiserProgressService', [
    'LuminateRESTService'
    (LuminateRESTService) ->
      getProgress: ->
        LuminateRESTService.teamraiserRequest 'method=getParticipantProgress', false, true
          .then (response) ->
            response

      getWhatNext: ->
      	LuminateRESTService.teamraiserRequest 'method=getTeamraiserSuggestion&show_all_suggestions=true', false, true
      	  .then (response) ->
      	  	response
  ]