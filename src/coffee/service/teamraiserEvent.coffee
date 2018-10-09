angular.module 'trPcApp'
  .factory 'TeamraiserEventService', [
    '$rootScope'
    'LuminateRESTService'
    ($rootScope, LuminateRESTService) ->
      getConfig: ->
        LuminateRESTService.teamraiserRequest 'method=getTeamraiserConfig', false, true
          .then (response) ->
            teamraiserConfig = response.data.getTeamraiserConfigResponse.teamraiserConfig
            if not teamraiserConfig
              $rootScope.teamraiserConfig = -1
            else
              $rootScope.teamraiserConfig = teamraiserConfig
            response

      getTeamraisers: (requestData) ->
        dataString = 'method=getTeamraisersByInfo'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, false, false
          .then (response) ->
            response
      
      getTeamraiser: ->
        this.getTeamraisers 'list_filter_column=frc.fr_id&list_filter_text=' + $rootScope.frId + '&name=' + encodeURIComponent('%')
          .then (response) ->
            teamraiser = response.data.getTeamraisersResponse?.teamraiser
            if not teamraiser
              $rootScope.eventInfo = -1
            else
              donate_event_url = teamraiser.donate_event_url
              if donate_event_url and donate_event_url.indexOf('df_id=') isnt -1
                teamraiser.donationFormId = donate_event_url.split('df_id=')[1].split('&')[0]
              $rootScope.eventInfo = teamraiser
            response

      getEventDataParameter: (requestData) ->
        dataString = 'method=getEventDataParameter'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, false, true
          .then (response) ->
            response

      getParticipationType: (requestData) ->
        dataString = 'method=getParticipationType'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, false, true
          .then (response) ->
            response

      getParticipantCenterWrapper: ->
        LuminateRESTService.teamraiserRequest 'method=getParticipantCenterWrapper', false, true
          .then (response) ->
            response
  ]