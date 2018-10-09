angular.module 'trPcControllers'
  .controller 'EmailComposeViewCtrl', [
    '$rootScope'
    '$scope'
    '$routeParams'
    '$timeout'
    '$httpParamSerializer'
    '$uibModal'
    '$translate'
    '$sce'
    '$window'
    'TeamraiserEventService'
    'TeamraiserEmailService'
    'ContactService'
    'APP_INFO'
    ($rootScope, $scope, $routeParams, $timeout, $httpParamSerializer, $uibModal, $translate, $sce, $window, TeamraiserEventService, TeamraiserEmailService, ContactService, APP_INFO) ->
      $scope.messageType = $routeParams.messageType
      $scope.messageId = $routeParams.messageId
      $scope.refreshContactsNav = 0
      $scope.emailPromises = []
      
      refreshContactsNavBar = ->
        $scope.refreshContactsNav = $scope.refreshContactsNav + 1

      $scope.resetEmailComposeAlerts = ->
        $rootScope.scrollToTop()
        $scope.sendEmailError = false
        $scope.sendEmailSuccess = false
        $scope.saveDraftError = false
        $scope.saveDraftSuccess = false
        $scope.deleteDraftError = false
        $scope.deleteDraftSuccess = false

      if not $rootScope.selectedContacts?.contacts
        ContactService.resetSelectedContacts()

      getSelectedContactsString = () ->
        recipients = ''
        if $rootScope.selectedContacts?.contacts? and $rootScope.selectedContacts.contacts.length > 0
          angular.forEach $rootScope.selectedContacts.contacts, (contact) ->
            if contact?.id and contact?.email
              if recipients.length > 0
                recipients += ', '
              recipients += ContactService.getContactString contact
        recipients

      contactFilters = [
        'email_rpt_show_all'
        'email_rpt_show_never_emailed'
        'email_rpt_show_nondonors_followup'
        'email_rpt_show_unthanked_donors'
        'email_rpt_show_donors'
        'email_rpt_show_nondonors'
      ]

      if $rootScope.participantRegistration.previousEventParticipant is "true"
        contactFilters.push 'email_rpt_show_ly_donors'
        contactFilters.push 'email_rpt_show_lybunt_donors'

      if $rootScope.participantRegistration.teamId isnt "-1"
        contactFilters.push 'email_rpt_show_teammates'
        contactFilters.push 'email_rpt_show_nonteammates'
        if $rootScope.participantRegistration.previousEventParticipant is "true"
          contactFilters.push 'email_rpt_show_ly_teammates'
          contactFilters.push 'email_rpt_show_ly_unreg_teammates'
      
      setEmailComposerDefaults = ->
        defaultStationeryId = $rootScope.teamraiserConfig.defaultStationeryId
        $scope.sendingEmail = false
        $scope.emailComposer = 
          just_updated: true
          message_id: ''
          message_name: ''
          layout_id: if defaultStationeryId isnt '-1' then defaultStationeryId else ''
          recipients: getSelectedContactsString()
          suggested_message_id: ''
          subject: ''
          prepend_salutation: true
          message_body: ''
          save_template_id: ''
          save_template: false
      setEmailComposerDefaults()

      $scope.resetComposer = ->
        ContactService.resetSelectedContacts()
        $scope.resetEmailComposeAlerts()
        setEmailComposerDefaults()
      
      setEmailMessageBody = (messageBody = '') ->
        if not messageBody or not angular.isString(messageBody)
          messageBody = ''
        $scope.emailComposer.message_body = messageBody
      
      getEmailMessageBody = ->
        $messageBody = jQuery '<div />', 
          html: $scope.emailComposer.message_body
        message_body = $messageBody.html().replace /<\/?[A-Z]+.*?>/g, (m) ->
          m.toLowerCase()
        .replace(/<font>/g, '<span>').replace(/<font /g, '<span ').replace /<\/font>/g, '</span>'
        .replace(/<b>/g, '<strong>').replace(/<b /g, '<strong ').replace /<\/b>/g, '</strong>'
        .replace(/<i>/g, '<em>').replace(/<i /g, '<em ').replace /<\/i>/g, '</em>'
        .replace(/<u>/g, '<span style="text-decoration: underline;">').replace(/<u /g, '<span style="text-decoration: underline;" ').replace /<\/u>/g, '</span>'
        .replace /[\u00A0-\u9999\&]/gm, (i) ->
          '&#' + i.charCodeAt(0) + ';'
        .replace /&#38;/g, '&'
        .replace /<!--[\s\S]*?-->/g, ''
        message_body

      getSuggestedMessageTypeTranslations = ->
        $translate ['email_template_radio_recruit_label','email_template_radio_solicit_label','email_template_radio_thanks_label','email_template_radio_other_label','email_template_radio_custom_label']
          .then (translations) ->
            $scope.suggestedMessageGroupLabels =
              recruit: translations.email_template_radio_recruit_label
              solicit: translations.email_template_radio_solicit_label
              thanks: translations.email_template_radio_thanks_label
              other: translations.email_template_radio_other_label
              custom: translations.email_template_radio_custom_label
            getSuggestedMessages()
          , (translationIds) ->
            $timeout getSuggestedMessageTypeTranslations, 500
      getSuggestedMessageTypeTranslations()

      getSuggestedMessages = ->
        suggestedMessagesPromise = TeamraiserEmailService.getSuggestedMessages()
          .then (response) ->
            suggestedMessages = response.data.getSuggestedMessagesResponse.suggestedMessage
            suggestedMessages = [suggestedMessages] if not angular.isArray suggestedMessages
            $scope.suggestedMessages = []
            $scope.suggestedMessageTemplates = []
            angular.forEach suggestedMessages, (message) ->
              if message.active is 'true' or message.personal is 'true'
                if message.personal is 'true'
                  message.messageGroup = $scope.suggestedMessageGroupLabels.custom
                else
                  switch message.messageType
                    when 'RECRUIT' then message.messageGroup = $scope.suggestedMessageGroupLabels.recruit
                    when 'SOLICIT' then message.messageGroup = $scope.suggestedMessageGroupLabels.solicit
                    when 'THANKS' then message.messageGroup = $scope.suggestedMessageGroupLabels.thanks
                    else message.messageGroup = $scope.suggestedMessageGroupLabels.other
                $scope.suggestedMessages.push message
                if message.personal is 'true'
                  $scope.suggestedMessageTemplates.push message.messageId
            response
        $scope.emailPromises.push suggestedMessagesPromise
      
      if $scope.messageType is 'draft' and $scope.messageId
        TeamraiserEmailService.getDraft 'message_id=' + $scope.messageId
          .then (response) ->
            if response.data.errorResponse
              # TODO
            else
              messageInfo = response.data.getDraftResponse?.messageInfo
              if messageInfo
                $scope.emailComposer.message_id = $scope.messageId
                if messageInfo.messageName?.match '&amp;'
                  messageInfo.messageName = messageInfo.messageName.replace '&amp;', '&'
                if messageInfo.subject?.match '&amp;'
                  messageInfo.subject = messageInfo.subject.replace '&amp;', '&'
                if angular.isString messageInfo.messageName
                  $scope.emailComposer.message_name = messageInfo.messageName
                else
                  $scope.emailComposer.message_name = messageInfo.subject
                $scope.emailComposer.subject = messageInfo.subject
                $scope.emailComposer.prepend_salutation = messageInfo.prependsalutation is 'true'
                messageBody = messageInfo.messageBody
                setEmailMessageBody messageBody
      else if $scope.messageType is 'copy' and $scope.messageId
        TeamraiserEmailService.getSentMessage 'message_id=' + $scope.messageId
          .then (response) ->
            if response.data.errorResponse
              # TODO
            else
              messageInfo = response.data.getSentMessageResponse?.messageInfo
              if messageInfo
                if messageInfo.messageName?.match '&amp;'
                  messageInfo.messageName = messageInfo.messageName.replace '&amp;', '&'
                if messageInfo.subject?.match '&amp;'
                  messageInfo.subject = messageInfo.subject.replace '&amp;', '&'
                $scope.messageId = ''
                $scope.emailComposer.message_id = ''
                $scope.emailComposer.message_name = messageInfo.messageName
                $scope.emailComposer.subject = messageInfo.subject
                $scope.emailComposer.prepend_salutation = messageInfo.prependsalutation is 'true'
                messageBody = messageInfo.messageBody
                setEmailMessageBody messageBody
      else if $scope.messageType is 'group' and $scope.messageId
        if contactFilters.indexOf $scope.messageId isnt -1
          ContactService.resetSelectedContacts()
          $scope.getGroupRecipientsPage = 0
          $scope.getGroupRecipients = ->
            contactsPromise = ContactService.getTeamraiserAddressBookContacts 'tr_ab_filter=' + $scope.messageId + '&skip_groups=true&list_page_size=200&list_page_offset=' + $scope.getGroupRecipientsPage
              .then (response) ->
                totalNumber = response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults
                addressBookContacts = response.data.getTeamraiserAddressBookContactsResponse.addressBookContact
                addressBookContacts = [addressBookContacts] if not angular.isArray addressBookContacts
                angular.forEach addressBookContacts, (contact) ->
                  if contact?
                    ContactService.addToSelectedContacts contact
                if totalNumber > ContactService.getNumSelectedContacts()
                  $scope.getGroupRecipientsPage = $scope.getGroupRecipientsPage + 1
                  $scope.getGroupRecipients()
                else
                  $scope.messageId = ''
                  setEmailComposerDefaults()
                response
            $scope.emailPromises.push contactsPromise
          $scope.getGroupRecipients()

      personalizedGreetingEnabledPromise = TeamraiserEventService.getEventDataParameter 'edp_type=boolean&edp_name=F2F_CENTER_TAF_PERSONALIZED_SALUTATION_ENABLED'
        .then (response) ->
          $scope.personalizedSalutationEnabled = response.data.getEventDataParameterResponse.booleanValue is 'true'
          $translate 'compose_salutation_hint'
            .then (translation) ->
              if translation?.match(/\([^]*\)/)
                content = translation.split '('
                $scope.composeSalutationHintLabel = content[0]
                $scope.composeSalutationWhatsThis = content[1].split(')')[0]
              else
                $scope.composeSalutationHintLabel = translation
                $scope.composeSalutationWhatsThis = null
            , (translationIds) ->
              $scope.composeSalutationHintLabel = 'Include personalized greeting'
              $scope.composeSalutationWhatsThis = "What's this?"
          $scope.personalizedSalutationHintUrl = 'http://help.convio.net/site/PageServer?s_site=' + $rootScope.siteShortname + '&pagename=WhatsThis_TAFPersonalizedGreeting'
          response
      $scope.emailPromises.push personalizedGreetingEnabledPromise
      
      $scope.loadSuggestedMessage = ->
        $scope.resetEmailComposeAlerts()
        suggested_message_id = $scope.emailComposer.suggested_message_id
        if suggested_message_id is '' or suggested_message_id is null
          setEmailComposerDefaults()
        else
          TeamraiserEmailService.getSuggestedMessage 'message_id=' + suggested_message_id
            .then (response) ->
              setEmailComposerDefaults()
              messageInfo = response.data.getSuggestedMessageResponse?.messageInfo
              $scope.emailComposer.suggested_message_id = messageInfo.messageId
              $scope.emailComposer.subject = messageInfo.subject
              if $scope.suggestedMessageTemplates.indexOf(messageInfo.messageId) > -1
                $scope.emailComposer.save_template_id = messageInfo.messageId
              else
                $scope.emailComposer.save_template_id = ''
              messageBody = messageInfo.messageBody
              setEmailMessageBody messageBody
      
      $scope.textEditorToolbar = [
        [
          'h1'
          'h2'
          'h3'
          'p'
          'bold'
          'italics'
          'underline'
        ]
        [
          'ul'
          'ol'
          'justifyLeft'
          'justifyCenter'
          'justifyRight'
          'justifyFull'
          'indent'
          'outdent'
        ]
        [
          'insertImage'
          'insertLink'
          'undo'
          'redo'
        ]
      ]

      sanitizeEmailComposer = ->
        emailComposer = angular.copy $scope.emailComposer
        emailComposer.message_body = getEmailMessageBody()
        emailComposer.message_name = emailComposer.subject
        delete emailComposer.just_updated
        delete emailComposer.suggested_message_id
        delete emailComposer.save_template_id
        $httpParamSerializer emailComposer

      saveDraft = ->
        requestData = sanitizeEmailComposer()
        if $scope.emailComposer.message_id is ''
          TeamraiserEmailService.addDraft requestData
            .then (response) ->
              if response.data.errorResponse?.message and $scope.emailComposer.save_template
                $scope.saveDraftError = response.data.errorResponse.message
              draftMessage = response.data.addDraftResponse?.message
              if draftMessage
                refreshContactsNavBar()
                messageId = draftMessage.messageId
                $scope.messageId = messageId
                $scope.emailComposer.message_name = draftMessage.messageName
                $scope.emailComposer.message_id = messageId
                if $scope.emailComposer.save_template
                  $scope.saveDraftSuccess = true
                  $scope.emailComposer.suggested_message_id = messageId
                  $scope.emailComposer.save_template_id = messageId
                  $scope.emailComposer.message_id = ''
                  getSuggestedMessages()
              $scope.emailComposer.save_template = false
              response
        else
          TeamraiserEmailService.updateDraft requestData
            .then (response) ->
              if response.data.errorResponse?.code is '2647'
                TeamraiserEmailService.deleteDraft 'message_id=' + $scope.emailComposer.message_id
                  .then (response) ->
                    $scope.emailComposer.message_id = ''
                    saveDraft()
              if response.data.errorResponse?.message and $scope.emailComposer.save_template
                $scope.saveDraftError = response.data.errorResponse.message
              draftMessage = response.data.updateDraftResponse?.message
              if draftMessage
                messageId = draftMessage.messageId
                if $scope.emailComposer.save_template
                  $scope.saveDraftSuccess = true
                  $scope.emailComposer.suggested_message_id = messageId
                  $scope.emailComposer.save_template_id = messageId
                  $scope.emailComposer.message_id = ''
                  getSuggestedMessages()
              $scope.emailComposer.save_template = false
              response
      
      $scope.$watchGroup ['emailComposer.subject', 'emailComposer.message_body'], ->
        subject = $scope.emailComposer.subject
        messageBody = getEmailMessageBody()
        cancelDraftPollTimeout = ->
          if $scope.draftPollTimeout
            $timeout.cancel $scope.draftPollTimeout
            delete $scope.draftPollTimeout
        if $scope.emailComposer.just_updated
          $scope.emailComposer.just_updated = false
          cancelDraftPollTimeout()
        else if subject is '' and messageBody is ''
          cancelDraftPollTimeout()
        else
          cancelDraftPollTimeout()
          $scope.emailComposer.save_template = false
          saveDraft()
          $scope.draftPollTimeout = $timeout saveDraft, 3000

      $scope.saveAsTemplate = ->
        $scope.resetEmailComposeAlerts()
        $scope.emailComposer.save_template = true
        $scope.emailComposer.save_template_id = $scope.emailComposer.message_id
        $scope.emailComposer.message_id = ''
        $scope.emailComposer.message_name = $scope.emailComposer.subject
        saveDraft()

      $scope.updateTemplate = () ->
        $scope.resetEmailComposeAlerts()
        $scope.emailComposer.save_template = true
        $scope.emailComposer.message_id = $scope.emailComposer.save_template_id
        $scope.emailComposer.message_name = $scope.emailComposer.subject
        saveDraft()

      $scope.deleteTemplate = ->
        if $scope.emailComposer.save_template_id
          $scope.resetEmailComposeAlerts()
          currentMessageId = $scope.emailComposer.save_template_id
          deleteDraftPromise = TeamraiserEmailService.deleteDraft 'message_id=' + currentMessageId
            .then (response) ->
              if response.data?.deleteDraftResponse?.messageId
                $scope.deleteDraftSuccess = true
              else if response.data.errorResponse?.message
                $scope.deleteDraftError = response.data.errorResponse.message
              else
                $translate 'message_template_delete_error_unknown'
                  .then (translation) ->
                    $scope.deleteDraftError = translation
                  , (translationId) ->
                    $scope.deleteDraftError = translationId
              refreshContactsNavBar()
              setEmailComposerDefaults()
              getSuggestedMessages()
          $scope.emailPromises.push deleteDraftPromise

      $scope.emailPreview = 
        body: ''

      $scope.selectStationeryEnabled = false
      $scope.stationeryChoices = []
      getMessageLayoutsPromise = TeamraiserEmailService.getMessageLayouts()
        .then (response) ->
          if response.data.errorResponse
            # TODO
          else
            layouts = response.data.getMessageLayoutsResponse?.layout
            if layouts
              layouts = [layouts] if not angular.isArray layouts
              $scope.stationeryChoices = layouts
              $scope.selectStationeryEnabled = true
      $scope.emailPromises.push getMessageLayoutsPromise
      
      $scope.selectStationery = ->
        requestData = sanitizeEmailComposer()
        TeamraiserEmailService.previewMessage requestData
          .then (response) ->
            if response.data.errorResponse
              # TODO
            else if response.data.teamraiserErrorResponse
              # TODO
            else
              $scope.emailPreview.body = $sce.trustAsHtml response.data.getMessagePreviewResponse?.message or ''
        $scope.emailPromises.push selectStationeryPromise
      
      $scope.previewEmail = ->
        $scope.resetEmailComposeAlerts()
        requestData = sanitizeEmailComposer()
        previewMessagePromise = TeamraiserEmailService.previewMessage requestData
          .then (response) ->
            if response.data.errorResponse
              $scope.sendEmailError = response.data.errorResponse.message
            else if response.data.teamraiserErrorResponse
              # TODO
            else
              $scope.emailPreview.body = $sce.trustAsHtml response.data.getMessagePreviewResponse?.message or ''
              $scope.emailPreviewModal = $uibModal.open 
                scope: $scope
                templateUrl: APP_INFO.rootPath + 'html/modal/emailPreview.html'
                size: 'lg'
        $scope.emailPromises.push previewMessagePromise
      
      closeEmailPreviewModal = ->
        $scope.emailPreviewModal.close()
      
      $scope.cancelEmailPreview = ->
        closeEmailPreviewModal()
      
      $scope.sendEmail = ->
        if not $scope.sendingEmail
          $scope.sendingEmail = true
          $scope.resetEmailComposeAlerts()
          requestData = sanitizeEmailComposer()
          sendEmailPromise = TeamraiserEmailService.sendMessage requestData
            .then (response) ->
              closeEmailPreviewModal()
              $scope.sendingEmail = false
              $rootScope.scrollToTop()
              if response.data.errorResponse
                $scope.sendEmailError = response.data.errorResponse.message
              else if response.data.teamraiserErrorResponse
                # TODO
              else
                # TODO: remove messageType and messageId from URL
                if $scope.messageId
                  deleteDraftPromise = TeamraiserEmailService.deleteDraft 'message_id=' + $scope.messageId
                    .then (response) ->
                      refreshContactsNavBar()
                  $scope.emailPromises.push deleteDraftPromise
                refreshContactsNavBar()
                $scope.sendEmailSuccess = true
                ContactService.resetSelectedContacts()
                setEmailComposerDefaults()
          $scope.emailPromises.push sendEmailPromise
        else
          $scope.sendingEmail = false
  ]