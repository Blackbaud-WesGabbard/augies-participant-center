angular.module 'trPcControllers'
  .controller 'EmailMessageListViewCtrl', [
    '$scope'
    '$routeParams'
    '$location'
    '$translate'
    '$timeout'
    '$uibModal'
    'TeamraiserEmailService'
    'APP_INFO'
    ($scope, $routeParams, $location, $translate, $timeout, $uibModal, TeamraiserEmailService, APP_INFO) ->
      $scope.messageType = $routeParams.messageType
      $scope.refreshContactsNav = 0
      
      $scope.emailPromises = []
      
      $scope.emailMessages = 
        page: 1
      $scope.getEmailMessages = ->
        messageTypes = [
          'draft'
          'sentMessage'
        ]
        angular.forEach messageTypes, (messageType) ->
          if $scope.messageType is messageType
            apiMethod = 'get' + messageType.charAt(0).toUpperCase() + messageType.slice(1) + 's'
            sortColumn = if messageType is 'draft' then 'modify_date' else 'log.date_sent'
            pageSize = '10'
            pageNumber = $scope.emailMessages.page - 1
            messageListPromise = TeamraiserEmailService[apiMethod] 'list_sort_column=' + sortColumn + '&list_ascending=false&list_page_size=' + pageSize + '&list_page_offset=' + pageNumber
              .then (response) ->
                messageItems = response.data[apiMethod + 'Response'].messageItem
                messageItems = [messageItems] if not angular.isArray messageItems
                $scope.emailMessages.messages = messageItems
                $scope.emailMessages.totalNumber = response.data[apiMethod + 'Response'].totalNumberResults
                response
            $scope.emailPromises.push messageListPromise
      $scope.getEmailMessages()
      
      getMessageTypeTranslations = ->
        if $scope.getMessageTypeTranslationsTimeout
          $timeout.cancel $scope.getMessageTypeTranslationsTimeout
        $translate ['drafts_drafts_label', 'sent_sent_message_label']
          .then (translations) ->
            messageTypeNames = 
              draft: translations.drafts_drafts_label
              sentMessage: translations.sent_sent_message_label
            $scope.messageTypeName = messageTypeNames[$scope.messageType]
          , (translationIds) ->
            $scope.getMessageTypeTranslationsTimeout = $timeout getMessageTypeTranslations, 500
      getMessageTypeTranslations()
      
      $scope.selectMessage = (messageId) ->
        if $scope.messageType is 'draft'
          $location.path '/email/compose/draft/' + messageId
        else
          TeamraiserEmailService.getSentMessage 'message_id=' + messageId
            .then (response) ->
              if response.data.errorResponse
                # TODO
              else
                messageInfo = response.data.getSentMessageResponse?.messageInfo
                if not messageInfo
                  # TODO
                else
                  recipients = messageInfo.recipient
                  recipients = [recipients] if not angular.isArray recipients
                  messageInfo.recipient = recipients
                  $scope.sentMessage = messageInfo
          $scope.viewSentMessageModal = $uibModal.open 
            scope: $scope
            templateUrl: APP_INFO.rootPath + 'html/modal/viewSentMessage.html'
            size: 'lg'
      
      closeSentMessageModal = ->
        $scope.viewSentMessageModal.close()
      
      $scope.cancelViewSentMessage = ->
        closeSentMessageModal()
      
      $scope.copySentMessage = (messageId) ->
        closeSentMessageModal()
        $location.path '/email/compose/copy/' + messageId
      
      $scope.deleteMessage = (messageId) ->
        $scope.deleteMessageId = messageId
        $scope.deleteMessageModal = $uibModal.open 
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/deleteEmailMessage.html'
      
      closeDeleteMessageModal = ->
        delete $scope.deleteMessageId
        $scope.deleteMessageModal.close()
      
      $scope.cancelDeleteMessage = ->
        closeDeleteMessageModal()
      
      $scope.confirmDeleteMessage = ->
        if $scope.messageType is 'draft'
          TeamraiserEmailService.deleteDraft 'message_id=' + $scope.deleteMessageId
            .then (response) ->
              closeDeleteMessageModal()
              $scope.getEmailMessages()
        else 
          TeamraiserEmailService.deleteSentMessage 'message_id=' + $scope.deleteMessageId
            .then (response) ->
              closeDeleteMessageModal()
              $scope.getEmailMessages()
  ]