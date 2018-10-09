angular.module 'trPcControllers'
  .controller 'DashboardViewCtrl', [
    '$scope'
    '$rootScope'
    '$location'
    '$uibModal'
    '$timeout'
    '$translate'
    '$window'
    'ConstituentService'
    'TeamraiserNewsFeedService'
    'TeamraiserRegistrationService'
    'TeamraiserRecentActivityService'
    'ContactService'
    'TeamraiserProgressService'
    'TeamraiserEventService'
    'TeamraiserGiftService'
    'TeamraiserParticipantService'
    'TeamraiserTeamService'
    'TeamraiserShortcutURLService'
    'APP_INFO'
    ($scope, $rootScope, $location, $uibModal, $timeout, $translate, $window, ConstituentService, TeamraiserNewsFeedService, TeamraiserRegistrationService, TeamraiserRecentActivityService, ContactService, TeamraiserProgressService, TeamraiserEventService, TeamraiserGiftService, TeamraiserParticipantService, TeamraiserTeamService, TeamraiserShortcutURLService, APP_INFO) ->
      $scope.dashboardPromises = []

      constituentPromise = ConstituentService.getUser()
        .then (response) ->
          $scope.constituent = response.data.getConsResponse
          response
      $scope.dashboardPromises.push constituentPromise

      participantPromise = TeamraiserParticipantService.getParticipant()
        .then (response) ->
          participantInfo = response.data.getParticipantsResponse?.participant or {}
          if participantInfo.personalPageUrl?
            participantInfo.personalPageAbsoluteUrl = participantInfo.personalPageUrl
            if participantInfo.personalPageUrl.indexOf('/site/') isnt -1
              participantInfo.personalPageUrl = participantInfo.personalPageUrl.split('/site/')[1]
          if participantInfo.donationUrl?
            participantInfo.donationAbsoluteUrl = participantInfo.donationUrl
            if participantInfo.donationUrl.indexOf('/site/') isnt -1
              participantInfo.donationUrl = participantInfo.donationUrl.split('/site/')[1]
          if participantInfo.teamPageUrl?
            participantInfo.teamPageAbsoluteUrl = participantInfo.teamPageUrl
            if participantInfo.teamPageUrl.indexOf('/site/') isnt -1
              participantInfo.teamPageUrl = participantInfo.teamPageUrl.split('/site/')[1]
          $scope.participant = participantInfo
          badges = $scope.participant?.badges
          if not badges
            $scope.participantBadges = []
          else
            personalDonationBadgeLargeUrl = badges.personalDonationBadgeLargeUrl
            if personalDonationBadgeLargeUrl
              $scope.participantBadges = [] if not $scope.participantBadges
              $scope.participantBadges.push 
                url: '..' + personalDonationBadgeLargeUrl
                name: badges.personalDonationBadgeName
                description: badges.personalDonationBadgeDesc
            participantMilestoneLargeBadgeUrl = badges.participantMilestoneLargeBadgeUrl
            if participantMilestoneLargeBadgeUrl
              $scope.participantBadges = [] if not $scope.participantBadges
              $scope.participantBadges.push 
                url: '..' + participantMilestoneLargeBadgeUrl
                name: badges.participantMilestoneBadgeName
                description: badges.participantMilestoneBadgeDesc
          response
      $scope.dashboardPromises.push participantPromise

      setPersonalDownloadUrl = () ->
        $scope.teamraiserConfig = $rootScope.teamraiserConfig;
        if not $scope.teamraiserConfig.personalDonationsDownloadUrl
          $scope.teamraiserConfig.personalDonationsDownloadUrl = 'TRParticipantDownload/Personal_Donations.csv?download_type=personal_donations&fr_id=' + $rootScope.frId;
        $scope.teamraiserConfig

      if not $rootScope.teamraiserConfig or $rootScope.teamraiserConfig is -1
        getConfigPromise = TeamraiserEventService.getConfig()
          .then (response) ->
            setPersonalDownloadUrl()
            response
        $scope.dashboardPromises.push getConfigPromise
      else
        setPersonalDownloadUrl()

      $scope.showJanrainShare = $rootScope.socialSettings.appName?.length > 0
      
      if $scope.teamraiserConfig.adminNewsFeedsEnabled is 'true'
        $scope.newsFeed = 
          page: 1
          numPerPage: 1
        $scope.getNewsFeeds = ->
          pageNumber = $scope.newsFeed.page - 1
          newsFeedsPromise = TeamraiserNewsFeedService.getNewsFeeds 'last_pc2_login=' + $scope.participantRegistration.lastPC2Login + '&feed_count=100'
            .then (response) ->
              newsFeedItems = response.data.getNewsFeedsResponse.newsFeed
              newsFeedItems = [newsFeedItems] if not angular.isArray newsFeedItems
              $scope.newsFeed.items = []
              $scope.newsFeed.totalNumber = 0
              angular.forEach newsFeedItems, (item, itemIndex) ->
                if $scope.participant?.aTeamCaptain is 'true' or item.isCaptainsOnly is 'false'
                  $scope.newsFeed.totalNumber += 1
                  if itemIndex > (pageNumber - 1) and $scope.newsFeed.items.length < $scope.newsFeed.numPerPage
                    $scope.newsFeed.items.push item
              response
          $scope.dashboardPromises.push newsFeedsPromise
        $scope.getNewsFeeds()

      # undocumented update_last_pc2_login parameter required to make news feeds work, see bz #67720
      TeamraiserRegistrationService.updateRegistration 'update_last_pc2_login=true'
      
      $scope.recentActivity = 
        page: 1
      $scope.getRecentActivity = ->
        pageNumber = $scope.recentActivity.page - 1
        recentActivityPromise = TeamraiserRecentActivityService.getRecentActivity()
          .then (response) ->
            recentActivityRecords = response.data.getRecentActivityResponse.activityRecord
            recentActivityRecords = [recentActivityRecords] if not angular.isArray recentActivityRecords
            $scope.recentActivity.records = []
            angular.forEach recentActivityRecords, (record, recordIndex) ->
              if recordIndex > (pageNumber * 5) - 1 and recordIndex < (pageNumber + 1) * 5
                $scope.recentActivity.records.push record
            $scope.recentActivity.totalNumber = recentActivityRecords.length
            response
        $scope.dashboardPromises.push recentActivityPromise
      $scope.getRecentActivity()

      $scope.whatNextAction = (subview) ->
        switch subview
          when 'PERSONAL_PAGE' then $window.open $scope.participant.personalPageUrl, '_blank'
          when 'GOAL' then $scope.editGoal 'Participant'
          when 'CONTACTS' then $location.path '/email/contacts'
          when 'COMPOSE' then $location.path '/email/compose'
          when 'COMPOSE_THANKS' then $location.path '/email/compose/group/email_rpt_show_unthanked_donors'
          when 'COMPOSE_OTHER' then $location.path '/email/compose/group/email_rpt_show_never_emailed'
          when 'COMPOSE_FOLLOWUP' then $location.path '/email/compose/group/email_rpt_show_nondonors_followup'
        subview

      $scope.whatNext = 
        suggestions: []
      whatNextPromise = TeamraiserProgressService.getWhatNext()
        .then (response) ->
          allSuggestions = response.data.getTeamraiserSuggestionResponse.allSuggestions.suggestion
          allSuggestions = [allSuggestions] if not angular.isArray allSuggestions
          $scope.whatNext.suggestions = []
          angular.forEach allSuggestions, (suggestion, suggestionIndex) ->
            suggestion.displayNumber = suggestionIndex + 1
            suggestion.header = ''
            suggestion.nextAction = () ->
              $scope.whatNextAction(suggestion.type)
            $scope.whatNext.suggestions.push suggestion
          $translate [ 'what_next_setup_your_personal_page_header', 'what_next_set_goal_header', 'what_next_send_email_header', 'what_next_reach_out_header', 'what_next_send_thanks_header', 'what_next_add_contacts_header', 'what_next_followup_header' ]
            .then (translations) ->
              angular.forEach $scope.whatNext.suggestions, (suggestion) ->
                switch suggestion.type
                  when 'PERSONAL_PAGE' then suggestion.header = translations.what_next_setup_your_personal_page_header
                  when 'GOAL' then suggestion.header = translations.what_next_set_goal_header
                  when 'CONTACTS' then suggestion.header = translations.what_next_add_contacts_header
                  when 'COMPOSE' then suggestion.header = translations.what_next_send_email_header
                  when 'COMPOSE_THANKS' then suggestion.header = translations.what_next_send_thanks_header
                  when 'COMPOSE_OTHER' then suggestion.header = translations.what_next_reach_out_header
                  when 'COMPOSE_FOLLOWUP' then suggestion.header = translations.what_next_followup_header
            , (translationIds) ->
              angular.forEach $scope.whatNext.suggestions, (suggestion) ->
                switch suggestion.type
                  when 'PERSONAL_PAGE' then suggestion.header = translationIds.what_next_setup_your_personal_page_header
                  when 'GOAL' then suggestion.header = translationIds.what_next_set_goal_header
                  when 'CONTACTS' then suggestion.header = translationIds.what_next_add_contacts_header
                  when 'COMPOSE' then suggestion.header = translationIds.what_next_send_email_header
                  when 'COMPOSE_THANKS' then suggestion.header = translationIds.what_next_send_thanks_header
                  when 'COMPOSE_OTHER' then suggestion.header = translationIds.what_next_reach_out_header
                  when 'COMPOSE_FOLLOWUP' then suggestion.header = translationIds.what_next_followup_header
      $scope.dashboardPromises.push whatNextPromise
      
      $scope.contactCounts = {}
      contactFilters = [
        'email_rpt_show_all'
        'email_rpt_show_never_emailed'
        'email_rpt_show_nondonors_followup'
        'email_rpt_show_unthanked_donors'
        'email_rpt_show_donors'
        'email_rpt_show_nondonors'
      ]
      angular.forEach contactFilters, (filter) ->
        contactCountPromise = ContactService.getTeamraiserAddressBookContacts 'tr_ab_filter=' + filter + '&skip_groups=true&list_page_size=1'
          .then (response) ->
            $scope.contactCounts[filter] = response.data.getTeamraiserAddressBookContactsResponse.totalNumberResults
            response
        $scope.dashboardPromises.push contactCountPromise
      
      $scope.participantProgress = 
        raised: 0
        goal: 0
        percent: 0
      if $scope.participantRegistration.teamId and $scope.participantRegistration.teamId isnt '-1'
        $scope.teamProgress = 
          raised: 0
          goal: 0
          percent: 0
      if $scope.participantRegistration.companyInformation and $scope.participantRegistration.companyInformation.companyId
        $scope.companyProgress = 
          raised: 0
          goal: 0
          percent: 0
      $scope.refreshFundraisingProgress = ->
        fundraisingProgressPromise = TeamraiserProgressService.getProgress()
          .then (response) ->
            $scope.participantProgress = response.data.getParticipantProgressResponse.personalProgress
            if $scope.participantRegistration.teamId and $scope.participantRegistration.teamId isnt '-1'
              $scope.teamProgress = response.data.getParticipantProgressResponse.teamProgress
            if $scope.participantRegistration.companyInformation and $scope.participantRegistration.companyInformation.companyId
              $scope.companyProgress = response.data.getParticipantProgressResponse.companyProgress
            response
        $scope.dashboardPromises.push fundraisingProgressPromise
      $scope.refreshFundraisingProgress()
      
      $scope.editGoalOptions =
        updateGoalSuccess: false
        updateGoalFailure: false
        updateGoalFailureMessage: ''
        updateGoalInput: 0

      $scope.closeGoalAlerts = (closeModal) ->
        $scope.editGoalOptions.updateGoalSuccess = false
        $scope.editGoalOptions.updateGoalFailure = false
        $scope.editGoalOptions.updateGoalFailureMessage = ''
        if closeModal
          $scope.cancelEditGoal()

      $scope.editGoal = (goalType) ->
        $scope.closeGoalAlerts(false)
        switch goalType
          when 'Participant' then $scope.editGoalOptions.updateGoalInput = Math.floor parseInt($scope.participantProgress.goal)/100
          when 'Team' then $scope.editGoalOptions.updateGoalInput = Math.floor parseInt($scope.teamProgress.goal)/100
          else $scope.editGoalOptions.updateGoalInput = 0
        $scope.editGoalModal = $uibModal.open 
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/edit' + goalType + 'Goal.html'
      
      $scope.cancelEditGoal = ->
        $scope.editGoalModal.close()
      
      $scope.updateGoal = (goalType) ->
        $scope.closeGoalAlerts(false)
        switch goalType
          when 'Participant'
            dataStr = 'goal=' + (100 * $scope.editGoalOptions.updateGoalInput).toString()
            updateGoalPromise = TeamraiserRegistrationService.updateRegistration dataStr
              .then (response) ->
                if response.data.errorResponse
                  $scope.editGoalOptions.updateGoalFailure = true
                  if response.data.errorResponse.message
                    $scope.editGoalOptions.updateGoalFailureMessage = response.data.errorResponse.message
                  else
                    $translate 'personal_goal_unexpected_error'
                      .then (translation) ->
                        $scope.editGoalOptions.updateGoalFailureMessage = translation
                      , (translationId) ->
                        $scope.editGoalOptions.updateGoalFailureMessage = translationId
                else
                  $scope.editGoalOptions.updateGoalSuccess = true
                  $scope.refreshFundraisingProgress()
                response
            $scope.dashboardPromises.push updateGoalPromise
          when 'Team'
            dataStr = 'team_goal=' + (100 * $scope.editGoalOptions.updateGoalInput).toString()
            updateGoalPromise = TeamraiserTeamService.updateTeamInformation dataStr
              .then (response) ->
                if response.data.errorResponse
                  $scope.editGoalOptions.updateGoalFailure = true
                  if response.data.errorResponse.message
                    $scope.editGoalOptions.updateGoalFailureMessage = response.data.errorResponse.message
                  else
                    $translate 'team_goal_unexpected_error'
                      .then (translation) ->
                        $scope.editGoalOptions.updateGoalFailureMessage = translation
                      , (translationId) ->
                        $scope.editGoalOptions.updateGoalFailureMessage = translationId
                else
                  $scope.editGoalOptions.updateGoalSuccess = true
                  $scope.refreshFundraisingProgress()
                response
            $scope.dashboardPromises.push updateGoalPromise
          when 'Company'
            ### No such API! ###

      translateGiftActionLabels = () ->
        if $scope.translateGiftActionLabelsTimeout
          $timeout.cancel $scope.translateGiftActionLabelsTimeout
        $scope.giftActionLabels =
          acknowledgeGift: ''
          thankDonor: ''
          deleteGift: ''
          noAction: ''
        $translate [ 'gift_action_acknowledge_title', 'gift_action_thank_donor_title', 'gift_action_delete_title', 'gift_action_no_action_title' ]
          .then (translations) ->
            $scope.giftActionLabels.acknowledgeGift = translations.gift_action_acknowledge_title
            $scope.giftActionLabels.thankDonor = translations.gift_action_thank_donor_title
            $scope.giftActionLabels.deleteGift = translations.gift_action_delete_title
            $scope.giftActionLabels.noAction = translations.gift_action_no_action_title
          , (translationIds) ->
            $scope.translateGiftActionLabelsTimeout = $timeout translateGiftActionLabels, 500
      translateGiftActionLabels()
      
      $scope.participantGifts = 
        page: 1
      $scope.getGifts = ->
        pageNumber = $scope.participantGifts.page - 1
        personalGiftsPromise = TeamraiserGiftService.getGifts 'list_sort_column=date_recorded&list_ascending=false&list_page_size=5&list_page_offset=' + pageNumber
          .then (response) ->
            participantGifts = response.data.getGiftsResponse.gift
            participantGifts = [participantGifts] if not angular.isArray participantGifts
            $scope.participantGifts.gifts = []
            angular.forEach participantGifts, (gift) ->
              if gift
                gift.contact =
                  firstName: gift.name.first
                  lastName: gift.name.last
                  email: gift.email
                  id: gift.contactId
                $scope.participantGifts.gifts.push gift
            $scope.participantGifts.giftActionLabels = $scope.giftActionLabels
            $scope.participantGifts.totalNumber = Number response.data.getGiftsResponse.totalNumberResults
            response
        $scope.dashboardPromises.push personalGiftsPromise
      $scope.getGifts()

      $scope.acknowledgeGift = (contactId) ->
        $scope.acknowledgeGiftContactId = contactId
        $scope.acknowledgeGiftModal = $uibModal.open
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/acknowledgeGift.html'

      closeAcknowledgeGiftModal = () ->
        delete $scope.acknowledgeGiftContactId
        $scope.acknowledgeGiftModal.close()

      $scope.cancelAcknowledgeGift = () ->
        closeAcknowledgeGiftModal()

      $scope.confirmAcknowledgeGift = () ->
        if $scope.acknowledgeGiftContactId
          acknowledgeGiftPromise = TeamraiserGiftService.acknowledgeGift 'contact_id=' + $scope.acknowledgeGiftContactId
            .then (response) ->
              closeAcknowledgeGiftModal()
              $scope.getGifts()
              if $scope.participantRegistration.teamId and $scope.participantRegistration.teamId isnt '-1'
                $scope.teamGifts.page = 1
                $scope.getTeamGifts()
              response
          $scope.dashboardPromises.push acknowledgeGiftPromise

      $scope.deleteGift = (giftId) ->
        $scope.deleteGiftId = giftId
        $scope.deleteGiftModal = $uibModal.open
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/deleteGift.html'

      closeDeleteGiftModal = () ->
        delete $scope.deleteGiftId
        $scope.deleteGiftModal.close()

      $scope.cancelDeleteGift = () ->
        closeDeleteGiftModal()

      $scope.confirmDeleteGift = () ->
        if $scope.deleteGiftId
          deleteGiftPromise = TeamraiserGiftService.deleteGift 'gift_id=' + $scope.deleteGiftId
            .then (response) ->
              closeDeleteGiftModal()
              $scope.getGifts()
              if $scope.participantRegistration.teamId and $scope.participantRegistration.teamId isnt '-1'
                $scope.getTeamGifts()
              response
          $scope.dashboardPromises.push deleteGiftPromise

      $scope.thankDonor = (contact) ->
        if contact?
          if not $rootScope.selectedContacts
            $rootScope.selectedContacts = {}
          $rootScope.selectedContacts.contacts = [ contact ]
          $location.path '/email/compose'

      if $scope.teamraiserConfig.personalPageEditing is 'PARTICIPANTS' or $scope.participantRegistration.teamId <= 0
        $scope.showPersonalPage = true
      else if $scope.teamraiserConfig.personalPageEditing is 'CAPTAINS' and $scope.participantRegistration.aTeamCaptain is 'true'
        $scope.showPersonalPage = true
      else $scope.showPersonalPage = false

      getParticipantShortcutPromise = TeamraiserShortcutURLService.getShortcut()
        .then (response) ->
          $scope.participantShortcut = response.data.getShortcutResponse?.shortcutItem
          response
      $scope.dashboardPromises.push getParticipantShortcutPromise

      $scope.editPageUrlOptions =
        updateUrlSuccess: false
        updateUrlFailure: false
        updateUrlFailureMessage: ''
        updateUrlInput: ''

      $scope.closeUrlAlerts = (closeModal) ->
        $scope.editPageUrlOptions.updateUrlSuccess = false
        $scope.editPageUrlOptions.updateUrlFailure = false
        $scope.editPageUrlOptions.updateUrlFailureMessage = ''
        if closeModal
          $scope.cancelEditPageUrl()

      $scope.editPageUrl = (urlType) ->
        $scope.closeUrlAlerts(false)
        switch urlType
          when 'Participant' then $scope.editPageUrlOptions.updateUrlInput = $scope.participantShortcut.text or ''
          when 'Team' then $scope.editPageUrlOptions.updateUrlInput = $scope.teamShortcut.text or ''
          when 'Company' then $scope.editPageUrlOptions.updateUrlInput = $scope.companyShortcut.text or ''
          else $scope.editPageUrlOptions.updateUrlInput = ''
        $scope.editPageUrlModal = $uibModal.open 
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/edit' + urlType + 'PageUrl.html'
      
      $scope.cancelEditPageUrl = ->
        $scope.editPageUrlModal.close()
      
      $scope.updatePageUrl = (urlType) ->
        $scope.closeUrlAlerts(false)
        if $scope.editPageUrlOptions.updateUrlInput.length < 5
          $scope.editPageUrlOptions.updateUrlFailure = true
          $translate 'shortcut_error_min_length'
            .then (translation) ->
              $scope.editPageUrlOptions.updateUrlFailureMessage = translation
            , (translationId) ->
              $scope.editPageUrlOptions.updateUrlFailureMessage = translationId
        else
          dataStr = 'text=' + $scope.editPageUrlOptions.updateUrlInput
          switch urlType
            when 'Participant'
              updateUrlPromise = TeamraiserShortcutURLService.updateShortcut dataStr
                .then (response) ->
                  if response.data.errorResponse
                    $scope.editPageUrlOptions.updateUrlFailure = true
                    if response.data.errorResponse?.message
                      $scope.editPageUrlOptions.updateUrlFailureMessage = response.data.errorResponse.message
                    else
                      $translate 'shortcut_save_failure'
                        .then (translation) ->
                          $scope.editPageUrlOptions.updateUrlFailureMessage = translation
                        , (translationId) ->
                          $scope.editPageUrlOptions.updateUrlFailureMessage = translationId
                  else
                    $scope.editPageUrlOptions.updateUrlSuccess = true
                    $scope.participantShortcut = response.data.updateShortcutResponse?.shortcutItem
                  response
              $scope.dashboardPromises.push updateUrlPromise
            when 'Team'
              updateUrlPromise = TeamraiserShortcutURLService.updateTeamShortcut dataStr
                .then (response) ->
                  if response.data.errorResponse
                    $scope.editPageUrlOptions.updateUrlFailure = true
                    if response.data.errorResponse?.message
                      $scope.editPageUrlOptions.updateUrlFailureMessage = response.data.errorResponse.message
                    else
                      $translate 'teampage_shortcut_save_failure'
                        .then (translation) ->
                          $scope.editPageUrlOptions.updateUrlFailureMessage = translation
                        , (translationId) ->
                          $scope.editPageUrlOptions.updateUrlFailureMessage = translationId
                  else
                    $scope.editPageUrlOptions.updateUrlSuccess = true
                    $scope.teamShortcut = response.data.updateTeamShortcutResponse?.shortcutItem
                  response
              $scope.dashboardPromises.push updateUrlPromise
            when 'Company'
              updateUrlPromise = TeamraiserShortcutURLService.updateCompanyShortcut dataStr
                .then (response) ->
                  if response.data.errorResponse
                    $scope.editPageUrlOptions.updateUrlFailure = true
                    if response.data.errorResponse?.message
                      $scope.editPageUrlOptions.updateUrlFailureMessage = response.data.errorResponse.message
                    else
                      $translate 'company_page_shortcut_save_failure'
                        .then (translation) ->
                          $scope.editPageUrlOptions.updateUrlFailureMessage = translation
                        , (translationId) ->
                          $scope.editPageUrlOptions.updateUrlFailureMessage = translationId
                  else
                    $scope.editPageUrlOptions.updateUrlSuccess = true
                    $scope.companyShortcut = response.data.updateCompanyShortcutResponse?.shortcutItem
                  response
              $scope.dashboardPromises.push updateUrlPromise
      
      if $scope.participantRegistration.teamId and $scope.participantRegistration.teamId isnt '-1'
        captainsMessagePromise = TeamraiserTeamService.getCaptainsMessage()
          .then (response) ->
            $scope.teamCaptainsMessage = response.data.getCaptainsMessageResponse
            if not angular.isString $scope.teamCaptainsMessage.message
              delete $scope.teamCaptainsMessage.message
            $scope.teamCaptainsMessage.inEditMode = false
            response
        $scope.dashboardPromises.push captainsMessagePromise
        
        $scope.editTeamCaptainsMessage = ->
          $scope.teamCaptainsMessage.inEditMode = true
        
        $scope.saveTeamCaptainsMessage = ->
          updateCaptainsMessagePromise = TeamraiserTeamService.updateCaptainsMessage 'captains_message=' + encodeURIComponent($scope.teamCaptainsMessage.message)
            .then (response) ->
              $scope.teamCaptainsMessage.inEditMode = false
              response
          $scope.dashboardPromises.push updateCaptainsMessagePromise

        teamRosterPromise = TeamraiserTeamService.getTeamRoster 'include_download_url=true&positive_amount_only=true'
          .then (response) ->
            if response.data.getTeamRosterResponse
              $scope.teamRosterDownloadUrl = response.data.getTeamRosterResponse.teamRosterDownloadUrl or 'TRParticipantDownload/Team_Roster.csv?download_type=team_roster&fr_id=' + $rootScope.frId
              $scope.teamDonationsDownloadUrl = response.data.getTeamRosterResponse.teamDonationsDownloadUrl or 'TRParticipantDownload/Team_Donations.csv?download_type=team_donations&fr_id=' + $rootScope.frId
            response
        $scope.dashboardPromises.push teamRosterPromise
        
        teamBadgesPromise = TeamraiserTeamService.getTeam()
          .then (response) ->
            team = response.data.getTeamSearchByInfoResponse?.team
            badges = team?.badges
            if not badges
              $scope.teamBadges = []
            else
              teamMilestoneBadgeLargeUrl = badges.teamMilestoneBadgeLargeUrl
              if teamMilestoneBadgeLargeUrl
                $scope.teamBadges = [] if not $scope.teamBadges
                $scope.teamBadges.push 
                  url: '..' + teamMilestoneBadgeLargeUrl
                  name: badges.teamMilestoneBadgeName
                  description: badges.teamMilestoneBadgeDesc
            response
        $scope.dashboardPromises.push teamBadgesPromise
        
        $scope.teamGifts = 
          page: 1
        $scope.getTeamGifts = ->
          pageNumber = $scope.teamGifts.page - 1
          teamGiftsPromise = TeamraiserGiftService.getTeamGifts 'list_sort_column=date_recorded&list_ascending=false&list_page_size=5&list_page_offset=' + pageNumber
            .then (response) ->
              teamGifts = response.data.getGiftsResponse.gift
              teamGifts = [teamGifts] if not angular.isArray teamGifts
              $scope.teamGifts.gifts = []
              angular.forEach teamGifts, (gift) ->
                if gift
                  gift.contact =
                    firstName: gift.name.first
                    lastName: gift.name.last
                    email: gift.email
                    id: gift.contactId
                  $scope.teamGifts.gifts.push gift
              $scope.teamGifts.giftActionLabels = $scope.giftActionLabels
              $scope.teamGifts.totalNumber = Number response.data.getGiftsResponse.totalNumberResults
              response
          $scope.dashboardPromises.push teamGiftsPromise
        $scope.getTeamGifts()

        $scope.editTeamName = 
          newTeamName: ''
          editTeamNameSuccess: false
          editTeamNameFailure: false
          editTeamNameFailureMessage: ''

        $scope.changeTeamName = ->
          $scope.editTeamName.newTeamName = $scope.participant.teamName
          $scope.editTeamNameModal = $uibModal.open 
            scope: $scope
            templateUrl: APP_INFO.rootPath + 'html/modal/editTeamName.html'
        
        $scope.updateTeamName = ->
          $scope.cancelEditTeamName false
          dataStr = 'team_name=' + $scope.editTeamName.newTeamName
          updateTeamNamePromise = TeamraiserTeamService.updateTeamInformation dataStr
            .then (response) ->
              if response.data.errorResponse
                $scope.editTeamName.editTeamNameFailure = true
                if response.data.errorResponse.message
                  $scope.editTeamName.editTeamNameFailureMessage = response.data.errorResponse?.message
                else
                  $translate 'team_name_update_unexpected_error'
                    .then (translation) ->
                      $scope.editTeamName.editTeamNameFailureMessage = translation
                    , (translationId) ->
                      $scope.editTeamName.editTeamNameFailureMessage = translationId
              else
                $scope.editTeamName.editTeamNameSuccess = true
              response
          $scope.dashboardPromises.push updateTeamNamePromise

        $scope.cancelEditTeamName = (closeModal) ->
          $scope.editTeamName.editTeamNameSuccess = false
          $scope.editTeamName.editTeamNameFailure = false
          $scope.editTeamName.editTeamNameFailureMessage = ''
          if closeModal
            $scope.editTeamName.newTeamName = ''
            $scope.editTeamNameModal.close()

        $scope.changeTeamCaptains = ->
          $scope.editTeamCaptains =
            success: false
            failure: false
            failureMessage: ''
            maxCaptains: $scope.teamraiserConfig.teamCaptainsMaximum
            currCaptains: 0
            teamRoster: []
            teamSize: 1
            teamRosterPage: 1
            teamPageSize: 5
          teamCaptainsRosterPromise = TeamraiserParticipantService.getParticipants 'first_name=' + encodeURIComponent('%%%') + '&list_filter_column=reg.team_id&list_filter_text=' + $scope.participantRegistration.teamId + '&list_page_size=400&list_page_offset=0'
            .then (response) ->
              teamRoster = response.data.getParticipantsResponse?.participant
              teamRoster = [teamRoster] if not angular.isArray teamRoster
              $scope.editTeamCaptains.teamSize = response.data.getParticipantsResponse.totalNumberResults
              angular.forEach teamRoster, (member) ->
                if member?.consId
                  member.consId = parseInt member.consId
                  member.aTeamCaptain = member.aTeamCaptain is "true"
                  if member.aTeamCaptain
                    $scope.editTeamCaptains.teamSize = $scope.editTeamCaptains.teamSize - 1
              $scope.editTeamCaptains.teamRoster = teamRoster.sort (a,b) ->
                if a.consId is $rootScope.consId then -1 else if b.consId is $rootScope.consId then 1
                else
                  aName = if a.name?.screenname then a.name.screenname.toLowerCase() else a.name.last.toLowerCase() + ', ' + a.name.first.toLowerCase()
                  bName = if b.name?.screenname then b.name.screenname.toLowerCase() else b.name.last.toLowerCase() + ', ' + b.name.first.toLowerCase()
                  if aName < bName then -1 else if aName > bName then 1 else 0
              setTeamCaptainsRosterPage()
              response
          $scope.dashboardPromises.push teamCaptainsRosterPromise
          $scope.editTeamCaptainsModal = $uibModal.open 
            scope: $scope
            templateUrl: APP_INFO.rootPath + 'html/modal/editTeamCaptains.html'
        
        setTeamCaptainsRosterPage = ->
          currentPage = 1
          currMembers = 0
          maxPageSize = $scope.editTeamCaptains.teamPageSize
          angular.forEach $scope.editTeamCaptains.teamRoster, (member) ->
            if member?.consId
              member.displayPage = if member.consId is $rootScope.consId then 0 else currentPage
              if !member.aTeamCaptain
                currMembers = currMembers + 1
                if currMembers >= maxPageSize
                  currentPage = currentPage + 1
                  currMembers = 0
          $scope.editTeamCaptains.teamRoster

        $scope.toggleTeamCaptain = (consId) ->
          found = false
          angular.forEach $scope.editTeamCaptains.teamRoster, (member) ->
            if consId is member.consId
              found = true
              member.aTeamCaptain = not member.aTeamCaptain
              $scope.editTeamCaptains.teamSize = $scope.editTeamCaptains.teamSize + if member.aTeamCaptain then -1 else 1
          if found then setTeamCaptainsRosterPage()
          found

        $scope.confirmChangeTeamCaptains = ->
          $scope.resetTeamCaptainAlerts false
          newCaptainConsIds = []
          angular.forEach $scope.editTeamCaptains.teamRoster, (member) ->
            if member?.consId and member?.aTeamCaptain
              newCaptainConsIds.push member.consId
          if newCaptainConsIds.length is 0
            $scope.editTeamCaptains.failure = true
            $translate 'team_captains_failure_minimum'
              .then (translation) ->
                $scope.editTeamCaptains.failureMessage = translation
              , (translationId) ->
                $scope.editTeamCaptains.failureMessage = translationId
          else if newCaptainConsIds.length > $scope.teamraiserConfig.teamCaptainsMaximum
            $scope.editTeamCaptains.failure = true
            $translate 'team_captains_failure_maximum', { max: $scope.editTeamCaptains.maxCaptains }
              .then (translation) ->
                $scope.editTeamCaptains.failureMessage = translation
              , (translationId) ->
                $scope.editTeamCaptains.failureMessage = translationId
          else
            dataStr = 'captains=' + newCaptainConsIds.toString()
            setTeamCaptainsPromise = TeamraiserTeamService.setTeamCaptains dataStr
              .then (response) ->
                if response.data.errorResponse
                  $scope.editTeamCaptains.failure = true
                  if response.data.errorResponse.message
                    $scope.editTeamCaptains.failureMessage = response.data.errorResponse.message
                  else
                    $translate 'captains_save_failure'
                      .then (translation) ->
                        $scope.editTeamCaptains.failureMessage = translation
                      , (translationId) ->
                        $scope.editTeamCaptains.failureMessage = translationId
                else
                  $scope.editTeamCaptains.success = true
                  $scope.getTeamMembers()
                response
            $scope.dashboardPromises.push setTeamCaptainsPromise

        $scope.resetTeamCaptainAlerts = (closeModal) ->
          $scope.editTeamCaptains.success = false
          $scope.editTeamCaptains.failure = false
          $scope.editTeamCaptains.failureMessage = ''
          if closeModal
            $scope.editTeamCaptainsModal.close()

        $scope.editTeamPassword = 
          newTeamPassword: ''
          editTeamPasswordSuccess: false
          editTeamPasswordFailure: false
          editTeamPasswordFailureMessage: ''
        
        $scope.setTeamPassword = ->
          $scope.editTeamPassword.newTeamPassword = $scope.participantRegistration.teamInformation?.password or ''
          $scope.editTeamPasswordModal = $uibModal.open 
            scope: $scope
            templateUrl: APP_INFO.rootPath + 'html/modal/editTeamPassword.html'
        
        $scope.updateTeamPassword = ->
          $scope.cancelEditTeamPassword false
          dataStr = 'password=' + $scope.editTeamPassword.newTeamPassword
          updateTeamPasswordPromise = TeamraiserTeamService.updateTeamInformation dataStr
            .then (response) ->
              if response.data.errorResponse
                $scope.editTeamPassword.editTeamPasswordFailure = true
                if response.data.errorResponse.message
                  $scope.editTeamPassword.editTeamPasswordFailureMessage = response.data.errorResponse.message
                else
                  $translate 'team_password_update_unexpected_error'
                    .then (translation) ->
                      $scope.editTeamPassword.editTeamPasswordFailureMessage = translation
                    , (translationId) ->
                      $scope.editTeamPassword.editTeamPasswordFailureMessage = translationId
              else
                $scope.editTeamPassword.editTeamPasswordSuccess = true
              response
          $scope.dashboardPromises.push updateTeamPasswordPromise
        
        $scope.cancelEditTeamPassword = (closeModal) ->
          $scope.editTeamPassword.editTeamPasswordSuccess = false
          $scope.editTeamPassword.editTeamPasswordFailure = false
          $scope.editTeamPassword.editTeamPasswordFailureMessage = ''
          if closeModal
            $scope.editTeamPassword.newTeamPassword = ''
            $scope.editTeamPasswordModal.close()
        
        $scope.teamMembers = 
          page: 1
        $scope.getTeamMembers = ->
          pageNumber = $scope.teamMembers.page - 1
          teamMembersPromise = TeamraiserParticipantService.getParticipants 'first_name=' + encodeURIComponent('%%%') + '&list_filter_column=reg.team_id&list_filter_text=' + $scope.participantRegistration.teamId + '&list_page_size=5&list_page_offset=' + pageNumber
            .then (response) ->
              teamMembers = response.data.getParticipantsResponse.participant
              teamMembers = [teamMembers] if not angular.isArray teamMembers
              $scope.teamMembers.members = teamMembers
              $scope.teamMembers.totalNumber = response.data.getParticipantsResponse.totalNumberResults
              response
          $scope.dashboardPromises.push teamMembersPromise
        $scope.getTeamMembers()

        getTeamShortcutPromise = TeamraiserShortcutURLService.getTeamShortcut()
          .then (response) ->
            $scope.teamShortcut = response.data.getTeamShortcutResponse?.shortcutItem
            response
        $scope.dashboardPromises.push getTeamShortcutPromise
      
      if $scope.participantRegistration.companyInformation and $scope.participantRegistration.companyInformation.companyId
        $scope.companyTeams = 
          page: 1
        $scope.getCompanyTeams = ->
          pageNumber = $scope.companyTeams.page - 1
          companyTeamsPromise = TeamraiserTeamService.getTeams 'team_company_id=' + $scope.participantRegistration.companyInformation.companyId + '&list_page_size=5&list_page_offset=' + pageNumber
            .then (response) ->
              companyTeams = response.data.getTeamSearchByInfoResponse.team
              companyTeams = [companyTeams] if not angular.isArray companyTeams
              $scope.companyTeams.teams = companyTeams
              $scope.companyTeams.totalNumber = response.data.getTeamSearchByInfoResponse.totalNumberResults
              response
          $scope.dashboardPromises.push companyTeamsPromise
        $scope.getCompanyTeams()

        getCompanyShortcutPromise = TeamraiserShortcutURLService.getCompanyShortcut()
          .then (response) ->
            $scope.companyShortcut = response.data.getCompanyShortcutResponse?.shortcutItem
            response
        $scope.dashboardPromises.push getCompanyShortcutPromise
  ]