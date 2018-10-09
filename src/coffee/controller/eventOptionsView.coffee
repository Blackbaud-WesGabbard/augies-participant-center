angular.module 'trPcControllers'
  .controller 'EventOptionsViewCtrl', [
    '$scope'
    '$translate'
    '$uibModal'
    'TeamraiserRegistrationService'
    'TeamraiserTeamService'
    'TeamraiserCompanyService'
    'APP_INFO'
    ($scope, $translate, $uibModal, TeamraiserRegistrationService, TeamraiserTeamService, TeamraiserCompanyService, APP_INFO) ->
      $scope.eventOptionsPromises = []

      $scope.refreshRegistration = ->
        refreshRegistrationPromise = TeamraiserRegistrationService.getRegistration()
          .then (response) ->
            setPersonalPrivacySetting()
            setDisplayNameSetting()
        $scope.eventOptionsPromises.push refreshRegistrationPromise
      $scope.refreshRegistration()

      $scope.personalPrivacySettings =
        isPrivate: $scope.participantRegistration.privatePage is 'true'
        privacySetting: ''
        updatePrivacySuccess: false
        updatePrivacyFailure: false
        updatePrivacyFailureMessage: ''

      setPersonalPrivacySetting = ->
        if $scope.participantRegistration.privatePage is 'true'
          $scope.personalPrivacySettings.privacySetting = 'private'
        else
          $scope.personalPrivacySettings.privacySetting = 'public'

      $scope.updatePrivacyOptions = ->
        $scope.resetPrivacyAlerts()
        dataStr = 'is_private='
        if $scope.personalPrivacySettings.privacySetting is 'private'
          dataStr += 'true'
        else
          dataStr += 'false'
        updatePrivacyPromise = TeamraiserRegistrationService.updatePersonalPagePrivacy dataStr
          .then (response) ->
            if response.data.updatePersonalPagePrivacyResponse?.privatePage
              $scope.personalPrivacySettings.isPrivate = response.data.updatePersonalPagePrivacyResponse.privatePage is 'true'
              $scope.personalPrivacySettings.updatePrivacySuccess = true
              $scope.refreshRegistration()
            else
              $scope.personalPrivacySettings.updatePrivacyFailure = true
              $scope.personalPrivacySettings.updatePrivacyFailureMessage = response.data.errorResponse?.message
            response
        $scope.eventOptionsPromises.push updatePrivacyPromise

      $scope.resetPrivacyAlerts = ->
        $scope.personalPrivacySettings.updatePrivacySuccess = false
        $scope.personalPrivacySettings.updatePrivacyFailure = false
        $scope.personalPrivacySettings.updatePrivacyFailureMessage = ''

      $scope.displayNameSettings =
        showDisplayNamePanel: false
        standardRegAllowed: $scope.teamraiserConfig.standardRegistrationAllowed is 'true' or $scope.teamraiserConfig.standardRegistrationAllowed is true
        anonymousRegAllowed: $scope.teamraiserConfig.anonymousRegistrationAllowed is 'true' or $scope.teamraiserConfig.anonymousRegistrationAllowed is true
        screennameRegAllowed: $scope.teamraiserConfig.screennameRegistrationAllowed is 'true' or $scope.teamraiserConfig.screennameRegistrationAllowed is true
        updateScreennameSuccess: false
        updateScreennameFailure: false
        updateScreennameFailureMessage: ''
        currentSelection: null
        currentScreenname: null

      if ($scope.displayNameSettings.standardRegAllowed and ($scope.displayNameSettings.anonymousRegAllowed or $scope.displayNameSettings.screennameRegAllowed)) or ($scope.displayNameSettings.anonymousRegAllowed and $scope.displayNameSettings.screennameRegAllowed)
        $scope.displayNameSettings.showDisplayNamePanel = true

      setDisplayNameSetting = ->
        if $scope.participantRegistration.anonymous is 'true' or $scope.participantRegistration.anonymous is true
          $scope.displayNameSettings.currentSelection = 'anonymous'
          $scope.displayNameSettings.currentScreenname = null
        else if $scope.participantRegistration.screenname
          $scope.displayNameSettings.currentSelection = 'screenname'
          $scope.displayNameSettings.currentScreenname = $scope.participantRegistration.screenname
        else
          $scope.displayNameSettings.currentSelection = 'standard'
          $scope.displayNameSettings.currentScreenname = null

      $scope.updateDisplayNameSetting = ->
        $scope.resetScreennameAlerts()
        dataStr = ''
        switch $scope.displayNameSettings.currentSelection
          when 'anonymous' then dataStr = 'anonymous_registration=true'
          when 'screenname' then dataStr = 'screenname=' + encodeURIComponent($scope.displayNameSettings.currentScreenname)
          when 'standard' then dataStr = 'standard_registration=true'
          else dataStr = 'standard_registration=true'
        updateDisplayNamePromise = TeamraiserRegistrationService.updateRegistration dataStr
          .then (response) ->
            if response.data.errorResponse
              $scope.displayNameSettings.updateScreennameFailure = true
              $scope.displayNameSettings.updateScreennameFailureMessage = response.data.errorResponse.message
            else
              $scope.displayNameSettings.updateScreennameSuccess = true
              $scope.refreshRegistration()
            response
        $scope.eventOptionsPromises.push updateDisplayNamePromise

      $scope.resetScreennameAlerts = ->
        $scope.displayNameSettings.updateScreennameSuccess = false
        $scope.displayNameSettings.updateScreennameFailure = false
        $scope.displayNameSettings.updateScreennameFailureMessage = ''

      $scope.manageCompanyMembership =
        showManageCompanyPanel: false
        newCompanyEntryAllowed: false
        companyOptions: []
        currentCompanyName: ''
        currentSelection: $scope.participantRegistration.companyInformation?.companyId
        newCompanyEntry: ''
        updateCompanySuccess: false
        updateCompanyFailure: false
        updateCompanyFailureMessage: ''

      $scope.getCompanyList = ->
        getCompanyListPromise = TeamraiserCompanyService.getCompanyList()
          .then (response) ->
            if response.data.errorResponse
              $scope.manageCompanyMembership.showManageCompanyPanel = false
            else
              results = response.data.getCompanyListResponse.companyItem
              results = [results] if not angular.isArray results
              $scope.manageCompanyMembership.companyOptions = results
              if $scope.participantRegistration.companyInformation?.companyId
                angular.forEach results, (result) ->
                  if $scope.participantRegistration.companyInformation.companyId is result.companyId
                    $scope.manageCompanyMembership.currentCompanyName = result.companyName
              else
                $translate 'dashboard_company_null_label'
                  .then (translation) ->
                    $scope.manageCompanyMembership.currentCompanyName = translation
                  , (translationId) ->
                    $scope.manageCompanyMembership.currentCompanyName = translationId
            response
        $scope.eventOptionsPromises.push getCompanyListPromise

      $scope.openCompanySelection = ->
        $scope.manageCompanyMembership.newCompanyEntry = ''
        $scope.companySelectionModal = $uibModal.open
          scope: $scope
          templateUrl: APP_INFO.rootPath + 'html/modal/editCompanyAssociation.html'

      $scope.resetCompanyAlerts = (closeModal) ->
        $scope.manageCompanyMembership.updateCompanySuccess = false
        $scope.manageCompanyMembership.updateCompanyFailure = false
        $scope.manageCompanyMembership.updateCompanyFailureMessage = ''
        if closeModal
          $scope.companySelectionModal.close()

      $scope.initCompanyInfo = ->
        if $scope.participantRegistration.teamId is '-1' and $scope.teamraiserConfig.participantCompanyAssociationAllowed is "true"
          $scope.manageCompanyMembership.showManageCompanyPanel = true
          if $scope.teamraiserConfig.participantCompanyNewEntryAllowed is "true"
            $scope.manageCompanyMembership.newCompanyEntryAllowed = true
        else if $scope.participantRegistration.teamId isnt '-1' and $scope.participantRegistration.aTeamCaptain is "true" and $scope.teamraiserConfig.companyAssociationAllowed is "true"
          $scope.manageCompanyMembership.showManageCompanyPanel = true
          if $scope.teamraiserConfig.companyNewEntryAllowed is "true"
            $scope.manageCompanyMembership.newCompanyEntryAllowed = true
        else
          $scope.manageCompanyMembership.showManageCompanyPanel = false
          $scope.manageCompanyMembership.newCompanyEntryAllowed = false
        if $scope.manageCompanyMembership.showManageCompanyPanel
          $scope.getCompanyList()
        $scope.resetCompanyAlerts false
      $scope.initCompanyInfo()

      $scope.updateCompanyAssociation = ->
        if $scope.manageCompanyMembership.newCompanyEntry.length > 0
          dataStr = 'company_name=' + encodeURIComponent $scope.manageCompanyMembership.newCompanyEntry
        else
          dataStr = 'company_id=' + $scope.manageCompanyMembership.currentSelection
        if $scope.participantRegistration.teamId is '-1'
          updateParticipantCompanyPromise = TeamraiserRegistrationService.updateRegistration dataStr
            .then (response) ->
              $scope.updateCompanyAssociationResponse response
        else
          updateParticipantCompanyPromise = TeamraiserTeamService.updateTeamInformation dataStr
            .then (response) ->
              $scope.updateCompanyAssociationResponse response
        $scope.eventOptionsPromises.push updateParticipantCompanyPromise

      $scope.updateCompanyAssociationResponse = (response) ->
        if response.data.errorResponse
          $scope.manageCompanyMembership.updateCompanyFailure = true
          if response.data.errorResponse.message
            $scope.manageCompanyMembership.updateCompanyFailureMessage = response.data.errorResponse.message
          else
            $translate 'company_selection_update_unexpected_error'
              .then (translation) ->
                $scope.manageCompanyMembership.updateCompanyFailureMessage = translation
              , (translationId) ->
                $scope.manageCompanyMembership.updateCompanyFailureMessage = translationId
        else
          $scope.manageCompanyMembership.updateCompanySuccess = true
          if $scope.participantRegistration.companyInformation
            $scope.participantRegistration.companyInformation.companyId = response.data.updateTeamInformationResponse?.companyId or response.data.updateRegistrationResponse?.companyId
          else
            $scope.participantRegistration.companyInformation = 
              companyId: response.data.updateTeamInformationResponse?.companyId or response.data.updateRegistrationResponse?.companyId
          $scope.getCompanyList()
        response

      $scope.manageTeamMembership = 
        showManageTeamMembership: $scope.participantRegistration.teamId is '-1' or $scope.participantRegistration.aTeamCaptain isnt 'true'
        currentTeamId: $scope.participantRegistration.teamId
        manageTeamMembershipAlerts: []
        currentSelection: 'stay'
        joinTeamAlerts: []
        joinTeamSearch:
          teamName: ''
          teamCompany: ''
          captainFirst: ''
          captainLast: ''
          searchPage: 1
          searchString: ''
          searchSubmitted: false
          searchResults: []
          searchTotalNumber: 0
          joinTeamId: ''
          joinTeamPassword: ''

      $scope.searchTeams = ->
        $scope.clearAllTeamMembershipAlerts()
        if $scope.manageTeamMembership.joinTeamSearch.searchSubmitted
          $scope.manageTeamMembership.joinTeamSearch.searchPage = 1
          $scope.manageTeamMembership.joinTeamSearch.searchString = ''
          $scope.manageTeamMembership.joinTeamSearch.searchSubmitted = false
          $scope.manageTeamMembership.joinTeamSearch.searchResults = []
          $scope.manageTeamMembership.joinTeamSearch.searchTotalNumber = 0
        dataStr = ''
        if $scope.manageTeamMembership.joinTeamSearch.teamName.length > 0
          dataStr += '&team_name=' + $scope.manageTeamMembership.joinTeamSearch.teamName
        if $scope.manageTeamMembership.joinTeamSearch.teamCompany.length > 0
          dataStr += '&team_company=' + $scope.manageTeamMembership.joinTeamSearch.teamCompany
        if $scope.manageTeamMembership.joinTeamSearch.captainFirst.length > 0 or $scope.manageTeamMembership.joinTeamSearch.captainLast.length > 0
          captainNameLength = $scope.manageTeamMembership.joinTeamSearch.captainFirst.length + $scope.manageTeamMembership.joinTeamSearch.captainLast.length
          if dataStr.length is 0 and captainNameLength < 3
            $translate 'manage_membership_search_captain_name_min_chars'
              .then (translation) ->
                $scope.manageTeamMembership.joinTeamAlerts.push
                  type: 'danger'
                  msg: translation
              , (translationId) ->
                $scope.manageTeamMembership.joinTeamAlerts.push
                  type: 'danger'
                  msg: translationId
          else
            if $scope.manageTeamMembership.joinTeamSearch.captainFirst.length > 0
              dataStr += '&first_name=' + $scope.manageTeamMembership.joinTeamSearch.captainFirst
            if $scope.manageTeamMembership.joinTeamSearch.captainLast.length > 0
              dataStr += '&last_name=' + $scope.manageTeamMembership.joinTeamSearch.captainLast
        if dataStr.length is 0
          $translate 'manage_membership_search_failure'
            .then (translation) ->
              $scope.manageTeamMembership.joinTeamAlerts.push
                type: 'danger'
                msg: translation
            , (translationId) ->
              $scope.manageTeamMembership.joinTeamAlerts.push
                type: 'danger'
                msg: translationId
        else
          $scope.manageTeamMembership.joinTeamSearch.searchString = dataStr
          $scope.searchTeamsPage()

      $scope.searchTeamsPage = ->
        dataStr = 'include_cross_event=false&full_search=false'
        dataStr += '&list_sort_column=name&list_ascending=true'
        dataStr += '&list_page_size=5&list_page_offset=' + ($scope.manageTeamMembership.joinTeamSearch.searchPage - 1)
        dataStr += $scope.manageTeamMembership.joinTeamSearch.searchString
        $scope.manageTeamMembership.joinTeamSearch.searchSubmitted = true
        searchTeamsPromise = TeamraiserTeamService.getTeams dataStr
          .then (response) ->
            if response.data.errorResponse
              if response.data.errorResponse.message
                $scope.manageTeamMembership.joinTeamAlerts.push
                  type: 'danger'
                  msg: response.data.errorResponse.message
              else
                $translate 'manage_membership_search_failure'
                  .then (translation) ->
                    $scope.manageTeamMembership.joinTeamAlerts.push
                      type: 'danger'
                      msg: translation
                  , (translationId) ->
                    $scope.manageTeamMembership.joinTeamAlerts.push
                      type: 'danger'
                      msg: translationId
            else
              results = response.data.getTeamSearchByInfoResponse.team
              results = [results] if not angular.isArray results
              $scope.manageTeamMembership.joinTeamSearch.searchResults = results
              $scope.manageTeamMembership.joinTeamSearch.searchTotalNumber = Number response.data.getTeamSearchByInfoResponse.totalNumberResults
            response
        $scope.eventOptionsPromises.push searchTeamsPromise

      $scope.joinTeam = (teamId, requiresPassword, teamPassword) ->
        if requiresPassword and requiresPassword is 'true' and (!teamPassword or teamPassword.length is 0)
          $scope.manageTeamMembership.joinTeamSearch.joinTeamId = teamId
          $scope.manageTeamMembership.joinTeamSearch.joinTeamPassword = ''
          $scope.joinTeamPasswordModal = $uibModal.open
            scope: $scope
            templateUrl: APP_INFO.rootPath + 'html/modal/joinTeamPassword.html'
        else
          dataStr = 'team_id=' + teamId
          if requiresPassword and requiresPassword is 'true' and teamPassword and teamPassword.length > 0
            dataStr += '&team_password=' + teamPassword
          joinTeamPromise = TeamraiserTeamService.joinTeam dataStr
            .then (response) ->
              if response.data.errorResponse
                if response.data.errorResponse.message
                  $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                    type: 'danger'
                    msg: response.data.errorResponse.message
                else
                  $translate 'manage_membership_join_team_unexpected_error'
                    .then (translation) ->
                      $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                        type: 'danger'
                        msg: translation
                    , (translationId) ->
                      $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                        type: 'danger'
                        msg: translationId
              else
                teamName = response.data.joinTeamResponse?.team?.name
                $translate 'manage_membership_join_team_success'
                  .then (translation) ->
                    $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                      type: 'success'
                      msg: translation + teamName + '.'
                  , (translationId) ->
                    $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                      type: 'success'
                      msg: translationId + teamName + '.'
                $scope.manageTeamMembership.joinTeamSearch.joinTeamId = ''
                $scope.manageTeamMembership.joinTeamSearch.joinTeamPassword = ''
                $scope.manageTeamMembership.currentTeamId = response.data.joinTeamResponse?.team?.id
                $scope.manageTeamMembership.currentSelection = 'stay'
                $scope.refreshRegistration()
              response
          $scope.eventOptionsPromises.push joinTeamPromise

      $scope.leaveTeam = ->
        leaveTeamPromise = TeamraiserTeamService.leaveTeam()
          .then (response) ->
            if response.data.errorResponse
              if response.data.errorResponse.message
                $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                  type: 'danger'
                  msg: response.data.errorResponse.message
              else
                $translate 'manage_membership_leave_team_unexpected_error'
                  .then (translation) ->
                    $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                      type: 'danger'
                      msg: translation
                  , (translationId) ->
                    $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                      type: 'danger'
                      msg: translationId
            else
              $translate 'manage_membership_leave_team_success'
                .then (translation) ->
                  $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                    type: 'success'
                    msg: translation
                , (translationId) ->
                  $scope.manageTeamMembership.manageTeamMembershipAlerts.push
                    type: 'success'
                    msg: translationId
              $scope.manageTeamMembership.currentTeamId = '-1'
              $scope.manageTeamMembership.currentSelection = 'stay'
              $scope.refreshRegistration()
            response
          $scope.eventOptionsPromises.push joinTeamPromise
      
      $scope.cancelJoinTeamPassword = ->
        $scope.manageTeamMembership.joinTeamSearch.joinTeamId = ''
        $scope.manageTeamMembership.joinTeamSearch.joinTeamPassword = ''
        $scope.joinTeamPasswordModal.close()

      $scope.clearTeamMembershipAlert = (index) ->
        $scope.manageTeamMembership.manageTeamMembershipAlerts.splice index,1

      $scope.clearJoinTeamAlert = (index) ->
        $scope.manageTeamMembership.joinTeamAlerts.splice index,1

      $scope.clearAllTeamMembershipAlerts = ->
        $scope.manageTeamMembership.manageTeamMembershipAlerts = []
        $scope.manageTeamMembership.joinTeamAlerts = []
  ]