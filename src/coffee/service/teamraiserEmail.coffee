angular.module 'trPcApp'
  .factory 'TeamraiserEmailService', [
    'LuminateRESTService'
    (LuminateRESTService) ->
      addDraft: (requestData) ->
        dataString = 'method=addDraft'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      updateDraft: (requestData) ->
        dataString = 'method=updateDraft'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      deleteDraft: (requestData) ->
        dataString = 'method=deleteDraft'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getDrafts: (requestData) ->
        dataString = 'method=getDrafts'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getDraft: (requestData) ->
        dataString = 'method=getDraft'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      deleteSentMessage: (requestData) ->
        dataString = 'method=deleteSentMessage'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getSentMessages: (requestData) ->
        dataString = 'method=getSentMessages'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getSentMessage: (requestData) ->
        dataString = 'method=getSentMessage'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      getMessageLayouts: ->
        LuminateRESTService.teamraiserRequest 'method=getMessageLayouts', true, true
          .then (response) ->
            response
      
      getSuggestedMessages: ->
        LuminateRESTService.teamraiserRequest 'method=getSuggestedMessages', true, true
          .then (response) ->
            response
      
      getSuggestedMessage: (requestData) ->
        dataString = 'method=getSuggestedMessage'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      previewMessage: (requestData) ->
        dataString = 'method=previewMessage'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
      
      sendMessage: (requestData) ->
        dataString = 'method=sendTafMessage'
        dataString += '&' + requestData if requestData and requestData isnt ''
        LuminateRESTService.teamraiserRequest dataString, true, true
          .then (response) ->
            response
  ]